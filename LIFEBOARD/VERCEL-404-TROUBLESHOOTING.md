# Vercel 404 Error - Complete Troubleshooting Guide

## Files Created to Fix 404
1. ✅ `LIFEBOARD/frontend/vercel.json` - Vercel configuration
2. ✅ `LIFEBOARD/frontend/public/_redirects` - Backup redirect rules
3. ✅ Updated `vite.config.ts` - Build configuration

## Step-by-Step Fix

### Step 1: Verify Vercel Project Settings

Go to Vercel Dashboard → Your Project → Settings → General

**CRITICAL: Check these settings:**

```
Root Directory: LIFEBOARD/frontend
```
⚠️ **NOT** just `LIFEBOARD` or empty!

```
Build Command: npm run build
```

```
Output Directory: dist
```

```
Install Command: npm install
```

```
Framework Preset: Vite
```

### Step 2: Check Build & Development Settings

In Vercel Dashboard → Settings → Build & Development Settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build` (or leave default)
- **Output Directory**: `dist` (or leave default)
- **Install Command**: `npm install` (or leave default)

### Step 3: Environment Variables

Go to Settings → Environment Variables

Add:
```
VITE_API_URL=https://your-backend-url.com
```

Make sure to add for:
- Production
- Preview
- Development

### Step 4: Redeploy with Cache Clear

1. Go to Deployments tab
2. Click "..." on the latest deployment
3. Select "Redeploy"
4. ✅ **Check "Clear cache and redeploy"**
5. Wait for deployment to complete

### Step 5: Test After Deployment

Visit these URLs (replace with your Vercel URL):
- `https://your-app.vercel.app/` ✅ Should work
- `https://your-app.vercel.app/dashboard` ✅ Should work
- `https://your-app.vercel.app/dashboard/goals` ✅ Should work
- Refresh any page ✅ Should NOT get 404

## Common Issues & Solutions

### Issue 1: Root Directory Wrong

**Symptom**: Build fails or 404 on all pages

**Solution**:
1. Go to Settings → General
2. Find "Root Directory"
3. Set to: `LIFEBOARD/frontend`
4. Save and redeploy

### Issue 2: Build Command Not Running

**Symptom**: Deployment succeeds but shows blank page

**Solution**:
1. Check build logs in Deployments tab
2. Verify `npm run build` works locally:
   ```bash
   cd LIFEBOARD/frontend
   npm install
   npm run build
   ```
3. If it works locally, check Vercel build logs for errors

### Issue 3: Wrong Output Directory

**Symptom**: 404 on all pages

**Solution**:
1. Verify Vite builds to `dist` folder
2. Check Settings → Output Directory is `dist`
3. Redeploy

### Issue 4: vercel.json Not Being Read

**Symptom**: Still getting 404 after adding vercel.json

**Solution**:
1. Verify file location: `LIFEBOARD/frontend/vercel.json`
2. Check file contents:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
3. Push to GitHub
4. Redeploy with cache clear

### Issue 5: Routes Work on First Load, 404 on Refresh

**Symptom**: Navigation works, but refreshing gives 404

**Solution**: This is the classic SPA routing issue
1. Ensure `vercel.json` exists
2. Ensure `public/_redirects` exists
3. Clear cache and redeploy

## Alternative: Manual Vercel Configuration

If automatic detection fails, configure manually:

### Create vercel.json in project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "LIFEBOARD/frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "LIFEBOARD/frontend/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/LIFEBOARD/frontend/(.*)",
      "dest": "/LIFEBOARD/frontend/index.html"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/LIFEBOARD/frontend/index.html"
    }
  ]
}
```

## Debugging Steps

### 1. Check Build Logs
1. Go to Deployments
2. Click on latest deployment
3. Check "Building" section for errors
4. Look for:
   - `npm install` success
   - `npm run build` success
   - Files copied to output directory

### 2. Check Deployment Output
In build logs, verify:
```
✓ built in XXXms
✓ dist/index.html
✓ dist/assets/...
```

### 3. Test Locally
```bash
cd LIFEBOARD/frontend
npm run build
npm run preview
```

Visit `http://localhost:4173` and test all routes.

### 4. Check Browser Console
1. Open deployed site
2. Press F12 (Developer Tools)
3. Check Console tab for errors
4. Check Network tab for failed requests

## Nuclear Option: Start Fresh

If nothing works:

### 1. Delete Vercel Project
1. Go to Settings → General
2. Scroll to bottom
3. Delete project

### 2. Reimport from GitHub
1. Click "Add New Project"
2. Import your repository
3. Configure:
   - **Root Directory**: `LIFEBOARD/frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables
5. Deploy

## Checklist Before Asking for Help

- [ ] Root Directory is `LIFEBOARD/frontend`
- [ ] Build Command is `npm run build`
- [ ] Output Directory is `dist`
- [ ] Framework is set to Vite
- [ ] `vercel.json` exists in `LIFEBOARD/frontend/`
- [ ] `public/_redirects` exists
- [ ] Pushed latest changes to GitHub
- [ ] Cleared cache and redeployed
- [ ] Build succeeds locally with `npm run build`
- [ ] Preview works locally with `npm run preview`
- [ ] Checked build logs for errors
- [ ] Environment variables are set

## Still Not Working?

### Share These Details:
1. Vercel deployment URL
2. Build logs (from Deployments tab)
3. Browser console errors (F12)
4. Screenshot of Settings → General
5. Screenshot of Settings → Build & Development Settings

## Quick Test Commands

```bash
# Test build locally
cd LIFEBOARD/frontend
npm install
npm run build
npm run preview

# Check if files exist
ls dist/
ls dist/index.html
ls vercel.json
ls public/_redirects

# Push to GitHub
git add .
git commit -m "Fix Vercel 404 configuration"
git push origin main
```

## Expected File Structure

```
LIFEBOARD/
└── frontend/
    ├── dist/                  # Generated by build
    │   ├── index.html
    │   └── assets/
    ├── public/
    │   └── _redirects         # ✅ NEW
    ├── src/
    ├── index.html
    ├── package.json
    ├── vite.config.ts         # ✅ UPDATED
    └── vercel.json            # ✅ NEW
```

## Success Indicators

✅ Build completes without errors
✅ All routes load without 404
✅ Refresh works on any route
✅ Browser console has no errors
✅ API calls work (if backend is deployed)

## Contact Support

If all else fails:
1. Vercel Support: https://vercel.com/support
2. Provide deployment URL and build logs
3. Mention "React Router SPA 404 issue"
