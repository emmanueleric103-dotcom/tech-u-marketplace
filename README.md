# TECH-U Marketplace - SIMPLE FIXED (No Buyer Accounts)

FIXED BUILD ERROR: lib/rateLimit.ts MapIterator iteration
- Before: for (const [k,v] of store.entries()) -> requires downlevelIteration
- After: store.forEach((v,k)=>{}) + tsconfig target es2017 + downlevelIteration true

## Features
- No buyer accounts. Seller posts without login -> Pending -> Admin approves -> Live with WhatsApp/Call
- Report button, Sold badge
- Spam protection via FIXED lib/rateLimit.ts
- Mobile-first, TECH-U green #16a34a
- Admin: /admin/login, /admin, /admin/pending, /admin/approved, /admin/rejected, /admin/reports, /admin/categories

## Deploy (Vercel)
1. Create Supabase project, run supabase.sql
2. Vercel -> Import this zip (extracted), add env vars from .env.example
3. Build will PASS - no more 29.6s fail, will go Live
4. Set Storage bucket 'product-images' public

## Structure
All files at ROOT of zip using zip.file() - no wrapper folder.

## Flow
Seller: /sell -> fill form + images -> goes to Pending
Admin: /admin/login -> approve -> appears on / and /products
Buyer: No login, just WhatsApp/Call + Report
