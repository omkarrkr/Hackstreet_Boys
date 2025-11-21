# LifeBoard Setup Guide

## Prerequisites

- Node.js 18+ and npm installed
- A Supabase account (free tier works fine)
- Git

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (takes ~2 minutes)
3. Once ready, go to **Project Settings** > **API**
4. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (the `anon` key under "Project API keys")

## Step 2: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `database-schema.sql` from this project
4. Paste it into the SQL editor
5. Click **Run** to execute the schema

This will create all necessary tables, indexes, and triggers.

## Step 3: Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd LIFEBOARD/backend
   ```

2. Open the `.env` file and update it with your Supabase credentials:
   ```env
   PORT=5000
   NODE_ENV=development

   # Replace these with your actual Supabase credentials
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here

   # JWT secrets (change these in production!)
   JWT_ACCESS_SECRET=your_super_secret_access_key_change_this
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   ```

3. Dependencies are already installed. If you need to reinstall:
   ```bash
   npm install
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 LifeBoard API running on port 5000
   📝 Environment: development
   ```

## Step 4: Frontend Configuration

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd LIFEBOARD/frontend
   ```

2. The `.env` file is already configured for local development:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. Dependencies are already installed. If you need to reinstall:
   ```bash
   npm install
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

   You should see something like:
   ```
   VITE v5.x.x  ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

## Step 5: Test the Application

1. Open your browser and go to `http://localhost:5173`
2. You should see the LifeBoard login page
3. Click "Register" to create a new account
4. Fill in your details and register
5. You'll be automatically logged in and redirected to the dashboard

## Troubleshooting

### Backend won't start

- **Error: Missing environment variable**
  - Make sure you've updated the `.env` file with your Supabase credentials
  
- **Error: Cannot find module '@supabase/supabase-js'**
  - Run `npm install` in the backend directory

### Frontend won't start

- **Error: Cannot find module**
  - Run `npm install` in the frontend directory

### Can't register/login

- **Check backend is running**: Make sure you see the backend server running on port 5000
- **Check Supabase connection**: Verify your Supabase URL and anon key are correct
- **Check database tables**: Make sure you ran the `database-schema.sql` in Supabase

### CORS errors

- The backend is configured to allow all origins in development
- If you still see CORS errors, make sure the backend is running on port 5000

## Next Steps

### Development

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:5173`
- Both have hot-reload enabled for development

### Building for Production

**Backend:**
```bash
cd LIFEBOARD/backend
npm run build
npm start
```

**Frontend:**
```bash
cd LIFEBOARD/frontend
npm run build
```

The built files will be in `LIFEBOARD/frontend/dist`

### Deployment

See the main README.md for deployment instructions for:
- Backend → Railway
- Frontend → Vercel
- Database → Supabase (already hosted)

## Project Structure

```
LIFEBOARD/
├── backend/
│   ├── src/
│   │   ├── config/         # Environment and Supabase config
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth and error handling
│   │   ├── models/         # Database operations
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Helper functions
│   │   ├── app.ts          # Express app setup
│   │   └── index.ts        # Server entry point
│   ├── .env                # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # React context (Auth, etc.)
    │   ├── hooks/          # Custom React hooks
    │   ├── pages/          # Page components
    │   ├── routes/         # Route protection
    │   ├── services/       # API service layer
    │   ├── styles/         # Global styles
    │   ├── types/          # TypeScript types
    │   ├── App.tsx         # Main app component
    │   ├── AppRoutes.tsx   # Route definitions
    │   └── main.tsx        # Entry point
    ├── .env                # Environment variables
    └── package.json
```

## Available Features

Once logged in, you'll have access to:

- **Dashboard** - Overview of all your data
- **Goals** - Track goals with AI roadmap suggestions
- **Finances** - Manage transactions and budgets
- **Habits** - Build good habits and break bad ones
- **To-Dos** - Task management
- **Health** - Track health metrics and workouts
- **Bucket List** - Your life vision board

## Support

If you encounter any issues:

1. Check that all environment variables are set correctly
2. Verify Supabase is accessible and tables are created
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Ensure both servers are running simultaneously
