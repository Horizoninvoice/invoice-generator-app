# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Razorpay Account**: Get your API keys from [Razorpay Dashboard](https://dashboard.razorpay.com)
3. **Supabase Project**: Ensure you have your Supabase URL and Service Role Key

## Step 1: Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (GitHub/GitLab/Bitbucket)
3. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Option B: Deploy via CLI

```bash
vercel
```

Follow the prompts to link your project.

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

### Required Variables:

1. **RAZORPAY_KEY_ID**
   - Get from: Razorpay Dashboard > Settings > API Keys
   - Example: `rzp_test_xxxxxxxxxxxxx`

2. **RAZORPAY_KEY_SECRET**
   - Get from: Razorpay Dashboard > Settings > API Keys
   - Example: `xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

3. **NEXT_PUBLIC_SUPABASE_URL**
   - Get from: Supabase Dashboard > Settings > API
   - Example: `https://xxxxxxxxxxxxx.supabase.co`

4. **SUPABASE_SERVICE_ROLE_KEY**
   - Get from: Supabase Dashboard > Settings > API > Service Role Key
   - ⚠️ **Keep this secret!** Never expose in client-side code
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

5. **NEXT_PUBLIC_SUPABASE_ANON_KEY** (if not already set)
   - Get from: Supabase Dashboard > Settings > API > anon/public key
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 4: Update Frontend API Calls

The API routes will be available at:
- `https://your-domain.vercel.app/api/payment/create`
- `https://your-domain.vercel.app/api/payment/verify`

Update your frontend code to use the full URL or relative paths (they should work automatically).

## Step 5: Configure Razorpay Webhook (Optional but Recommended)

1. Go to Razorpay Dashboard > Settings > Webhooks
2. Add webhook URL: `https://your-domain.vercel.app/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy the webhook secret

5. Add to Vercel Environment Variables:
   - **RAZORPAY_WEBHOOK_SECRET**: Your webhook secret

## Step 6: Redeploy

After adding environment variables, redeploy your application:

```bash
vercel --prod
```

Or trigger a new deployment from the Vercel dashboard.

## Testing

1. Visit your deployed site: `https://your-domain.vercel.app`
2. Test the payment flow:
   - Go to Subscription page
   - Select a plan
   - Complete payment (use Razorpay test mode)
   - Verify account upgrade

## Troubleshooting

### API Routes Not Working

- Check that files are in `/api` directory
- Verify environment variables are set
- Check Vercel function logs in dashboard

### Payment Verification Fails

- Verify Razorpay keys are correct
- Check Supabase connection
- Ensure `user_profiles` table exists with correct schema
- Check function logs for detailed errors

### Build Errors

- Ensure all dependencies are in `package.json`
- Check that TypeScript types are installed
- Verify build command in `vercel.json`

## Database Schema Requirements

Ensure your Supabase database has:

1. **user_profiles** table with columns:
   - `user_id` (uuid, primary key)
   - `role` (text: 'user', 'pro', 'max')
   - `subscription_type` (text)
   - `subscription_end_date` (timestamp)

2. **payments** table (optional, for payment history):
   - `id` (uuid, primary key)
   - `user_id` (uuid)
   - `razorpay_order_id` (text)
   - `razorpay_payment_id` (text)
   - `amount` (numeric)
   - `currency` (text)
   - `status` (text)
   - `plan` (text)
   - `created_at` (timestamp)

## Security Notes

- Never commit `.env` files
- Use Vercel environment variables for secrets
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Use Razorpay test mode for development
- Enable webhook signature verification in production

