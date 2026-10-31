-- TECH-U Marketplace - Real Supabase Setup (copy to SQL Editor)
-- 1. Profiles table (fixes 404)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  department text,
  phone text,
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- 2. Products table (real engine, no hardcoded iPhone 13 320k)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  price integer not null,
  condition text check (condition in ('new','used','refurbished')),
  category text,
  pickup_location text,
  whatsapp text,
  images text[] default '{}',
  status text default 'active',
  created_at timestamp with time zone default now()
);
alter table public.products enable row level security;
create policy "Products are viewable by everyone" on public.products for select using (true);
create policy "Authenticated can insert" on public.products for insert with check (auth.role() = 'authenticated');
create policy "Users can update own" on public.products for update using (auth.uid() = user_id);
create policy "Users can delete own" on public.products for delete using (auth.uid() = user_id);

-- 3. Storage bucket Image (capital I) - create in Dashboard > Storage > New Bucket named Image (public)
-- Then set policies: (or run via storage api)
-- insert policy for bucket Image
-- You must create bucket manually: Name = Image, Public = true, File size limit = 2MiB, Allowed MIME: image/*

-- Storage policies (run after bucket creation):
-- create policy "Public read Image" on storage.objects for select using (bucket_id = 'Image');
-- create policy "Auth upload Image" on storage.objects for insert with check (bucket_id = 'Image' AND auth.role() = 'authenticated');
-- create policy "Auth update own Image" on storage.objects for update using (bucket_id = 'Image' AND auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Auth delete own Image" on storage.objects for delete using (bucket_id = 'Image' AND auth.uid()::text = (storage.foldername(name))[1]);
