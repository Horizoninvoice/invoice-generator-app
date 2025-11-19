# Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Razorpay account (for payments)
- A Google AdSense account (optional, for ads)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the SQL from `lib/supabase/schema.sql`
3. Get your Supabase URL and anon key from Settings > API
4. Get your service role key from Settings > API (keep this secret!)

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Google AdSense (optional)
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_google_adsense_id
```

## Step 4: Set Up Razorpay Webhooks

1. Go to Razorpay Dashboard > Settings > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events:
   - `payment.captured`
   - `payment.failed`
   - `subscription.cancelled` (if using subscriptions)
4. Copy the webhook secret to `RAZORPAY_WEBHOOK_SECRET`
5. Get your Key ID and Key Secret from Settings > API Keys

## Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Create Your First Account

1. Go to `/signup` and create an account
2. Verify your email (if email verification is enabled)
3. Log in and start creating invoices!

## Features

### Free Users
- Create invoices
- Manage customers and products
- Generate PDF invoices
- Limited features

### Pro Users ($9.99/month)
- No ads
- Unlimited invoices
- Multiple invoice templates
- Excel export
- Custom logo upload
- Priority support

## Database Schema

The database schema is defined in `lib/supabase/schema.sql`. It includes:

- `customers` - Customer information
- `products` - Product catalog
- `invoices` - Invoice records
- `invoice_items` - Line items for invoices
- `payments` - Payment records
- `user_profiles` - User role and subscription info

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

Make sure to set all environment variables in your hosting platform.

## Troubleshooting

### Database Connection Issues
- Verify your Supabase URL and keys are correct
- Check that RLS policies are set up correctly
- Ensure the schema has been run in Supabase SQL Editor

### Payment Issues
- Verify Razorpay keys are correct
- Check webhook endpoint is accessible
- Ensure webhook secret matches
- Make sure Razorpay checkout script is loaded

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be 18+)
- Clear `.next` folder and rebuild

## Support

For issues or questions, please check the documentation or create an issue in the repository.

