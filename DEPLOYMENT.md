# Deployment Guide

## Deploy to Vercel

### Step 1: Push to GitHub

1. Create a new repository on GitHub (if you haven't already)
   - Go to https://github.com/new
   - Name it: `invoice-generator-app` (or any name you prefer)
   - Don't initialize with README, .gitignore, or license

2. Add the remote and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/invoice-generator-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub

2. Click "Add New Project"

3. Import your GitHub repository:
   - Select the `invoice-generator-app` repository
   - Click "Import"

4. Configure environment variables:
   - Click "Environment Variables"
   - Add all variables from your `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     RAZORPAY_KEY_ID=your_razorpay_key_id
     RAZORPAY_KEY_SECRET=your_razorpay_key_secret
     RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
     NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_adsense_id
     ```

5. Deploy:
   - Click "Deploy"
   - Wait for the build to complete
   - You'll get a URL like: `https://invoice-generator-app.vercel.app`

### Step 3: Configure Razorpay Webhook

1. Go to Razorpay Dashboard > Settings > Webhooks
2. Add webhook URL: `https://your-vercel-url.vercel.app/api/payment/webhook`
3. Select events:
   - `payment.captured`
   - `payment.failed`
4. Copy the webhook secret and update it in Vercel environment variables

### Step 4: Configure Google AdSense

1. Go to Google AdSense dashboard
2. Add your site: `https://your-vercel-url.vercel.app`
3. Get your AdSense ID
4. Update `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` in Vercel environment variables
5. Redeploy if needed

### Step 5: Update Supabase URLs (if needed)

If you have any hardcoded URLs in your Supabase configuration, make sure they point to your Vercel domain.

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project > Settings > Domains
2. Add your custom domain
3. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails
- Check that all environment variables are set in Vercel
- Ensure Node.js version is compatible (Vercel uses Node 18+ by default)

### Webhook Not Working
- Verify the webhook URL is correct in Razorpay
- Check Vercel function logs for errors
- Ensure `RAZORPAY_WEBHOOK_SECRET` matches Razorpay dashboard

### AdSense Not Showing
- Verify your site is approved in AdSense
- Check that `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` is set correctly
- Ensure your site is accessible (not behind authentication)

