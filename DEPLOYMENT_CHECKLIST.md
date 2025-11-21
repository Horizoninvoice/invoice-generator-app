# Vercel Deployment Checklist ✅

## Pre-Deployment Verification

### ✅ Code Configuration
- [x] API routes converted to Vercel format (`api/payment/create.ts`, `api/payment/verify.ts`)
- [x] `vercel.json` configuration file exists and is correct
- [x] Frontend code updated to use `/api/payment/` endpoints
- [x] No Netlify references remaining in codebase
- [x] Dependencies include `@vercel/node`
- [x] Build script configured (`npm run build`)
- [x] Output directory set to `dist`

### ✅ Files Ready
- [x] `vercel.json` - Vercel configuration
- [x] `api/payment/create.ts` - Payment creation API
- [x] `api/payment/verify.ts` - Payment verification API
- [x] `package.json` - Dependencies and scripts
- [x] `.gitignore` - Excludes `.env` and sensitive files

### ⚠️ Before Deploying - Set Environment Variables

You **MUST** set these environment variables in Vercel Dashboard before deployment:

#### Required (Set in Vercel Dashboard → Project Settings → Environment Variables):

1. **VITE_SUPABASE_URL**
   - Your Supabase project URL
   - Example: `https://xxxxxxxxxxxxx.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - Safe to expose (public key)

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Your Supabase service role key (secret!)
   - Used by API routes only
   - ⚠️ Never expose to client

4. **RAZORPAY_KEY_ID**
   - Your Razorpay API key ID
   - Test mode: `rzp_test_xxxxxxxxxxxxx`
   - Live mode: `rzp_live_xxxxxxxxxxxxx`

5. **RAZORPAY_KEY_SECRET**
   - Your Razorpay API secret (secret!)
   - Used by API routes only
   - ⚠️ Never expose to client

#### Optional:

6. **VITE_GOOGLE_ADSENSE_ID**
   - Your Google AdSense ID (if using ads)

7. **VITE_API_URL**
   - Usually not needed (defaults to `window.location.origin`)
   - Only set if you need a custom API URL

## Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Select the repository

### Step 3: Configure Project

Vercel should auto-detect:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

If not auto-detected, manually set these.

### Step 4: Add Environment Variables

**IMPORTANT**: Add all environment variables **BEFORE** deploying!

1. In Vercel project settings, go to **Environment Variables**
2. Add each variable from the list above
3. Select environment (Production, Preview, Development)
4. Mark sensitive variables as **"Encrypted"**

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Check build logs for any errors

### Step 6: Verify Deployment

After deployment, verify:

1. **Homepage loads**: Visit `https://your-project.vercel.app`
2. **Authentication works**: Test login/signup
3. **API routes work**: Test payment flow
4. **Check Vercel Function logs**: Go to Deployments → Functions tab

## Post-Deployment

### Update Razorpay Settings

1. Go to Razorpay Dashboard
2. Add your Vercel URL to allowed domains
3. Update webhook URL (if using webhooks) to: `https://your-project.vercel.app/api/payment/verify`

### Test Payment Flow

1. Navigate to `/subscription` page
2. Click "Upgrade to Pro" or "Get Lifetime Access"
3. Use Razorpay test card: `4111 1111 1111 1111`
4. Verify payment completes successfully
5. Check Supabase to confirm user profile updated

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version is 18+ (set in Vercel project settings)

### API Routes Return 404
- Verify API routes are in `api/` directory
- Check file structure: `api/payment/create.ts`
- Ensure environment variables are set

### Payment Not Working
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
- Check Razorpay dashboard for test/live mode
- Review Vercel Function logs for errors

### Environment Variables Not Working
- Ensure variables are set in correct environment (Production/Preview)
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

## Status: ✅ READY TO DEPLOY

Your application is ready for Vercel deployment! Just follow the steps above.

