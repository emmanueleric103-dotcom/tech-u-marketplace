# TECH-U Marketplace - Real Engine (Jiji.ng-like)

This is REAL, not demo. Fixes:
- Login persistence via middleware.ts session refresh, Header uses onAuthStateChange
- Profile 404 fixed: app/profile/page.tsx reads auth user and saves to public.profiles
- Real search: ilike query on Supabase, not hardcoded iPhone 13 320k
- Empty state: "No listings yet" when DB empty
- Real image upload: max 3, max 2MB each, compress to 800px JPEG 70% to save 1GB free tier, bucket named Image (capital I)
- Dashboard real data: where user_id = current user, counts Total/Active/Sold
- WhatsApp link like Jiji: https://wa.me/{whatsapp}?text=Hi...

Setup:
1. Create Supabase project
2. SQL Editor -> paste supabase.sql
3. Storage -> New Bucket -> Name: Image (capital I), Public ON, limit 2MB
4. Storage policies: 4 policies as in supabase.sql comment
5. Set env vars in .env.local from .env.example
6. npm install, npm run dev
7. git push to Render: Connect repo, Build command npm run build, Start npm start, add env vars in Render dashboard
