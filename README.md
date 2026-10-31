# TECH-U Marketplace - Clean Recode

FIX for duplicate 'use client' webpack error.

## The Bug
Previous build failed at 17s with:
- duplicate 'use client' directives
- wrong order: imports before 'use client'

## The Fix (This Zip)
Every client page now has EXACTLY:
Line 1: 'use client'
Line 2: export const dynamic = 'force-dynamic'
Line 3+: imports

No duplicates. No Supabase logic in middleware.

## Install
1. DELETE ALL old code first: rm -rf app components lib etc
2. Unzip this clean zip into ~/tech-u-marketplace
   unzip tech-u-marketplace-clean.zip -d ~/tech-u-marketplace
   (overwrite)

3. Set env vars in Render:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY

4. git add . && git commit -m "clean recode fix" && git push

5. Render will go LIVE in ~50s (not 17s fail). Check build logs: no webpack error.

## DB Schema (Supabase)
products: id uuid, title text, price int, description text, category text, user_id uuid, created_at timestamp
profiles: id uuid (fk auth.users), full_name text

RLS: enable, policies for public read and auth insert.

Build command: npm run build
Start: npm run start
