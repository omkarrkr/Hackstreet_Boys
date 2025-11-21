# New Contributor Setup Checklist

Welcome to the LifeBoard team! Follow this checklist to get set up.

## ✅ Setup Checklist

### Prerequisites
- [ ] Node.js 18+ installed ([download here](https://nodejs.org/))
- [ ] Git installed
- [ ] Code editor installed (VS Code recommended)
- [ ] GitHub account with access to the repository

### Step 1: Clone and Install
- [ ] Clone the repository
  ```bash
  git clone <repo-url>
  cd LIFEBOARD
  ```
- [ ] Install backend dependencies
  ```bash
  cd backend
  npm install
  cd ..
  ```
- [ ] Install frontend dependencies
  ```bash
  cd frontend
  npm install
  cd ..
  ```

### Step 2: Get Credentials
- [ ] Ask project lead for Supabase credentials
- [ ] Receive `SUPABASE_URL`
- [ ] Receive `SUPABASE_ANON_KEY`

### Step 3: Configure Environment
- [ ] Navigate to backend folder
  ```bash
  cd backend
  ```
- [ ] Copy the example env file
  ```bash
  copy .env.example .env
  ```
  (On Mac/Linux: `cp .env.example .env`)
- [ ] Open `backend/.env` in your editor
- [ ] Paste the Supabase credentials you received
- [ ] Save the file

### Step 4: Start Servers
- [ ] Open terminal in LIFEBOARD folder
- [ ] Run the start script:
  ```powershell
  .\start-dev.ps1
  ```
  Or manually start both:
  - Terminal 1: `cd backend && npm run dev`
  - Terminal 2: `cd frontend && npm run dev`

### Step 5: Verify Setup
- [ ] Backend running at `http://localhost:5000`
- [ ] Frontend running at `http://localhost:5173`
- [ ] Open frontend URL in browser
- [ ] No errors in browser console

### Step 5.5: Create Your Account ⚠️ IMPORTANT
- [ ] Go to Register page: `http://localhost:5173/auth/register`
- [ ] Create a new account with your email and password
- [ ] You'll be automatically logged in after registration
- [ ] Now you can logout and login again with those credentials

**Note:** Each person needs to register their own account in the shared database!

### Step 6: Read Documentation
- [ ] Read `CONTRIBUTING.md` - Development workflow
- [ ] Read `FRONTEND-EXAMPLE.md` - Code examples
- [ ] Read `PROJECT-STATUS.md` - What needs to be built
- [ ] Read `API-REFERENCE.md` - API endpoints

### Step 7: Pick a Task
- [ ] Check `PROJECT-STATUS.md` for available tasks
- [ ] Ask team lead what to work on
- [ ] Create a feature branch
  ```bash
  git checkout -b feature/your-task-name
  ```

---

## 🎯 First Task Suggestions

Good first tasks for new contributors:

### Easy (1-2 hours)
- [ ] Build the Login page
- [ ] Build the Register page
- [ ] Create reusable Button component
- [ ] Create reusable Card component

### Medium (3-4 hours)
- [ ] Build Dashboard layout with sidebar
- [ ] Build Goals page
- [ ] Build Todos page

### Advanced (5+ hours)
- [ ] Build Finances page with charts
- [ ] Build Habits page with streak tracking
- [ ] Build Health page with metrics

---

## 📚 Important Files to Know

| File | What It's For |
|------|---------------|
| `CONTRIBUTING.md` | How to contribute |
| `FRONTEND-EXAMPLE.md` | Code examples to copy |
| `API-REFERENCE.md` | All API endpoints |
| `PROJECT-STATUS.md` | What's done, what's needed |
| `backend/.env` | Your local config (don't commit!) |

---

## 🚨 Common Setup Issues

### Issue: "Cannot find module"
**Solution:**
```bash
cd backend
npm install
cd ../frontend
npm install
```

### Issue: "Port 5000 already in use"
**Solution:**
- Close other apps using port 5000
- Or change PORT in `backend/.env` to 5001

### Issue: "CORS error" in browser
**Solution:**
- Make sure backend is running
- Check backend terminal for errors
- Verify `VITE_API_URL` in `frontend/.env` is correct

### Issue: Backend won't start
**Solution:**
- Check `backend/.env` exists
- Verify Supabase credentials are correct
- Check backend terminal for error messages

### Issue: Can't register/login
**Solution:**
- Verify backend is running
- Check browser Network tab for API errors
- Verify Supabase credentials are correct
- Ask team lead if database is set up

---

## 💻 Development Workflow

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/login-page
   ```

3. **Make changes and test**
   - Edit files
   - Save and check browser
   - Fix any errors

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Add login page with form validation"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/login-page
   ```

6. **Create Pull Request**
   - Go to GitHub
   - Click "Compare & pull request"
   - Add description
   - Request review

---

## 🎨 Coding Guidelines

### Use TypeScript
```tsx
// ✅ Good
const [count, setCount] = useState<number>(0);

// ❌ Bad
const [count, setCount] = useState(0); // Missing type
```

### Use Tailwind CSS
```tsx
// ✅ Good
<button className="px-4 py-2 bg-blue-600 text-white rounded">
  Click me
</button>

// ❌ Bad
<button style={{ padding: '8px 16px', background: 'blue' }}>
  Click me
</button>
```

### Use Functional Components
```tsx
// ✅ Good
export const LoginPage = () => {
  return <div>Login</div>;
};

// ❌ Bad
class LoginPage extends Component {
  render() {
    return <div>Login</div>;
  }
}
```

---

## 🧪 Testing Your Work

Before committing:
- [ ] Code compiles without errors
- [ ] Page loads in browser
- [ ] No console errors
- [ ] Works on mobile view (responsive)
- [ ] API calls work correctly
- [ ] Forms validate properly

---

## 🤝 Getting Help

**Stuck?** Here's what to do:

1. **Check documentation** - Most answers are in the `.md` files
2. **Check examples** - See `FRONTEND-EXAMPLE.md`
3. **Check browser console** - Look for error messages
4. **Check Network tab** - See if API calls are working
5. **Ask the team** - Post in team chat or create an issue

---

## 🎉 You're Ready!

Once you've completed this checklist:
- ✅ Your environment is set up
- ✅ Servers are running
- ✅ You know where to find documentation
- ✅ You're ready to start coding

**Next step:** Pick a task from `PROJECT-STATUS.md` and start building!

Welcome to the team! 🚀
