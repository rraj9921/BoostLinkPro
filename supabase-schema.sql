-- ================================================================
-- InstaAutomation — Supabase Database Schema
-- Paste this into Supabase SQL Editor and click Run
-- ================================================================

create extension if not exists "uuid-ossp";

-- ── Profiles (extends auth.users) ────────────────────────────────
create table public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  full_name  text,
  username   text unique,
  bio        text,
  avatar_url text,
  plan       text default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, username)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Instagram Accounts ────────────────────────────────────────────
create table public.instagram_accounts (
  id                  uuid default uuid_generate_v4() primary key,
  user_id             uuid references auth.users(id) on delete cascade unique,
  ig_user_id          text unique,
  username            text,
  name                text,
  profile_picture_url text,
  access_token        text,
  token_expires_at    timestamptz,
  followers_count     int default 0,
  is_connected        boolean default true,
  connected_at        timestamptz default now()
);

-- ── Automations ───────────────────────────────────────────────────
create table public.automations (
  id               uuid default uuid_generate_v4() primary key,
  user_id          uuid references auth.users(id) on delete cascade,
  ig_account_id    uuid references public.instagram_accounts(id) on delete cascade,
  name             text not null,
  keywords         text[] not null default '{}',
  dm_message       text not null,
  comment_reply    text default '',
  follow_condition boolean default false,
  post_ids         text[] default '{}',
  is_active        boolean default true,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── Comment Events ────────────────────────────────────────────────
create table public.comment_events (
  id                   uuid default uuid_generate_v4() primary key,
  automation_id        uuid references public.automations(id) on delete cascade,
  commenter_ig_id      text not null,
  commenter_username   text,
  comment_text         text,
  post_id              text,
  keyword_matched      text,
  dm_sent              boolean default false,
  comment_reply_sent   boolean default false,
  follow_condition_met boolean default false,
  created_at           timestamptz default now()
);

-- ── Digital Products ──────────────────────────────────────────────
create table public.products (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete cascade,
  name          text not null,
  description   text default '',
  price_cents   int not null check (price_cents >= 99),
  type          text not null check (type in ('pdf','video','audio','course','template','other')),
  file_url      text,
  thumbnail_url text,
  is_active     boolean default true,
  sales_count   int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Orders ────────────────────────────────────────────────────────
create table public.orders (
  id                  uuid default uuid_generate_v4() primary key,
  product_id          uuid references public.products(id),
  buyer_email         text not null,
  buyer_name          text,
  amount              int not null,
  currency            text default 'INR',
  status              text default 'pending' check (status in ('pending','paid','failed','refunded')),
  razorpay_order_id   text,
  razorpay_payment_id text,
  access_granted      boolean default false,
  created_at          timestamptz default now()
);

-- ── Bio Links ─────────────────────────────────────────────────────
create table public.bio_links (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references auth.users(id) on delete cascade,
  title      text not null,
  url        text not null,
  type       text default 'link' check (type in ('link','product','amazon','myntra','social')),
  is_active  boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────────
alter table public.profiles           enable row level security;
alter table public.instagram_accounts enable row level security;
alter table public.automations        enable row level security;
alter table public.comment_events     enable row level security;
alter table public.products           enable row level security;
alter table public.orders             enable row level security;
alter table public.bio_links          enable row level security;

create policy "own_profile"      on public.profiles           for all using (auth.uid() = id);
create policy "own_instagram"    on public.instagram_accounts for all using (auth.uid() = user_id);
create policy "own_automations"  on public.automations        for all using (auth.uid() = user_id);
create policy "own_events"       on public.comment_events     for select
  using (automation_id in (select id from automations where user_id = auth.uid()));
create policy "public_products"  on public.products           for select using (is_active = true);
create policy "own_products"     on public.products           for all using (auth.uid() = user_id);
create policy "public_bio_links" on public.bio_links          for select using (is_active = true);
create policy "own_bio_links"    on public.bio_links          for all using (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────────
create index idx_automations_user    on public.automations(user_id);
create index idx_comment_events_auto on public.comment_events(automation_id);
create index idx_comment_events_date on public.comment_events(created_at);
create index idx_products_user       on public.products(user_id);
create index idx_bio_links_user      on public.bio_links(user_id);
