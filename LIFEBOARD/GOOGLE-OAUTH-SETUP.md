# Google OAuth Implementation Guide

## Overview
This guide explains how to add Google Sign-In to LifeBoard.

## Prerequisites
- Google Cloud Console account
- Backend server running
- Frontend application

## Step 1: Google Cloud Console Setup

### 1.1 Create Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it "LifeBoard" or similar

### 1.2 Enable Google+ API
1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click "Enable"

### 1.3 Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `https://yourdomain.com/auth/google/callback`
6. Save and copy:
   - Client ID
   - Client Secret

## Step 2: Backend Implementation

### 2.1 Install Dependencies
```bash
cd backend
npm install passport passport-google-oauth20
```

### 2.2 Add Environment Variables
Add to `backend/.env`:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

### 2.3 Create Google Auth Strategy
Create `backend/src/config/passport.ts`:
```typescript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { supabase } from './supabase';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found'));
        }

        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create new user
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({
            email,
            full_name: profile.displayName,
            google_id: profile.id,
            email_verified: true,
          })
          .select()
          .single();

        if (error) throw error;
        return done(null, newUser);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport;
```

### 2.4 Add Google Auth Routes
Add to `backend/src/routes/auth.ts`:
```typescript
import passport from '../config/passport';

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const user = req.user as any;
      
      // Generate JWT tokens
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // Redirect to frontend with tokens
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/success?` +
        `accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`);
    }
  }
);
```

## Step 3: Frontend Implementation

### 3.1 Update LoginPage.tsx
Replace the `handleGoogleLogin` function:
```typescript
const handleGoogleLogin = () => {
  // Redirect to backend Google OAuth
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};
```

### 3.2 Create Google Callback Handler
Create `frontend/src/pages/auth/GoogleCallback.tsx`:
```typescript
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      // Fetch user data
      fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          login(accessToken, refreshToken, data.data);
          navigate('/dashboard');
        })
        .catch(() => {
          navigate('/auth/login?error=google_auth_failed');
        });
    } else {
      navigate('/auth/login?error=google_auth_failed');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Completing Google Sign-In...</p>
      </div>
    </div>
  );
};
```

### 3.3 Add Route
Add to `frontend/src/AppRoutes.tsx`:
```typescript
import { GoogleCallback } from './pages/auth/GoogleCallback';

// Add this route
<Route path="/auth/google/success" element={<GoogleCallback />} />
```

## Step 4: Database Schema Update

Add Google ID column to users table:
```sql
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
```

## Step 5: Testing

### Development Testing
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Click "Continue with Google"
4. Sign in with Google account
5. Should redirect to dashboard

### Production Deployment
1. Update Google Console with production URLs
2. Update environment variables
3. Deploy backend and frontend
4. Test Google Sign-In

## Alternative: Simple Implementation (No Backend Changes)

If you want a simpler approach without backend changes, you can use Google One Tap:

### Install Google Identity Services
Add to `frontend/index.html`:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Update LoginPage.tsx
```typescript
useEffect(() => {
  // Initialize Google One Tap
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      callback: handleGoogleResponse,
    });
    
    window.google.accounts.id.renderButton(
      document.getElementById('googleButton'),
      { theme: 'outline', size: 'large', width: '100%' }
    );
  }
}, []);

const handleGoogleResponse = async (response: any) => {
  try {
    // Send token to your backend
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential }),
    });
    
    const data = await res.json();
    login(data.accessToken, data.refreshToken, data.user);
    navigate('/dashboard');
  } catch (error) {
    setError('Google Sign-In failed');
  }
};
```

## Security Considerations

1. **HTTPS Required**: Google OAuth requires HTTPS in production
2. **Token Storage**: Store tokens securely (httpOnly cookies recommended)
3. **CSRF Protection**: Implement state parameter
4. **Token Validation**: Always validate Google tokens on backend
5. **User Verification**: Verify email from Google is valid

## Troubleshooting

### "redirect_uri_mismatch" Error
- Check authorized redirect URIs in Google Console
- Ensure exact match (including http/https, port, path)

### "invalid_client" Error
- Verify Client ID and Secret are correct
- Check environment variables are loaded

### User Not Created
- Check database permissions
- Verify Supabase connection
- Check user table schema

## Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)

## Next Steps

1. Set up Google Cloud Console project
2. Implement backend OAuth routes
3. Test in development
4. Deploy to production
5. Update production URLs in Google Console
