# Netlify Deployment Guide

## Quick Setup

1. **Connect Repository to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Select the repository and branch (usually `main`)

2. **Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18.x or higher (set in Netlify UI or `netlify.toml`)

3. **Environment Variables**
   Add these in Netlify Dashboard → Site settings → Environment variables:
   
   **Required:**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   **For Payment Functions (if using Razorpay):**
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
   
   ⚠️ **Important:** 
   - `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` should be marked as "Secret" in Netlify
   - These are used by Netlify Functions (server-side only)
   - Do NOT prefix them with `VITE_` (that's only for client-side variables)

4. **Deploy**
   - Netlify will automatically build and deploy
   - Check the deploy logs for any errors

## Files Created

- `netlify.toml` - Build configuration and redirects
- `public/_redirects` - SPA routing support (all routes → index.html)

## Troubleshooting

### White Screen Issues

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for JavaScript errors in Console tab
   - Check Network tab for failed requests

2. **Check Environment Variables**
   - Verify all required variables are set in Netlify
   - Redeploy after adding variables

3. **Check Build Logs**
   - Go to Netlify Dashboard → Deploys
   - Check the latest deploy log for errors

4. **Clear Cache**
   - In Netlify: Site settings → Build & deploy → Clear cache and retry deploy
   - In Browser: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

5. **Verify Build Output**
   - Build should create a `dist` folder
   - `dist/index.html` should exist
   - Check that all assets are being generated

## Common Issues

### Issue: White Screen
**Solution:** 
- Ensure `_redirects` file exists in `public/` folder
- Verify `netlify.toml` is in root directory
- Check browser console for errors

### Issue: 404 on Routes
**Solution:**
- The `_redirects` file should handle this
- Verify it contains: `/*    /index.html   200`

### Issue: Environment Variables Not Working
**Solution:**
- Variables must start with `VITE_` for Vite to expose them
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Issue: Build Fails
**Solution:**
- Check Node version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific error messages

## Post-Deployment

1. **Test the Site**
   - Visit your Netlify URL
   - Test all routes (home, login, signup, etc.)
   - Check that authentication works

2. **Custom Domain (Optional)**
   - Netlify Dashboard → Domain settings
   - Add your custom domain
   - Update DNS records as instructed

3. **Update Razorpay Settings**
   - Add your Netlify URL to Razorpay dashboard
   - Update webhook URLs if needed

