# Deployment Checklist for Vercel Production

Use this checklist to ensure a smooth deployment to Vercel production.

## Pre-Deployment Checklist

### 1. Vercel Account Setup
- [ ] Create a Vercel account at [vercel.com](https://vercel.com/signup)
- [ ] Verify your email address
- [ ] Create or join a team (optional)

### 2. Supabase Setup
- [ ] Create a Supabase project at [supabase.com](https://supabase.com)
- [ ] Note down your Project ID
- [ ] Copy the Project URL
- [ ] Copy the Anon/Public API Key
- [ ] Set up required database tables (see ADMIN_SETUP.md)
- [ ] Configure Row Level Security (RLS) policies

### 3. Local Environment
- [ ] Node.js 18+ is installed
- [ ] npm or yarn is installed
- [ ] Git is installed and configured
- [ ] Clone the repository locally

### 4. Environment Variables
- [ ] Create `.env` file from `.env.example`
- [ ] Update `VITE_SUPABASE_PROJECT_ID` in `.env`
- [ ] Update `VITE_SUPABASE_URL` in `.env`
- [ ] Update `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env`
- [ ] Test locally with `npm run dev`

### 5. Code Quality
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run lint` to check for code issues
- [ ] Run `npm run build` to verify build succeeds
- [ ] Test application locally with `npm run preview`
- [ ] Verify all routes work correctly
- [ ] Test authentication flow
- [ ] Test admin panel access

## Deployment Setup Checklist

### Option A: GitHub Actions (Recommended)

#### 6. Vercel Project Setup
- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Import the Git repository
- [ ] Select the repository
- [ ] Configure framework preset as "Vite"
- [ ] Set build command to `npm run build`
- [ ] Set output directory to `dist`
- [ ] Do NOT deploy yet (click "Skip" if asked)

#### 7. Add Vercel Environment Variables
- [ ] Go to Project Settings → Environment Variables
- [ ] Add `VITE_SUPABASE_PROJECT_ID` for Production, Preview, and Development
- [ ] Add `VITE_SUPABASE_URL` for Production, Preview, and Development
- [ ] Add `VITE_SUPABASE_PUBLISHABLE_KEY` for Production, Preview, and Development

#### 8. Get Vercel Deployment Credentials
- [ ] Get Vercel Token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
- [ ] Get Organization ID:
  - Run `vercel whoami` in terminal
  - OR find in Vercel project settings
- [ ] Get Project ID:
  - Run `vercel link` in project directory
  - Check `.vercel/project.json`
  - OR find in Vercel project settings

#### 9. Configure GitHub Secrets
- [ ] Go to GitHub repository Settings
- [ ] Navigate to Secrets and variables → Actions
- [ ] Add secret: `VERCEL_TOKEN` (your Vercel token)
- [ ] Add secret: `VERCEL_ORG_ID` (your organization ID)
- [ ] Add secret: `VERCEL_PROJECT_ID` (your project ID)

#### 10. Enable GitHub Actions
- [ ] Verify `.github/workflows/vercel-production.yml` exists
- [ ] Verify `.github/workflows/vercel-preview.yml` exists
- [ ] Push to main/master branch to trigger production deployment
- [ ] Monitor workflow in GitHub Actions tab

### Option B: Manual Deployment via CLI

#### 6. Install Vercel CLI
- [ ] Run `npm install -g vercel`
- [ ] Verify installation with `vercel --version`

#### 7. Login to Vercel
- [ ] Run `vercel login`
- [ ] Follow authentication prompts
- [ ] Verify with `vercel whoami`

#### 8. Link Project
- [ ] Navigate to project directory
- [ ] Run `vercel link`
- [ ] Select your team/account
- [ ] Confirm or create project

#### 9. Add Environment Variables via CLI
- [ ] Run `vercel env add VITE_SUPABASE_PROJECT_ID`
- [ ] Enter value and select "Production"
- [ ] Repeat for `VITE_SUPABASE_URL`
- [ ] Repeat for `VITE_SUPABASE_PUBLISHABLE_KEY`

#### 10. Deploy
- [ ] Run deployment script: `./scripts/deploy.sh`
- [ ] OR manually run: `vercel --prod`

## Post-Deployment Checklist

### 11. Verify Deployment
- [ ] Visit the production URL
- [ ] Check that the landing page loads
- [ ] Verify all assets load correctly (images, fonts, etc.)
- [ ] Test responsive design on mobile
- [ ] Test on different browsers (Chrome, Firefox, Safari)

### 12. Test Core Functionality
- [ ] Test user registration
- [ ] Test user login
- [ ] Verify pending approval state
- [ ] Test admin login (admin@bybit.com / admin123)
- [ ] Approve a test user from admin panel
- [ ] Test user dashboard access
- [ ] Test deposit functionality
- [ ] Test withdrawal functionality
- [ ] Verify transaction history

### 13. Database Connection
- [ ] Verify Supabase connection works
- [ ] Check that data is being saved
- [ ] Test data retrieval from database
- [ ] Verify RLS policies are working
- [ ] Check for any console errors

### 14. Security
- [ ] Verify HTTPS is enabled
- [ ] Check security headers are present
- [ ] Test that admin routes require authentication
- [ ] Verify that user data is protected
- [ ] Check for exposed sensitive information
- [ ] Review Vercel security settings

### 15. Performance
- [ ] Check page load times
- [ ] Verify asset caching is working
- [ ] Test on slow network connections
- [ ] Check Core Web Vitals in Vercel Analytics
- [ ] Optimize images if needed
- [ ] Consider implementing code splitting if bundle is too large

### 16. Monitoring Setup
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up error tracking (optional)
- [ ] Configure uptime monitoring (optional)
- [ ] Set up deployment notifications (optional)

### 17. Custom Domain (Optional)
- [ ] Add custom domain in Vercel project settings
- [ ] Configure DNS records
- [ ] Verify SSL certificate is issued
- [ ] Test custom domain access
- [ ] Update DNS propagation (may take 24-48 hours)

### 18. Documentation
- [ ] Update README with production URL
- [ ] Document any deployment issues encountered
- [ ] Share deployment credentials with team (securely)
- [ ] Update project documentation
- [ ] Create runbook for common issues

## Ongoing Maintenance Checklist

### Regular Tasks
- [ ] Monitor deployment logs regularly
- [ ] Check for Vercel build failures
- [ ] Review Supabase usage metrics
- [ ] Update dependencies monthly
- [ ] Review and rotate secrets quarterly
- [ ] Back up database regularly
- [ ] Monitor application performance
- [ ] Review error logs

### When Making Changes
- [ ] Create a feature branch
- [ ] Test changes locally
- [ ] Create pull request for preview deployment
- [ ] Review preview deployment
- [ ] Merge to main for production deployment
- [ ] Verify production deployment
- [ ] Monitor for issues post-deployment

## Rollback Plan

If deployment fails or issues occur:

- [ ] Check Vercel deployment logs
- [ ] Review GitHub Actions workflow logs
- [ ] Verify environment variables are correct
- [ ] Check Supabase project status
- [ ] Roll back to previous deployment in Vercel dashboard
- [ ] Investigate and fix issues
- [ ] Redeploy after fixes

## Emergency Contacts

- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Supabase Support: [supabase.com/support](https://supabase.com/support)
- GitHub Support: [support.github.com](https://support.github.com)

---

**Last Updated**: December 2024

**Note**: Keep this checklist updated as deployment procedures evolve.
