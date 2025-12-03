# Quick Start: Deploy to Vercel Production

This guide will get your application deployed to Vercel production in under 10 minutes.

## Prerequisites ✅

- [ ] GitHub repository access
- [ ] Vercel account ([sign up here](https://vercel.com/signup))
- [ ] Supabase project ([create here](https://supabase.com))

## Option 1: Automated Deployment (Recommended) 🤖

### Step 1: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select this repository: `bitgogle/ganhos-bybit`
4. Click "Import"

### Step 2: Configure Environment Variables

In the Vercel import screen, add these environment variables:

| Name | Value | Where to find |
|------|-------|---------------|
| `VITE_SUPABASE_PROJECT_ID` | Your project ID | From Supabase project URL |
| `VITE_SUPABASE_URL` | `https://[id].supabase.co` | Supabase Project Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your anon key | Supabase Project Settings → API |

**Note**: Select "Production", "Preview", and "Development" for each variable.

### Step 3: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for the build to complete
3. Click the deployment URL to view your live site! 🎉

### Step 4: Set Up GitHub Actions (Optional but Recommended)

For automated deployments on every push:

1. Get your Vercel credentials:
   - **Token**: [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create Token
   - **Org ID**: Run `npx vercel@latest whoami` or check project settings
   - **Project ID**: Check `.vercel/project.json` after first deployment

2. Add GitHub Secrets:
   - Go to: `github.com/bitgogle/ganhos-bybit/settings/secrets/actions`
   - Add these secrets:
     - `VERCEL_TOKEN` = Your Vercel token
     - `VERCEL_ORG_ID` = Your organization ID
     - `VERCEL_PROJECT_ID` = Your project ID

3. Done! Future pushes to `main` will auto-deploy to production.

## Option 2: Quick CLI Deployment 💻

For a one-command deployment:

```bash
# 1. Clone the repository
git clone https://github.com/bitgogle/ganhos-bybit.git
cd ganhos-bybit

# 2. Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run the deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

The script will:
- Check authentication
- Install dependencies
- Build the project
- Deploy to Vercel

## Post-Deployment Checklist ✨

After deployment, verify:

- [ ] Landing page loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works (admin@bybit.com / admin123)
- [ ] Dashboard displays properly
- [ ] Supabase connection is working

## Troubleshooting 🔧

### Build Failed?
- Check environment variables are set correctly
- Verify Supabase credentials are valid
- Check build logs in Vercel dashboard

### Site Loads but Features Don't Work?
- Verify environment variables in Vercel project settings
- Check browser console for errors
- Ensure Supabase project is active
- Verify API keys are correct

### Need Help?
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- Use [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for step-by-step guide
- Review Vercel deployment logs

## Next Steps 🚀

After successful deployment:

1. **Custom Domain** (Optional)
   - Go to Vercel project settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Set Up Monitoring** (Optional)
   - Enable Vercel Analytics
   - Set up error tracking
   - Configure uptime monitoring

3. **Database Setup**
   - Follow [ADMIN_SETUP.md](./ADMIN_SETUP.md) for Supabase configuration
   - Set up required tables
   - Configure Row Level Security

## Success! 🎉

Your Ganhos Bybit application is now live on Vercel!

**What's Been Deployed:**
- ✅ React + TypeScript application
- ✅ Optimized production build
- ✅ Security headers configured
- ✅ Asset caching enabled
- ✅ Client-side routing working
- ✅ Supabase integration connected

**Deployment URLs:**
- Production: Check Vercel dashboard for your URL
- Preview: Automatic for each PR
- Development: `npm run dev` (localhost)

---

**Estimated Time:** 5-10 minutes
**Difficulty:** Easy

For detailed documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md)
