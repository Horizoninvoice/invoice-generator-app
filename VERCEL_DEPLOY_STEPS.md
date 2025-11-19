# Deploy to Vercel - Step by Step

## ✅ Step 1: Code is on GitHub
Your code is now at: https://github.com/Horizoninvoice/invoice-generator-app

## Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click "Add New Project"**
4. **Import your repository**:
   - Search for `Horizoninvoice/invoice-generator-app`
   - Click "Import"

5. **Configure Project**:
   - Framework Preset: Next.js (should auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

6. **Add Environment Variables** (IMPORTANT!):
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
   NEXT_PUBLIC_GOOGLE_ADSENSE_ID=your_adsense_id
   ```

7. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://invoice-generator-app.vercel.app`

## Step 3: Configure Razorpay Webhook

Once you have your Vercel URL:

1. Go to Razorpay Dashboard > Settings > Webhooks
2. Add webhook URL: `https://your-app-name.vercel.app/api/payment/webhook`
3. Select events:
   - `payment.captured`
   - `payment.failed`
4. Copy the webhook secret
5. Update `RAZORPAY_WEBHOOK_SECRET` in Vercel environment variables
6. Redeploy (or it will auto-redeploy)

## Step 4: Configure Google AdSense

1. Go to Google AdSense dashboard
2. Add your site: `https://your-app-name.vercel.app`
3. Get your AdSense Publisher ID
4. Update `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` in Vercel
5. Wait for AdSense approval (can take 1-2 days)

## 🔒 Security Note

**IMPORTANT**: After deployment, consider:
1. Revoking the GitHub token you used (if it was temporary)
2. Using Vercel's built-in GitHub integration (more secure)
3. Never commit tokens to git

Your token is stored in git config locally, but make sure it's not in any files that are committed.

