# 🚀 Deployment Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages.

### Step 2: Test Locally

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the app running!

---

## Deploying to Vercel (Recommended - 10 minutes)

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Create a GitHub Account** (if you don't have one)
   - Go to [github.com](https://github.com)
   - Sign up for free

2. **Create a New Repository**
   - Click the "+" icon → "New repository"
   - Name it `thoughtspot-ps-recommender`
   - Make it Private (recommended for internal tools)
   - Click "Create repository"

3. **Push Your Code to GitHub**
   
   Open your terminal in the project folder:
   
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ThoughtSpot PS Recommender"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/thoughtspot-ps-recommender.git
   git push -u origin main
   ```
   
   Replace `YOUR-USERNAME` with your GitHub username.

4. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up" and choose "Continue with GitHub"
   - Click "Add New Project"
   - Import your `thoughtspot-ps-recommender` repository
   - Vercel will auto-detect Next.js - no configuration needed!
   - Click "Deploy"
   - Wait 2-3 minutes for deployment to complete

5. **Done! 🎉**
   - Vercel gives you a URL like `https://thoughtspot-ps-recommender.vercel.app`
   - Share this URL with your team
   - Every time you push to GitHub, Vercel auto-deploys!

### Option B: Deploy via Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy!
vercel

# Follow the prompts, then your app is live!
```

---

## Deploying to GitHub Pages (Alternative)

GitHub Pages is free but requires a few extra steps:

1. **Update `next.config.js`** (already configured for static export)

2. **Build the static site**:
   ```bash
   npm run build
   ```

3. **Push to GitHub** (same steps as above)

4. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "gh-pages" branch
   - Click "Save"

5. **Your site will be at**: `https://YOUR-USERNAME.github.io/thoughtspot-ps-recommender/`

---

## Updating Your Deployed App

### If using Vercel:
Just push to GitHub, Vercel auto-deploys:

```bash
git add .
git commit -m "Updated form fields"
git push
```

Wait 2-3 minutes and your changes are live!

### If using GitHub Pages:
Build and deploy:

```bash
npm run build
git add .
git commit -m "Updated app"
git push
```

---

## Custom Domain (Optional)

### Add your own domain to Vercel:

1. Go to your project on Vercel
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `ps-tools.thoughtspot.com`)
4. Follow DNS configuration instructions
5. Done! Your app is on your custom domain

---

## Troubleshooting

### "npm: command not found"
- Install Node.js from [nodejs.org](https://nodejs.org)
- Use the LTS version (currently v20)

### "Port 3000 is already in use"
- Another app is using port 3000
- Kill it: `npx kill-port 3000`
- Or run on a different port: `npm run dev -- -p 3001`

### Build errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Try `npm run build` again

### Vercel deployment fails
- Check your `next.config.js` is correct
- Ensure all files are committed to GitHub
- Check Vercel build logs for specific errors

---

## Environment Variables (If Needed Later)

To add environment variables in Vercel:

1. Go to your project → "Settings" → "Environment Variables"
2. Add your variables (e.g., API keys)
3. Redeploy your app

---

## Support

Need help? Contact:
- **Your IT Team** for internal deployment questions
- **Vercel Support** for platform-specific issues
- **GitHub Support** for repository issues

---

## Checklist ✅

- [ ] Installed Node.js
- [ ] Ran `npm install` successfully
- [ ] Tested locally with `npm run dev`
- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Created Vercel account
- [ ] Connected GitHub to Vercel
- [ ] Deployed to Vercel
- [ ] Shared URL with team
- [ ] Celebrated! 🎉

---

**Estimated Total Time**: 15-20 minutes from start to deployed app!



