-- TECH-U Marketplace REAL SQL
-- Enable extension
create extension if not exists "uuid-ossp";

-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  matric_no text,
  department text,
  created_at timestamptz default now()
);

-- products with stock, product_type, whatsapp, phone, image_urls
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric not null,
  stock integer not null default 1,
  product_type text not null check (product_type in ('physical','digital')),
  category text,
  whatsapp text,
  phone text,
  image_urls text[] default '{}',
  created_at timestamptz default now()
);

-- requests
create table public.requests (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  buyer_id uuid references auth.users(id) on delete cascade,
  seller_id uuid references auth.users(id) on delete cascade,
  message text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.requests enable row level security;

-- Policies
create policy "Public read products" on public.products for select using (true);
create policy "Users insert own products" on public.products for insert with check (auth.uid() = user_id);
create policy "Users update own products" on public.products for update using (auth.uid() = user_id);
create policy "Users delete own products" on public.products for delete using (auth.uid() = user_id);

create policy "Public read profiles" on public.profiles for select using (true);
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);

create policy "Users read own requests" on public.requests for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Users create requests" on public.requests for insert with check (true);

-- Storage bucket Image (capital I)
insert into storage.buckets (id, name, public) values ('Image','Image', true) on conflict (id) do nothing;

-- 4 policies for bucket Image
create policy "Public read Image" on storage.objects for select using (bucket_id = 'Image');
create policy "Auth upload Image" on storage.objects for insert with check (bucket_id = 'Image' and auth.role() = 'authenticated');
create policy "Auth update Image" on storage.objects for update using (bucket_id = 'Image' and auth.role() = 'authenticated');
create policy "Auth delete Image" on storage.objects for delete using (bucket_id = 'Image' and auth.role() = 'authenticated');
