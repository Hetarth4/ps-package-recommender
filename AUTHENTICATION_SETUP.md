# Authentication Setup Guide

This application uses **NextAuth.js with Google OAuth** to restrict access to ThoughtSpot employees only (emails ending with `@thoughtspot.com`).

## 🔐 Setup Steps

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing one)
   - Click "Select a project" → "New Project"
   - Name it: `PS Package Recommender`
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select **"Internal"** (if you have a Google Workspace) or **"External"**
   - Fill in:
     - App name: `PS Package Recommender`
     - User support email: Your ThoughtSpot email
     - Developer contact: Your ThoughtSpot email
   - Click "Save and Continue"
   - Skip "Scopes" (click "Save and Continue")
   - Skip "Test users" (click "Save and Continue")
   - Click "Back to Dashboard"

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **"Web application"**
   - Name: `PS Package Recommender`
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for local development)
     - `https://your-vercel-domain.vercel.app` (for production)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google` (for local)
     - `https://your-vercel-domain.vercel.app/api/auth/callback/google` (for production)
   - Click "Create"

6. **Copy Your Credentials**
   - You'll see a modal with:
     - **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-abc123def456`)
   - **Keep these safe!** You'll need them in the next step.

---

### Step 2: Configure Environment Variables

#### For Local Development:

1. **Create `.env.local` file** in your project root:
   ```bash
   # Copy the example file
   cp env.example .env.local
   ```

2. **Edit `.env.local`** with your actual values:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-generated-secret-here
   GOOGLE_CLIENT_ID=your-client-id-from-step-1
   GOOGLE_CLIENT_SECRET=your-client-secret-from-step-1
   ```

3. **Generate NEXTAUTH_SECRET:**
   - Run this command in your terminal:
     ```bash
     openssl rand -base64 32
     ```
   - Copy the output and paste it as your `NEXTAUTH_SECRET`

#### For Production (Vercel):

1. **Go to Vercel Dashboard**
   - Open your project
   - Go to "Settings" → "Environment Variables"

2. **Add these variables:**
   - `NEXTAUTH_URL` = `https://your-vercel-domain.vercel.app`
   - `NEXTAUTH_SECRET` = (same secret you generated)
   - `GOOGLE_CLIENT_ID` = (your Client ID)
   - `GOOGLE_CLIENT_SECRET` = (your Client Secret)

3. **Redeploy** your application for changes to take effect

---

### Step 3: Install Dependencies

Run this command to install NextAuth.js:

```bash
npm install
```

---

### Step 4: Test Authentication

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Go to `http://localhost:3000`
   - You should be redirected to the sign-in page

3. **Test Sign In:**
   - Click "Sign in with Google"
   - Use a `@thoughtspot.com` email → ✅ Should work
   - Use any other email → ❌ Should show "Access Denied"

---

## 🔒 How It Works

### Email Domain Restriction
The authentication is configured to **only allow** email addresses ending with `@thoughtspot.com`. This is enforced in the `signIn` callback in `/app/api/auth/[...nextauth]/route.ts`:

```typescript
async signIn({ user }) {
  if (user.email && user.email.endsWith("@thoughtspot.com")) {
    return true  // Allow access
  }
  return false  // Deny access
}
```

### Protected Routes
The main application page (`/app/page.tsx`) checks if the user is authenticated:
- If **not authenticated** → Redirects to sign-in page
- If **authenticated** → Shows the application

---

## 🚀 Deployment Notes

### Important Vercel Settings:

1. **Add Redirect URIs** in Google Cloud Console:
   - `https://your-app.vercel.app/api/auth/callback/google`

2. **Environment Variables** must be set in Vercel Dashboard

3. **Redeploy** after adding environment variables

---

## 🛠️ Troubleshooting

### "Error: OAuth Configuration Not Found"
- Make sure `.env.local` exists and contains all 4 variables
- Restart your development server after creating `.env.local`

### "Access Denied" for ThoughtSpot Email
- Check that the email exactly ends with `@thoughtspot.com`
- Check browser console for errors

### "Redirect URI Mismatch"
- Make sure your redirect URIs in Google Cloud Console match exactly:
  - Local: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://your-domain.vercel.app/api/auth/callback/google`

### Production Deployment Issues
- Verify all 4 environment variables are set in Vercel
- Make sure `NEXTAUTH_URL` matches your actual Vercel domain
- Redeploy after adding environment variables

---

## 📝 Security Notes

- ✅ Only `@thoughtspot.com` emails can access the app
- ✅ Uses secure OAuth 2.0 authentication
- ✅ No passwords stored in the application
- ✅ Session management handled by NextAuth.js
- ✅ Environment variables never committed to Git

---

## 🔄 Updating for Different Email Domain

To change the allowed email domain, edit `/app/api/auth/[...nextauth]/route.ts`:

```typescript
// Change this line:
if (user.email && user.email.endsWith("@thoughtspot.com")) {

// To your desired domain:
if (user.email && user.email.endsWith("@yourdomain.com")) {
```

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

