# Vercel Deployment Guide for LifeBoard Frontend

## Issue: 404 Not Found Error

When deploying a React SPA (Single Page Application) with React Router to Vercel, you may encounter 404 errors when navigating to routes directly or refreshing the page.

## Solution

The `vercel.json` file has been created to fix this issue.

## What It Does

The `vercel.json` configuration tells Vercel to:
1. Catch all routes (`(.*)`)
2. Serve `index.html` for all routes
3. Let React Router handle the routing on the client side

## Deployment Steps

### 1. Push Changes to GitHub
```bash
cd LIFEBOARD
git add .
git commit -m "Add Vercel configuration for React Router"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `LIFEBOARD/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.railway.app`)
6. Click "Deploy"

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd LIFEBOARD/frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Confirm settings
# - Deploy
```

### 3. Configure Environment Variables

In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
4. Redeploy if needed

### 4. Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

### Still Getting 404?

1. **Check vercel.json location**
   - Must be in `LIFEBOARD/frontend/vercel.json`
   - Not in root directory

2. **Verify Build Settings**
   - Root Directory: `LIFEBOARD/frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Check Build Logs**
   - Go to Deployments tab
   - Click on latest deployment
   - Check build logs for errors

4. **Clear Cache and Redeploy**
   - In Vercel Dashboard
   - Go to Deployments
   - Click "..." menu
   - Select "Redeploy"
   - Check "Clear cache"

### API Connection Issues

If frontend deploys but can't connect to backend:

1. **Check CORS Settings** (Backend)
   ```typescript
   // backend/src/app.ts
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://your-vercel-app.vercel.app',
       'https://your-custom-domain.com'
     ],
     credentials: true
   }));
   ```

2. **Verify Environment Variable**
   - Check `VITE_API_URL` is set correctly
   - Must include `https://` protocol
   - No trailing slash

3. **Test API Endpoint**
   ```bash
   curl https://your-backend-url.com/health
   ```

### Build Fails

1. **Check Node Version**
   - Vercel uses Node 18 by default
   - Add to `package.json`:
     ```json
     "engines": {
       "node": "18.x"
     }
     ```

2. **Check Dependencies**
   ```bash
   cd LIFEBOARD/frontend
   npm install
   npm run build
   ```

3. **TypeScript Errors**
   - Fix all TypeScript errors locally first
   - Run `npm run build` locally to verify

## Project Structure

```
LIFEBOARD/
├── frontend/
│   ├── dist/              # Build output (generated)
│   ├── src/               # Source code
│   ├── index.html         # Entry point
│   ├── package.json       # Dependencies
│   ├── vite.config.ts     # Vite config
│   └── vercel.json        # Vercel config (IMPORTANT!)
└── backend/               # Backend code
```

## Vercel Configuration File

The `vercel.json` file:
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

This ensures all routes are handled by React Router.

## Alternative: Using _redirects

If `vercel.json` doesn't work, create `public/_redirects`:
```
/*    /index.html   200
```

## Production Checklist

- [ ] `vercel.json` exists in frontend directory
- [ ] Environment variables configured
- [ ] Backend CORS allows frontend domain
- [ ] Backend deployed and accessible
- [ ] Build succeeds locally
- [ ] All routes work after deployment
- [ ] API calls work from deployed frontend

## Useful Commands

```bash
# Test build locally
cd LIFEBOARD/frontend
npm run build
npm run preview

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs
```

## Support

If issues persist:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify backend is running
4. Test API endpoints directly
5. Check CORS configuration

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deployment)
