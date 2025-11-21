# Contributing to LifeBoard

Welcome! Here's how to set up the project on your local machine.

## Prerequisites

- Node.js 18+ installed
- Git installed
- Access to the team's Supabase project

## Setup Steps

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd LIFEBOARD
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 3. Get Supabase Credentials

**Ask the project lead for:**
- Supabase Project URL
- Supabase Anon Key

These are shared credentials for the team's development database.

### 4. Configure Backend Environment

Create a `.env` file in the `backend` folder:

```bash
cd backend
copy .env.example .env
```

Then open `backend/.env` and add the credentials you received:

```env
PORT=5000
NODE_ENV=development

# Get these from project lead
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# These are fine for development
JWT_ACCESS_SECRET=dev_access_secret_key_12345
JWT_REFRESH_SECRET=dev_refresh_secret_key_67890
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### 5. Start Development Servers

**Option A: PowerShell Script (Windows)**
```powershell
.\start-dev.ps1
```

**Option B: Manual (Two terminals)**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 6. Verify Setup

- Backend should be running at: `http://localhost:5000`
- Frontend should be running at: `http://localhost:5173`
- Open the frontend URL in your browser

## Database Access

The database is already set up in Supabase. You don't need to run any SQL - just use the shared credentials.

## Development Workflow

1. **Pull latest changes** before starting work:
   ```bash
   git pull origin main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and test locally

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Push to GitHub**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## What to Work On

Check `PROJECT-STATUS.md` to see what needs to be built.

### Priority Tasks:
1. Login page (`frontend/src/pages/auth/LoginPage.tsx`)
2. Register page (`frontend/src/pages/auth/RegisterPage.tsx`)
3. Dashboard layout (`frontend/src/components/layout/DashboardShell.tsx`)
4. Feature pages (Goals, Finances, Habits, etc.)

### Code Examples

See `FRONTEND-EXAMPLE.md` for complete code examples you can copy and adapt.

## Project Structure

```
LIFEBOARD/
├── backend/              ✅ Complete - Don't modify unless needed
│   ├── src/
│   └── .env             ⚠️  You need to create this
│
├── frontend/            🚧 This is where you'll work
│   ├── src/
│   │   ├── pages/       ← Build pages here
│   │   └── components/  ← Build components here
│   └── .env             ✅ Already configured
│
└── *.md                 📚 Documentation
```

## Common Issues

### "Cannot find module" errors
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Backend won't start
- Check that `.env` file exists in `backend` folder
- Verify Supabase credentials are correct
- Make sure port 5000 is not in use

### Frontend won't start
- Check that backend is running first
- Make sure port 5173 is not in use
- Clear browser cache if needed

### Git conflicts
```bash
git pull origin main
# Resolve conflicts in your editor
git add .
git commit -m "Resolved conflicts"
```

## Coding Standards

### Frontend
- Use TypeScript for all files
- Use Tailwind CSS for styling (no custom CSS)
- Use functional components with hooks
- Follow the examples in `FRONTEND-EXAMPLE.md`

### File naming
- Components: `PascalCase.tsx` (e.g., `LoginPage.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)

### Git commits
- Use clear, descriptive commit messages
- Format: `"Add login page"`, `"Fix navigation bug"`, `"Update goals API"`

## Testing Your Changes

1. Start both servers
2. Test in browser at `http://localhost:5173`
3. Check browser console for errors
4. Test on mobile view (responsive design)
5. Verify API calls work (check Network tab)

## Getting Help

- **Documentation**: Check the `.md` files in the root folder
- **Code examples**: See `FRONTEND-EXAMPLE.md`
- **API reference**: See `API-REFERENCE.md`
- **Project status**: See `PROJECT-STATUS.md`
- **Ask the team**: Create an issue or ask in your team chat

## Important Files

- `FRONTEND-EXAMPLE.md` - Code examples to copy
- `API-REFERENCE.md` - All API endpoints
- `PROJECT-STATUS.md` - What's done, what's needed
- `.env.example` - Template for environment variables

## Don't Commit These Files

The `.gitignore` is already set up, but never commit:
- `node_modules/`
- `.env` files
- `dist/` folders
- Personal IDE settings

## Questions?

Ask the project lead or check the documentation files!

Happy coding! 🚀
