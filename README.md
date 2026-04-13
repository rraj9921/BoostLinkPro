# InstaAutomation Platform

## Verified Package Versions (Feb 2026)
| Package | Version | Source |
|---|---|---|
| next | 16.1.6 | nextjs.org/docs |
| react / react-dom | ^19.2.0 | react.dev |
| @supabase/supabase-js | ^2.98.0 | npmjs.com |
| @supabase/ssr | ^0.8.0 | npmjs.com |
| @tanstack/react-query | ^5.90.23 | npmjs.com |
| zustand | ^5.0.11 | npmjs.com |
| zod | ^4.3.6 | npmjs.com |
| lucide-react | ^0.575.0 | npmjs.com |
| sonner | ^2.0.7 | npmjs.com |
| react-hook-form | ^7.69.0 | npmjs.com |
| axios | ^1.13.6 | npmjs.com |
| bullmq | ^5.70.1 | npmjs.com |
| ioredis | ^5.10.0 | npmjs.com |
| express | ^5.1.0 | npmjs.com |
| tailwindcss | ^4.1.8 | npmjs.com |

## Next.js 16 Breaking Changes Applied
- `cookies()` / `headers()` / `params` are fully async (no sync fallback)
- `middleware.ts` renamed to `proxy.ts`
- `next.config.js` changed to `next.config.ts`
- Turbopack is default - no flag needed in `npm run dev`
- Node.js 20.9+ required
- Tailwind v4 uses `@import "tailwindcss"` + `@theme {}` CSS-first config

## Project Structure
```
insta-v2/
├── frontend/                  (Next.js 16 - deploy to Vercel)
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/login/    Login page
│   │   │   ├── auth/signup/   Signup page
│   │   │   ├── dashboard/     Dashboard (layout + all pages)
│   │   │   └── page.tsx       Redirects to /auth/login
│   │   ├── components/shared/ QueryProvider
│   │   ├── lib/supabase/      Browser + server Supabase clients
│   │   ├── lib/api.ts         Axios client (auto JWT)
│   │   ├── store/authStore.ts Zustand v5 auth state
│   │   ├── types/index.ts     All TypeScript types
│   │   └── proxy.ts           Next.js 16 route protection (was middleware.ts)
│   ├── next.config.ts         Next.js 16 TS config
│   ├── postcss.config.mjs     Tailwind v4 postcss
│   └── tsconfig.json
│
├── backend/                   (Express 5 + Node.js - deploy to Railway)
│   └── src/
│       ├── index.ts           Main server
│       ├── config/supabase.ts Supabase admin client
│       ├── middleware/auth.ts JWT verification
│       ├── routes/            All API routes
│       ├── controllers/       instagram + automations
│       ├── services/automation/automationEngine.ts  Keyword matching
│       └── jobs/
│           ├── queues.ts      BullMQ queues
│           └── worker.ts      Background DM sender
│
└── supabase-schema.sql        Run in Supabase SQL Editor
```

## Setup

### 1. Install Node.js 20.9+
```bash
node -v  # must be v20.9 or higher
```

### 2. Install dependencies
```bash
cd frontend && npm install
cd ../backend && npm install
```

### 3. Supabase setup
1. Create project at supabase.com
2. SQL Editor > paste supabase-schema.sql > Run
3. Settings > API > copy URL and anon key

### 4. Environment variables
```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example  backend/.env
# Fill in Supabase URL + keys
```

### 5. Run
```bash
# Terminal 1
cd frontend && npm run dev    # http://localhost:3000

# Terminal 2
cd backend && npm run dev     # http://localhost:4000

# Terminal 3 (background job processor)
cd backend && npm run worker
```

### 6. Verify
- http://localhost:3000 → login page
- http://localhost:4000/health → {"status":"ok"}
