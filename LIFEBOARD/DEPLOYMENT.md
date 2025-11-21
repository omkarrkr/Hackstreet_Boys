# LifeBoard Deployment Guide

This guide covers deploying LifeBoard to production using:
- **Backend**: Railway
- **Frontend**: Vercel
- **Database**: Supabase (already hosted)

## Prerequisites

- GitHub account
- Railway account (free tier available)
- Vercel account (free tier available)
- Supabase project (already set up)

---

## 1. Prepare Your Repository

### Push to GitHub

1. Initialize git (if not already done):
```bash
cd LIFEBOARD
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/yourusername/lifeboard.git
git branch -M main
git push -u origin main
```

---

## 2. Deploy Backend to Railway

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your LifeBoard repository
6. Railway will detect it's a Node.js project

### Step 2: Configure Backend

1. In Railway dashboard, click on your service
2. Go to "Settings"
3. Set **Root Directory**: `LIFEBOARD/backend`
4. Set **Start Command**: `npm start`
5. Set **Build Command**: `npm install && npm run build`

### Step 3: Add Environment Variables

Go to "Variables" tab and add:

```env
NODE_ENV=production
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_ACCESS_SECRET=your_production_access_secret_change_this
JWT_REFRESH_SECRET=your_production_refresh_secret_change_this
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

**Important**: Generate strong, unique secrets for production!

### Step 4: Deploy

1. Railway will automatically deploy
2. Once deployed, you'll get a URL like: `https://lifeboard-backend.up.railway.app`
3. Copy this URL - you'll need it for the frontend

### Step 5: Test Backend

Visit your Railway URL in a browser. You should see:
```json
{
  "message": "LifeBoard API is running"
}
```

---

## 3. Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your LifeBoard repository
5. Vercel will detect it's a Vite project

### Step 2: Configure Frontend

1. **Root Directory**: `LIFEBOARD/frontend`
2. **Framework Preset**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Step 3: Add Environment Variables

Add this environment variable:

```env
VITE_API_URL=https://your-railway-backend-url.up.railway.app
```

Replace with your actual Railway backend URL (without trailing slash).

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. You'll get a URL like: `https://lifeboard.vercel.app`

### Step 5: Test Frontend

1. Visit your Vercel URL
2. Try to register a new account
3. Test login and navigation

---

## 4. Configure CORS (if needed)

If you get CORS errors, update your backend's CORS configuration:

**File**: `LIFEBOARD/backend/src/app.ts`

```typescript
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:5173' // Keep for local development
  ],
  credentials: true
}));
```

Commit and push this change - Railway will auto-deploy.

---

## 5. Custom Domains (Optional)

### Frontend (Vercel)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

### Backend (Railway)

1. Go to your service settings in Railway
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS as instructed

---

## 6. Environment-Specific Configuration

### Development
```env
# Backend
NODE_ENV=development
PORT=5000
SUPABASE_URL=your_dev_supabase_url
JWT_ACCESS_SECRET=dev_secret

# Frontend
VITE_API_URL=http://localhost:5000
```

### Production
```env
# Backend (Railway)
NODE_ENV=production
PORT=5000
SUPABASE_URL=your_prod_supabase_url
JWT_ACCESS_SECRET=strong_random_secret_here

# Frontend (Vercel)
VITE_API_URL=https://your-backend.railway.app
```

---

## 7. Database Migrations

Your Supabase database is already set up. For future schema changes:

1. Write SQL migration in Supabase SQL Editor
2. Test in development first
3. Apply to production database
4. Update TypeScript types if needed

---

## 8. Monitoring and Logs

### Railway (Backend)

- View logs in Railway dashboard
- Click on your service → "Deployments" → "View Logs"
- Monitor CPU, memory, and network usage

### Vercel (Frontend)

- View deployment logs in Vercel dashboard
- Check "Functions" tab for any errors
- Monitor analytics and performance

### Supabase (Database)

- View query performance in Supabase dashboard
- Check "Database" → "Query Performance"
- Monitor storage and bandwidth usage

---

## 9. CI/CD (Automatic Deployments)

Both Railway and Vercel support automatic deployments:

### Railway
- Automatically deploys on push to `main` branch
- Configure in Settings → "Deployments"

### Vercel
- Automatically deploys on push to `main` branch
- Preview deployments for pull requests
- Configure in Settings → "Git"

---

## 10. Security Checklist

Before going live:

- [ ] Change all JWT secrets to strong, random values
- [ ] Enable HTTPS only (both platforms do this by default)
- [ ] Configure CORS to only allow your frontend domain
- [ ] Review Supabase Row Level Security (RLS) policies
- [ ] Set up rate limiting (consider using Railway's built-in features)
- [ ] Enable Supabase database backups
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Review and limit API key permissions

---

## 11. Scaling Considerations

### Railway (Backend)
- Free tier: 500 hours/month, $5 credit
- Upgrade to Pro for more resources
- Horizontal scaling available on Pro plan

### Vercel (Frontend)
- Free tier: 100GB bandwidth/month
- Automatic scaling and CDN
- Upgrade to Pro for more bandwidth

### Supabase (Database)
- Free tier: 500MB database, 1GB file storage
- Upgrade to Pro for more resources
- Connection pooling available

---

## 12. Backup Strategy

### Database (Supabase)
1. Enable automatic backups in Supabase dashboard
2. Go to "Database" → "Backups"
3. Configure daily backups
4. Test restore process

### Code
- Keep GitHub repository as source of truth
- Tag releases: `git tag v1.0.0`
- Create release branches for production

---

## 13. Troubleshooting Deployment

### Backend won't start on Railway
- Check logs for errors
- Verify all environment variables are set
- Ensure `package.json` has correct start script
- Check Node.js version compatibility

### Frontend build fails on Vercel
- Check build logs for errors
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`
- Check TypeScript errors

### Database connection fails
- Verify Supabase URL and key are correct
- Check Supabase project is active
- Verify network connectivity
- Check Supabase service status

### CORS errors in production
- Update CORS configuration in backend
- Verify frontend URL is correct
- Check browser console for exact error
- Ensure credentials are properly configured

---

## 14. Post-Deployment Testing

Test these features in production:

- [ ] User registration
- [ ] User login
- [ ] Token refresh
- [ ] Create/read/update/delete operations for:
  - [ ] Goals
  - [ ] Finances
  - [ ] Habits
  - [ ] Tasks
  - [ ] Health metrics
  - [ ] Bucket list items
- [ ] Navigation between pages
- [ ] Logout functionality

---

## 15. Maintenance

### Regular Tasks
- Monitor error logs weekly
- Review database performance monthly
- Update dependencies quarterly
- Backup database before major changes
- Test disaster recovery procedures

### Updates
1. Test changes locally
2. Push to a feature branch
3. Create pull request
4. Review and merge to main
5. Automatic deployment triggers
6. Monitor deployment logs
7. Test in production

---

## Support Resources

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

---

## Quick Deploy Commands

```bash
# Update production
git add .
git commit -m "Your changes"
git push origin main

# Both Railway and Vercel will auto-deploy!
```

That's it! Your LifeBoard app is now live and accessible to users worldwide. 🚀
