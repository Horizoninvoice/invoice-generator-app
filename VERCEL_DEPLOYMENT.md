# Vercel Deployment Guide

This guide will help you deploy Horizon Invoice Generator to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A GitHub account (for connecting your repository)
- All environment variables ready

## Deployment Steps

### 1. Connect Your Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project

### 2. Configure Build Settings

Vercel should auto-detect the following settings:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Set Environment Variables

In your Vercel project settings, add these environment variables:

#### Required Environment Variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Optional Environment Variables

```
VITE_GOOGLE_ADSENSE_ID=your_adsense_id
VITE_API_URL=your_vercel_deployment_url (optional, defaults to window.location.origin)
```

**Note**: 
- `VITE_*` variables are public and will be bundled into the client-side code
- `SUPABASE_SERVICE_ROLE_KEY` and `RAZORPAY_KEY_SECRET` are server-side only and should never be exposed to the client

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

## API Routes

The application uses Vercel Serverless Functions for payment processing:

- `/api/payment/create` - Creates a Razorpay order
- `/api/payment/verify` - Verifies Razorpay payment and updates user subscription

These functions are automatically deployed with your application.

## Local Development

For local development with API routes:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Run the development server:
```bash
npm run dev
```

3. For testing API routes locally, use:
```bash
vercel dev
```

This will start a local server that mimics Vercel's serverless functions.

## Troubleshooting

### Build Fails

- Check that all required environment variables are set
- Ensure Node.js version is 18+ (set in Vercel project settings)
- Check build logs for specific errors

### API Routes Return 404

- Ensure your API routes are in the `api/` directory
- Check that the file structure matches: `api/payment/create.ts`
- Verify environment variables are set correctly

### Payment Not Working

- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
- Check Razorpay dashboard for test/live mode
- Ensure your Vercel deployment URL is added to Razorpay webhook settings

## Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables for Different Environments

You can set different environment variables for:
- Production
- Preview (for pull requests)
- Development

Go to Project Settings > Environment Variables to configure.

## Support

For issues specific to Vercel deployment, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

