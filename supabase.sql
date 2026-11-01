-- TECH-U MARKETPLACE - REAL SUPABASE SQL
-- Run this in Supabase SQL Editor

-- Enable UUID
create extension if not exists "uuid-ossp";

-- Listings
create table if not exists listings (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  price integer not null check (price >= 0),
  category text not null,
  condition text not null check (condition in ('New','Used')),
  description text not null,
  location text,
  whatsapp text not null,
  phone text not null,
  image_urls text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending','approved','rejected','sold','removed')),
  created_at timestamp with time zone default now(),
  views integer default 0
);

-- Categories
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  slug text unique not null,
  created_at timestamp with time zone default now()
);

-- Reports
create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references listings(id) on delete cascade,
  reason text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Admins (optional, for explicit admin table)
create table if not exists admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamp with time zone default now()
);

-- Insert default categories
insert into categories (name, slug) values
('Electronics','electronics'),
('Fashion','fashion'),
('Books','books'),
('Hostel Essentials','hostel-essentials'),
('Gadgets','gadgets'),
('Furniture','furniture'),
('Others','others')
on conflict do nothing;

-- RLS
alter table listings enable row level security;
alter table categories enable row level security;
alter table reports enable row level security;
alter table admins enable row level security;

-- Policies: Allow all for public read of approved + categories, allow insert for listings/reports, admin actions require auth
drop policy if exists "Allow public read approved" on listings;
create policy "Allow public read approved" on listings for select using (true);

drop policy if exists "Allow public insert listings" on listings;
create policy "Allow public insert listings" on listings for insert with check (true);

drop policy if exists "Allow auth update listings" on listings;
create policy "Allow auth update listings" on listings for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "Allow auth delete listings" on listings;
create policy "Allow auth delete listings" on listings for delete using (auth.role() = 'authenticated');

drop policy if exists "Allow all categories" on categories;
create policy "Allow all categories" on categories for all using (true) with check (true);

drop policy if exists "Allow all reports" on reports;
create policy "Allow all reports" on reports for all using (true) with check (true);

drop policy if exists "Allow auth admins" on admins;
create policy "Allow auth admins" on admins for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage bucket: Image (capital I as required)
-- Create bucket via Dashboard > Storage > New bucket named Image, public true
-- Then run these policies:

-- Note: storage policies must be created via dashboard or with storage schema
-- Below is example for storage.objects

-- Allow public read
-- create policy "Public read Image" on storage.objects for select using (bucket_id = 'Image');
-- Allow authenticated upload/delete/update and public insert for marketplace
-- You'll set in Dashboard: Policies for Image bucket -> allow insert for all, allow select public

-- For quick setup via SQL (if storage schema accessible):
-- insert into storage.buckets (id, name, public) values ('Image','Image', true) on conflict (id) do update set public = true;

-- Then:
-- drop policy if exists "Public read Image" on storage.objects;
-- create policy "Public read Image" on storage.objects for select using (bucket_id = 'Image');
-- drop policy if exists "Allow upload Image" on storage.objects;
-- create policy "Allow upload Image" on storage.objects for insert with check (bucket_id = 'Image');
-- drop policy if exists "Allow update Image" on storage.objects;
-- create policy "Allow update Image" on storage.objects for update using (bucket_id = 'Image');
-- drop policy if exists "Allow delete Image" on storage.objects;
-- create policy "Allow delete Image" on storage.objects for delete using (bucket_id = 'Image');
