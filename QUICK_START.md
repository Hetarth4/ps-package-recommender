# Quick Start Guide - Authentication Setup

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

First, install the new authentication packages:

```bash
npm install
```

### 2. Set Up Google OAuth

Follow these quick steps to get your Google OAuth credentials:

1. **Go to:** https://console.cloud.google.com/
2. **Create a project** or select existing one
3. **Enable** Google+ API
4. **Create OAuth credentials:**
   - Go to: APIs & Services → Credentials
   - Click: Create Credentials → OAuth client ID
   - Type: Web application
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
5. **Copy** your Client ID and Client Secret

### 3. Create Environment File

Create a file named `.env.local` in your project root:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run-this-command-to-generate: openssl rand -base64 32
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
```

**Generate the secret:**
```bash
openssl rand -base64 32
```

### 4. Run the App

```bash
npm run dev
```

Open http://localhost:3000 - you'll see the sign-in page!

### 5. Test It

- ✅ Sign in with `@thoughtspot.com` email → Works!
- ❌ Sign in with other email → Access Denied

---

## 📦 What Was Added?

### New Files:
- `/app/api/auth/[...nextauth]/route.ts` - Authentication API
- `/app/auth/signin/page.tsx` - Sign-in page
- `/app/auth/error/page.tsx` - Error page
- `/components/AuthProvider.tsx` - Session provider
- `AUTHENTICATION_SETUP.md` - Detailed setup guide
- `env.example` - Environment variable template

### Modified Files:
- `package.json` - Added NextAuth.js
- `app/layout.tsx` - Added AuthProvider wrapper
- `app/page.tsx` - Added authentication check
- `components/Header.tsx` - Added sign-out button
- `.gitignore` - Added .env files

---

## 🔒 Security Features

✅ **Email Domain Restriction** - Only `@thoughtspot.com` emails allowed  
✅ **Session Management** - Secure session handling  
✅ **OAuth 2.0** - Industry-standard authentication  
✅ **Protected Routes** - Automatic redirect to sign-in  
✅ **Sign Out** - Users can sign out anytime  

---

## 🚀 Deploy to Production

### Vercel Deployment:

1. **Update Google OAuth redirect URIs** to include:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

2. **Add environment variables** in Vercel Dashboard:
   - Settings → Environment Variables
   - Add all 4 variables from your `.env.local`
   - Update `NEXTAUTH_URL` to your Vercel domain

3. **Push to GitHub** and Vercel will auto-deploy!

---

## 📚 Need More Help?

See the detailed guide: **AUTHENTICATION_SETUP.md**

---

## 🎉 That's It!

Your app is now secured with ThoughtSpot email authentication!

