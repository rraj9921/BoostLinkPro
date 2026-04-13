# Deployment Guide for Vercel

## Prerequisites
- GitHub account with repository pushed
- Vercel account (sign up at vercel.com with GitHub)

## Step 1: Push to GitHub

```bash
# Initialize git if not already done
cd /home/rraj/Downloads/insta-v2-latest/insta-v2
git init
git add .
git commit -m "Initial commit - BoostLinkPro"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Project Settings:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Environment Variables** (click "Environment Variables"):
   Add ALL these from your `backend/.env`:
   ```
   PORT=4000
   NODE_ENV=production
   SUPABASE_URL=https://pioatcendofqumfrkylv.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_key_here
   META_APP_ID=1980821919478557
   META_APP_SECRET=80ed46261c1501e7870f80d26b16bf65
   META_WEBHOOK_VERIFY_TOKEN=your-random-verify-token
   REDIS_URL=redis://localhost:6380
   RAZORPAY_KEY_ID=rzp_test_xxx
   RAZORPAY_KEY_SECRET=your-secret
   RESEND_API_KEY=re_xxx
   EMAIL_FROM=noreply@yourdomain.com
   FRONTEND_URL=https://your-frontend.vercel.app
   JWT_SECRET=your-jwt-secret-min-32-chars
   ```

6. Click **Deploy**
7. Copy your backend URL (e.g., `https://your-backend.vercel.app`)

## Step 3: Deploy Frontend to Vercel

1. Click "Add New" → "Project" again
2. Import the SAME GitHub repository
3. **Project Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend2`
   - **Build Command:** `npm run build`
   - **Output Directory:** Leave default
   - **Install Command:** `npm install`

4. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
   NEXT_PUBLIC_SUPABASE_URL=https://pioatcendofqumfrkylv.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   NEXT_PUBLIC_META_APP_ID=1980821919478557
   ```

5. Click **Deploy**
6. Copy your frontend URL (e.g., `https://your-frontend.vercel.app`)

## Step 4: Update Backend CORS

Go back to your backend deployment on Vercel:
1. Go to Settings → Environment Variables
2. Update `FRONTEND_URL` to your actual frontend URL
3. Redeploy the backend

## Step 5: Update Frontend API URL

If your backend URL changed:
1. Go to frontend Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to your actual backend URL
3. Redeploy the frontend

## Important Notes

⚠️ **Redis Issue:** Vercel serverless functions don't support Redis connections. You need to either:
- Use **Upstash Redis** (free tier available): https://upstash.com
- Or temporarily disable automation features

⚠️ **Background Jobs:** Worker processes won't run on Vercel. For full automation:
- Deploy worker separately to Railway/Render
- Or use Vercel Cron Jobs + disable BullMQ

## Quick Fix for Redis

### Option 1: Use Upstash (Recommended)
1. Go to https://upstash.com
2. Create free Redis database
3. Copy the Redis URL
4. Update `REDIS_URL` in backend environment variables on Vercel
5. Redeploy

### Option 2: Disable Automation (Temporary)
In `backend/src/index.ts`, comment out:
```typescript
// import { dmQueue, emailQueue } from "./jobs/queues.ts";
```

## After Deployment

Your app will be live at:
- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://your-backend.vercel.app

Share the frontend URL with anyone to demo your app!

## Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check environment variables are set

**API not working?**
- Verify `NEXT_PUBLIC_API_URL` in frontend env vars
- Check CORS settings in backend
- Check backend logs in Vercel dashboard

**Redis errors?**
- Set up Upstash Redis (see above)
- Or temporarily disable automation features
