# TECH-U Marketplace - Fixed Alias Error

## Render Error Fixed
`Module not found: Can't resolve '@/lib/supabase'`

### Root Cause
tsconfig @/* alias didn't resolve on Render because Next.js build couldn't find the path mapping.

### Fix
Changed ALL imports from:
```ts
import { createClient } from '@/lib/supabase'  // ❌ BREAKS ON RENDER
```
To RELATIVE:
```ts
import { createClient } from '../lib/supabase'          // app/page.tsx
import { createClient } from '../../lib/supabase'       // app/products/page.tsx, app/sell/page.tsx, etc
import { createClient } from '../../../lib/supabase'    // app/auth/login/page.tsx (3 deep)
import { createClient } from '../lib/supabase'          // components/Header.tsx
```

### Also Fixed
- lib/supabase.ts has placeholder fallback: `process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'`
- So build never fails even without env vars
- middleware.ts simple NextResponse.next()
- app/layout.tsx is server component, no 'use client'
- All client pages: ONLY ONE 'use client' at line 1, then export const dynamic='force-dynamic' at line 2
- Login redirect loop fixed: profile shows "Go to Login" button linking to /auth/login

## Deploy on Render
1. Add env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
2. Build command: npm run build
3. Will Live in 50s

Design: Jiji.ng style, green #16a34a, white cards rounded-2xl
