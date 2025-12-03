# Deployment Guide - Ganhos Bybit

This guide provides detailed instructions for deploying the Ganhos Bybit application to Vercel.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Vercel Project Setup](#vercel-project-setup)
- [Automated Deployment](#automated-deployment)
- [Manual Deployment](#manual-deployment)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. **Node.js 18+** installed locally
2. **A Vercel account** - Sign up at [vercel.com](https://vercel.com/signup)
3. **A Supabase project** - Set up at [supabase.com](https://supabase.com)
4. **GitHub account** with access to this repository

## Environment Setup

### 1. Supabase Configuration

Get your Supabase credentials from your project settings:

1. Go to: `https://app.supabase.com/project/[your-project-id]/settings/api`
2. Copy the following values:
   - **Project ID** (from the URL)
   - **Project URL** (API URL)
   - **Anon/Public Key** (API Keys section)

### 2. Environment Variables

Create a `.env` file locally (for development) using the `.env.example` template:

```bash
cp .env.example .env
```

Update the values in `.env`:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key"
```

## Vercel Project Setup

### Option 1: Using Vercel Dashboard (Recommended)

1. **Import the Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select "Import Git Repository"
   - Choose this repository

2. **Configure the Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Add Environment Variables**
   - In the "Environment Variables" section, add:
     - `VITE_SUPABASE_PROJECT_ID`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Select "Production", "Preview", and "Development" for each variable

4. **Deploy**
   - Click "Deploy"
   - Wait for the initial deployment to complete

### Option 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link the Project**
   ```bash
   cd /path/to/ganhos-bybit
   vercel link
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_PROJECT_ID production
   vercel env add VITE_SUPABASE_URL production
   vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Automated Deployment

This project includes GitHub Actions workflows for continuous deployment.

### Setting Up GitHub Actions

1. **Get Vercel Credentials**
   
   - **Vercel Token**: 
     - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
     - Create a new token
     - Copy and save it securely

   - **Organization ID**:
     ```bash
     vercel whoami
     ```
     Or find it in your Vercel project settings

   - **Project ID**:
     - After linking with `vercel link`, check `.vercel/project.json`
     - Or find it in your Vercel project settings

2. **Add GitHub Secrets**
   
   Go to your GitHub repository:
   - Navigate to `Settings` → `Secrets and variables` → `Actions`
   - Click "New repository secret"
   - Add the following secrets:

   | Name | Description |
   |------|-------------|
   | `VERCEL_TOKEN` | Your Vercel authentication token |
   | `VERCEL_ORG_ID` | Your Vercel organization/team ID |
   | `VERCEL_PROJECT_ID` | Your Vercel project ID |

3. **Deployment Triggers**

   - **Production Deployment** (`.github/workflows/vercel-production.yml`)
     - Triggers: Push to `main` or `master` branch
     - Deploys to: Production environment

   - **Preview Deployment** (`.github/workflows/vercel-preview.yml`)
     - Triggers: Pull requests to `main` or `master` branch
     - Deploys to: Preview environment

## Manual Deployment

### Deploy to Preview

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to preview
vercel
```

### Deploy to Production

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to production
vercel --prod
```

### Using Vercel's Git Integration

If you've connected your repository to Vercel:

1. **For Production**: Push or merge to the `main` branch
2. **For Preview**: Create a pull request

Vercel will automatically detect changes and deploy.

## Post-Deployment

### Verify Deployment

1. **Check Build Logs**
   - Go to your Vercel dashboard
   - Select your project
   - Click on the latest deployment
   - Review logs for any errors

2. **Test the Application**
   - Visit your production URL
   - Test key features:
     - Landing page loads correctly
     - User registration works
     - Login functionality works
     - Admin panel is accessible
     - Dashboard displays properly

3. **Verify Environment Variables**
   - Check that Supabase connection works
   - Test data fetching from the database

### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

**Issue**: Build fails with module not found errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Issue**: Build fails with TypeScript errors
```bash
# Solution: Check TypeScript configuration
npm run lint
# Fix any reported errors
```

### Environment Variables Not Working

**Issue**: Application can't connect to Supabase

1. Verify environment variables in Vercel dashboard
2. Ensure variable names match exactly (case-sensitive)
3. Make sure variables are set for the correct environment (Production/Preview)
4. Redeploy after updating environment variables

### Runtime Errors

**Issue**: Application loads but features don't work

1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Check network tab for failed API calls
4. Ensure Supabase RLS (Row Level Security) policies are configured

### Routing Issues

**Issue**: Page refresh returns 404

The `vercel.json` configuration should handle this with rewrites. If issues persist:

1. Verify `vercel.json` contains:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/" }
     ]
   }
   ```

2. Check that `outputDirectory` is set to `dist`

### Performance Issues

**Issue**: Large bundle size warning

The build shows a warning about chunk size. To optimize:

1. Enable code splitting:
   ```typescript
   // In route configuration, use lazy loading
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   ```

2. Configure manual chunks in `vite.config.ts`:
   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'react-vendor': ['react', 'react-dom', 'react-router-dom'],
           'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
         }
       }
     }
   }
   ```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Support

For deployment issues:

1. Check Vercel deployment logs
2. Review GitHub Actions workflow runs
3. Check Supabase project status
4. Review this troubleshooting guide

---

Last updated: December 2024
