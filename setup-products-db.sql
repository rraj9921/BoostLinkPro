-- ================================================================
-- Products Module Setup - Run this in Supabase SQL Editor
-- ================================================================

-- Step 1: Ensure products table exists (if not already created)
CREATE TABLE IF NOT EXISTS public.products (
  id            uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text DEFAULT '',
  price_cents   int NOT NULL CHECK (price_cents >= 99),
  type          text NOT NULL CHECK (type IN ('pdf','video','audio','course','template','other')),
  file_url      text,
  thumbnail_url text,
  is_active     boolean DEFAULT true,
  sales_count   int DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Step 2: Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies
-- Allow users to view active products (for checkout pages)
DROP POLICY IF EXISTS "public_products" ON public.products;
CREATE POLICY "public_products" ON public.products
  FOR SELECT
  USING (is_active = true);

-- Allow users to manage their own products
DROP POLICY IF EXISTS "own_products" ON public.products;
CREATE POLICY "own_products" ON public.products
  FOR ALL
  USING (auth.uid() = user_id);

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_user ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

-- ================================================================
-- IMPORTANT: Create Storage Bucket
-- ================================================================
-- Go to: Supabase Dashboard → Storage → Create new bucket
-- Bucket name: product-files
-- Public bucket: Yes (for file downloads)
-- File size limit: 500 MB
-- Allowed MIME types: application/pdf, video/*, audio/*, application/zip, etc.

-- Then run this to set storage policies:
-- (This allows authenticated users to upload to their own folder)

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-files', 'product-files', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to their own folder
DROP POLICY IF EXISTS "Users can upload files" ON storage.objects;
CREATE POLICY "Users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own files
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public to read files (for downloads after purchase)
DROP POLICY IF EXISTS "Public can read files" ON storage.objects;
CREATE POLICY "Public can read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-files');

-- ================================================================
-- Verification Queries
-- ================================================================

-- Check if table exists and has correct structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'products'
ORDER BY ordinal_position;

-- Check if policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'products';

-- Check if storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'product-files';

-- ================================================================
-- Test Data (Optional - for testing)
-- ================================================================

-- Insert a test product (replace 'YOUR_USER_ID' with actual user ID)
-- INSERT INTO public.products (user_id, name, description, price_cents, type, is_active)
-- VALUES (
--   'YOUR_USER_ID',
--   'Test PDF Guide',
--   'A sample product for testing',
--   999,
--   'pdf',
--   true
-- );

-- ================================================================
-- DONE!
-- ================================================================
-- After running this:
-- 1. Verify the table exists: SELECT * FROM products;
-- 2. Verify storage bucket: Check Supabase Dashboard → Storage
-- 3. Try creating a product from the UI
-- ================================================================
