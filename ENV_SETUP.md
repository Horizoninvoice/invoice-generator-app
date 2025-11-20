# Environment Variables Setup Guide

## Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in `.env`:

### Supabase Configuration

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings > API**
4. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### Razorpay Configuration

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to **Settings > API Keys**
3. Generate API keys (or use existing ones)
4. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`

### Example `.env` file:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_API_URL=
```

## Vercel Deployment

When deploying to Vercel, add these environment variables in the Vercel Dashboard:

1. Go to your project on [Vercel](https://vercel.com)
2. Navigate to **Settings > Environment Variables**
3. Add each variable:

### Required Variables:

| Variable Name | Description | Where to Get It |
|--------------|-------------|-----------------|
| `VITE_SUPABASE_URL` | Supabase project URL | Supabase Dashboard > Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard > Settings > API |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | Razorpay Dashboard > Settings > API Keys |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | Razorpay Dashboard > Settings > API Keys |

### Optional Variables:

| Variable Name | Description |
|--------------|-------------|
| `VITE_API_URL` | Custom API base URL (leave empty for auto-detection) |

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to Git (it's already in `.gitignore`)
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Never expose `RAZORPAY_KEY_SECRET` in client-side code
- Use `.env.example` as a template (safe to commit)
- Use test keys for development, production keys for production

## Testing

After setting up environment variables:

1. **Local Development:**
   ```bash
   npm run dev
   ```

2. **Verify Supabase connection:**
   - Try logging in/signing up
   - Check browser console for errors

3. **Verify Razorpay (after deployment):**
   - Go to Subscription page
   - Try creating a payment order
   - Check Vercel function logs for errors

## Troubleshooting

### "Missing Supabase environment variables" error
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart your dev server after adding variables

### API routes not working
- Ensure all environment variables are set in Vercel
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set (for API routes)
- Check Vercel function logs for detailed errors

### Payment creation fails
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct
- Ensure you're using the correct keys (test vs production)
- Check Razorpay dashboard for API key status

