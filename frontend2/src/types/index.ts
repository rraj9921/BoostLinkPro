// ── User ─────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  plan: "free" | "pro";
  created_at: string;
}

// ── Instagram Account ─────────────────────────────────────────────
export interface InstagramAccount {
  id: string;
  user_id: string;
  ig_user_id: string;
  username: string;
  name: string;
  profile_picture_url: string;
  token_expires_at: string;
  followers_count: number;
  is_connected: boolean;
  connected_at: string;
}

// ── Automation ────────────────────────────────────────────────────
export interface Automation {
  id: string;
  user_id: string;
  ig_account_id: string;
  name: string;
  keywords: string[];
  dm_message: string;
  comment_reply: string;
  follow_condition: boolean;
  post_ids: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Product ───────────────────────────────────────────────────────
export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number; // paise
  file_url: string;
  file_type: "pdf" | "video" | "audio" | "zip" | "other";
  thumbnail_url?: string;
  is_active: boolean;
  sales_count: number;
  created_at: string;
}

// ── Order ─────────────────────────────────────────────────────────
export interface Order {
  id: string;
  product_id: string;
  buyer_email: string;
  buyer_name: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  access_granted: boolean;
  created_at: string;
}

// ── Bio Link ──────────────────────────────────────────────────────
export interface BioLink {
  id: string;
  user_id: string;
  title: string;
  url: string;
  type: "link" | "product" | "amazon" | "myntra" | "social";
  is_active: boolean;
  sort_order: number;
}

// ── Analytics ─────────────────────────────────────────────────────
export interface AnalyticsOverview {
  dms_sent_today: number;
  dms_sent_total: number;
  active_automations: number;
  link_clicks: number;
  revenue_total: number;
  profile_views: number;
}

// ── API Response ──────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
