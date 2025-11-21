# Team Credentials for LifeBoard

**⚠️ IMPORTANT: Share this information privately with your team members**

## Supabase Credentials (Development)

Your team members need these credentials to run the project locally.

### How to Share

**Option 1: Secure Messaging**
Send these via your team's private chat (Discord, Slack, WhatsApp, etc.):

```
SUPABASE_URL=<your_supabase_url>
SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

**Option 2: Team Password Manager**
Store in a shared password manager like:
- 1Password Teams
- LastPass Teams
- Bitwarden

**Option 3: Environment Variables Document**
Create a private Google Doc or Notion page with the credentials.

---

## What to Tell Your Contributors

Send them this message:

```
Hey! To set up LifeBoard on your machine:

1. Clone the repo
2. Run `npm install` in both backend and frontend folders
3. Create a `.env` file in the backend folder
4. Copy `.env.example` and add these credentials:

SUPABASE_URL=<paste_url_here>
SUPABASE_ANON_KEY=<paste_key_here>

5. Run `.\start-dev.ps1` or start servers manually
6. Check CONTRIBUTING.md for full setup guide

Let me know if you have issues!
```

---

## Your Supabase Credentials

**Project URL:**
```
<Copy from your backend/.env file>
```

**Anon Key:**
```
<Copy from your backend/.env file>
```

---

## Security Notes

✅ **Safe to share with team:**
- Supabase URL
- Supabase Anon Key (for development)

❌ **Never share publicly:**
- Service Role Key (if you have one)
- JWT secrets (for production)
- Database passwords

⚠️ **For Production:**
When deploying, use different credentials:
- Create a separate Supabase project for production
- Use environment variables in Railway/Vercel
- Never commit production credentials to Git

---

## Revoking Access

If someone leaves the team:
1. Go to Supabase Dashboard
2. Project Settings → API
3. Reset the anon key (this will require everyone to update)
4. Or create a new project for production

---

## Alternative: Each Developer Uses Their Own Supabase

If you prefer, each developer can:
1. Create their own free Supabase account
2. Create their own project
3. Run the `database-schema.sql` in their project
4. Use their own credentials

**Pros:**
- No shared credentials
- Each person has their own test data
- More secure

**Cons:**
- Everyone needs to set up Supabase
- Can't share test data
- More setup time

---

## Current Setup

- **Shared Development Database**: ✅ Recommended for teams
- **Individual Databases**: ⬜ Alternative option

Choose what works best for your team!
