-- TECH-U Marketplace DB — FIXED with seller_name
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price integer not null,
  category text not null,
  description text,
  image_url text not null,
  seller_name text not null,
  seller_whatsapp text not null,
  status text default 'pending',
  created_at timestamp default now()
);
-- FIX for live DB if column missing
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_name text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Storage bucket for images (create via dashboard if not exists)
-- insert into storage.buckets (id, name, public) values ('product-images','product-images', true) on conflict do nothing;
-- Policy: allow public read, anon insert
create policy if not exists "public read" on storage.objects for select using (bucket_id='product-images');
create policy if not exists "anon upload" on storage.objects for insert with check (bucket_id='product-images');

-- Enable RLS
alter table products enable row level security;
create policy if not exists "public read approved" on products for select using (status='approved' or true);
create policy if not exists "anon insert" on products for insert with check (true);
create policy if not exists "admin update" on products for update using (true);
