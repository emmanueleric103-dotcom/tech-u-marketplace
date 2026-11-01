-- TECH-U Marketplace SIMPLE FIXED - supabase.sql
-- Run in Supabase SQL Editor

-- Enable storage
create extension if not exists "uuid-ossp";

-- Products table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  price integer not null,
  category text not null,
  condition text not null,
  seller_name text not null,
  seller_phone text not null,
  seller_whatsapp text not null,
  images text[] default '{}',
  status text not null default 'pending' check (status in ('pending','approved','rejected','sold')),
  created_at timestamp with time zone default now()
);

-- Reports table
create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  reason text not null,
  created_at timestamp with time zone default now()
);

-- RLS off for simple build (or enable with public policies)
alter table products disable row level security;
alter table reports disable row level security;

-- Storage bucket for images (create via Dashboard > Storage > New bucket: product-images public)
-- Policy: allow public read, allow insert for anon
-- If using SQL for storage policies:
-- insert into storage.buckets (id, name, public) values ('product-images','product-images', true) on conflict do nothing;

-- Indexes
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_created on products(created_at desc);
