# Quick Fix for Vercel 404 Error

## The Problem
React Router routes return 404 on Vercel because Vercel tries to find actual files for routes like `/dashboard/goals`, but they don't exist - they're handled by React Router.

## The Solution (Already Done!)
✅ Created `vercel.json` file in `LIFEBOARD/frontend/`

## What You Need to Do Now

### Step 1: Push to GitHub
```bash
cd LIFEBOARD
git add .
git commit -m "Fix Vercel 404 - Add vercel.json for React Router"
git push origin main
```

### Step 2: Redeploy on Vercel
1. Go to your Vercel dashboard
2. Find your project
3. Click "Redeploy" (or it will auto-deploy from GitHub)
4. Wait for deployment to complete

### Step 3: Verify It Works
1. Visit your Vercel URL
2. Try navigating to different routes:
   - `/dashboard`
   - `/dashboard/goals`
   - `/dashboard/settings`
3. Refresh the page on any route - should NOT get 404

## If Still Getting 404

### Check 1: Vercel Project Settings
- Root Directory: `LIFEBOARD/frontend` (not just `LIFEBOARD`)
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite

### Check 2: Environment Variables
Add in Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://your-backend-url.com
```

### Check 3: Clear Cache
In Vercel:
1. Go to Deployments
2. Click "..." on latest deployment
3. Select "Redeploy"
4. Check "Clear cache and redeploy"

## That's It!
The `vercel.json` file tells Vercel to serve `index.html` for all routes, letting React Router handle the routing.

## Need More Help?
See `VERCEL-DEPLOYMENT-GUIDE.md` for detailed instructions.
