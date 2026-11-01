# TECH-U MARKETPLACE - Simple Real Campus Marketplace

Clean, fast, mobile-first marketplace for Abiola Ajimobi First Technical University (TECH-U), Ibadan.

Flow: Seller → Post Item (no account) → Pending Approval → Admin Approves → Appears Online → Buyer Clicks WhatsApp → Contacts Seller Directly.

## Features
- No buyer accounts, no buyer login, no cart, no payment, no internal chat
- Seller posts without account
- Admin approval required (pending -> approved/rejected)
- Browse, search, filter by keyword, category, price min/max, condition New/Used, newest
- Product details with images, WhatsApp auto-message: "Hello, I saw your [PRODUCT NAME] on TECH-U Marketplace..."
- Call seller tel:
- Report listing (scam, wrong info, inappropriate, already sold, other)
- Sold badge, hide sold by default filter
- Image validation: jpg/png/webp, max 2MB each, max 3 images, compressed to ~300KB via canvas
- Rate limiting: max 3 posts per hour per IP (in-memory)
- Mobile-first, TECH-U green #16a34a, white cards rounded-2xl, rounded-full buttons
- Real backend Supabase, real DB, Image bucket capital I

## Tech Stack
- Next.js 14 App Router
- Supabase (DB + Auth + Storage)
- Tailwind CSS

## Quick Start Local

1. Clone/unzip - files at ROOT (not nested folder) to fix ENOENT package.json error
2. `npm install`
3. Copy env:
   ```bash
   cp .env.example .env.local
   # fill NEXT_PUBLIC_SUPABASE_URL and ANON_KEY
   ```
4. Setup Supabase:
   - Create project at supabase.com
   - Run supabase.sql in SQL Editor
   - Storage > Create bucket named `Image` (capital I) public true
   - Set bucket policies to allow public read + insert
5. Create first admin account:
   - Supabase Dashboard > Authentication > Add user > email + password
   - Optionally insert into admins table: `insert into admins (id, email) values ('auth_user_uuid','admin@tech-u.edu.ng')`
   - Or set ADMIN_EMAILS in .env (comma separated)
6. `npm run dev`

## Env Vars

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_EMAILS=admin@tech-u.edu.ng
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Deploy on Render

- Connect GitHub repo
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Add env vars in Render dashboard
- Ensure root has package.json (this zip has files at root via zip.file() directly, no folder wrapper)

## Pages

Public: /, /products, /products/[id], /categories, /sell, /safety
Admin: /admin/login, /admin, /admin/pending, /admin/approved, /admin/rejected, /admin/reports, /admin/categories

## Image Storage

- Bucket: Image (capital I)
- Public true
- 4 policies: select public, insert/update/delete authenticated + public insert for sellers
- Type validation, size limit 2MB, quantity 3, compression via canvas to ~300KB

## Safety

- Admin approves all listings
- Report button on every product
- No online payment - meet on campus
- Rate limiting via lib/rateLimit.ts
