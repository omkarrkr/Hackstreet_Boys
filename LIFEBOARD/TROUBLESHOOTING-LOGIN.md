# Troubleshooting Login Issues

## ❌ "Login failed" Error

### Most Common Cause: No Account Yet!

**The issue:** You're trying to login but you haven't created an account yet.

**Solution:**
1. Click the **"Register"** link on the login page
2. Create a new account with your email and password
3. After registration, you'll be automatically logged in
4. Next time, you can use the login page

---

## 🔍 Step-by-Step Debugging

### Step 1: Check Backend is Running

Open `http://localhost:5000` in your browser.

**Expected:** You should see:
```json
{
  "message": "LifeBoard API is running"
}
```

**If you see an error:**
- Backend is not running
- Start it: `cd backend && npm run dev`

---

### Step 2: Check Frontend is Connected

Open browser DevTools (F12) → Network tab

Try to login and look for a request to `/auth/login`

**What to check:**
- Request URL should be: `http://localhost:5000/auth/login`
- Status code: 
  - `401` = Wrong credentials or user doesn't exist
  - `500` = Server error
  - `200` = Success!

---

### Step 3: Check Supabase Credentials

Open `backend/.env` and verify:

```env
SUPABASE_URL=https://xxxxx.supabase.co  ← Should be a real URL
SUPABASE_ANON_KEY=eyJhbGc...            ← Should be a long key
```

**If these are wrong:**
- Ask project lead for correct credentials
- Update `.env` file
- Restart backend server

---

### Step 4: Check Database Tables Exist

**For Project Lead:**
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Verify `users` table exists

**If table doesn't exist:**
- Go to SQL Editor
- Run the `database-schema.sql` file

---

## 🐛 Common Issues & Solutions

### Issue 1: "Login failed" - User doesn't exist

**Symptoms:**
- Error message: "Invalid credentials" or "Login failed"
- Status code: 401

**Solution:**
1. Go to Register page: `http://localhost:5173/auth/register`
2. Create a new account
3. Use those credentials to login

---

### Issue 2: Backend not responding

**Symptoms:**
- Network error in browser console
- "Failed to fetch" error
- Request to localhost:5000 fails

**Solution:**
```bash
# Check if backend is running
cd backend
npm run dev

# Should see: "🚀 LifeBoard API running on port 5000"
```

---

### Issue 3: CORS error

**Symptoms:**
- Browser console shows CORS error
- Request blocked by CORS policy

**Solution:**
- Make sure backend is running on port 5000
- Check `frontend/.env` has: `VITE_API_URL=http://localhost:5000`
- Restart frontend server

---

### Issue 4: Wrong Supabase credentials

**Symptoms:**
- Backend starts but login/register fails
- Error in backend terminal about Supabase

**Solution:**
1. Ask project lead for correct credentials
2. Update `backend/.env`
3. Restart backend: Ctrl+C, then `npm run dev`

---

### Issue 5: Database tables not created

**Symptoms:**
- Error about table not existing
- Backend error: "relation 'users' does not exist"

**Solution (Project Lead):**
1. Go to Supabase Dashboard
2. SQL Editor → New Query
3. Copy all content from `database-schema.sql`
4. Run the query
5. Verify tables exist in Table Editor

---

## ✅ How to Test Everything Works

### Test 1: Backend Health Check
```
Open: http://localhost:5000
Expected: {"message": "LifeBoard API is running"}
```

### Test 2: Register New User
1. Go to: `http://localhost:5173/auth/register`
2. Fill in:
   - Full Name: Your Name
   - Email: yourname@example.com
   - Password: password123
3. Click "Register"
4. Expected: Redirected to dashboard

### Test 3: Logout and Login
1. Logout (if there's a logout button)
2. Go to: `http://localhost:5173/auth/login`
3. Use the same email/password from registration
4. Click "Login"
5. Expected: Redirected to dashboard

---

## 🔧 Debug Checklist

Before asking for help, check:

- [ ] Backend is running (`http://localhost:5000` works)
- [ ] Frontend is running (`http://localhost:5173` works)
- [ ] `backend/.env` has correct Supabase credentials
- [ ] You tried **registering** first, not just logging in
- [ ] Browser console shows no errors (F12 → Console)
- [ ] Network tab shows requests going to localhost:5000

---

## 📞 Still Not Working?

### Check Backend Terminal

Look for errors like:
- `Missing environment variable: SUPABASE_URL`
- `Connection refused`
- `Invalid API key`

### Check Browser Console (F12)

Look for errors like:
- `Failed to fetch`
- `Network error`
- `401 Unauthorized`

### Check Network Tab (F12 → Network)

1. Try to login
2. Look for `/auth/login` request
3. Click on it
4. Check:
   - Request URL
   - Status code
   - Response body

### Share This Info With Team

When asking for help, share:
1. Error message from browser console
2. Error message from backend terminal
3. Status code from Network tab
4. Screenshot of the error

---

## 💡 Quick Fix Summary

**Most common issue:** Trying to login without registering first.

**Quick fix:**
1. Go to Register page
2. Create account
3. Then you can login

**If that doesn't work:**
1. Check backend is running
2. Check Supabase credentials in `.env`
3. Check browser console for errors
4. Ask project lead for help

---

## 🎯 For Project Lead

If multiple contributors have login issues:

### Check 1: Verify Shared Credentials
- Make sure you shared the correct Supabase URL and key
- Test them yourself in a fresh `.env` file

### Check 2: Verify Database Setup
- Go to Supabase → Table Editor
- Confirm `users` table exists
- Try registering a test user yourself

### Check 3: Check Supabase Logs
- Go to Supabase Dashboard
- Logs & Reports → API Logs
- Look for errors when contributors try to register/login

### Check 4: Test the API Directly

Use curl or Postman to test:

**Register:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

If these work, the backend is fine. Issue is likely frontend configuration.

---

## ✅ Success Indicators

You know it's working when:
- ✅ Backend shows: "LifeBoard API running on port 5000"
- ✅ Frontend loads at localhost:5173
- ✅ Can register a new account
- ✅ Redirected to dashboard after registration
- ✅ Can logout and login again
- ✅ No errors in browser console

---

**Need more help?** Check the other documentation files or ask in team chat!
