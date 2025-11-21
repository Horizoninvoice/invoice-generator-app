# Google OAuth Setup Guide for Supabase

This guide will help you set up Google authentication for your Horizon Invoice Generator application.

## Prerequisites

- A Supabase project
- A Google Cloud Platform (GCP) account
- Access to your Supabase dashboard

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required information:
     - App name: "Horizon Invoice Generator"
     - User support email: your email
     - Developer contact: your email
   - Click **Save and Continue**
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (if in testing mode)
   - Click **Save and Continue**
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "Horizon Invoice Generator Web"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for local development)
     - `http://localhost:8888` (for Netlify dev)
     - `https://your-domain.netlify.app` (your production URL)
   - Authorized redirect URIs:
     - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
     - Replace `YOUR_SUPABASE_PROJECT_REF` with your actual Supabase project reference
   - Click **Create**
7. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the list and click on it
5. Enable Google provider
6. Enter your Google OAuth credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
7. Click **Save**

## Step 3: Update Redirect URLs

1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Add your site URLs:
   - Site URL: `https://your-domain.netlify.app` (your production URL)
   - Redirect URLs:
     - `http://localhost:3000/**`
     - `http://localhost:8888/**`
     - `https://your-domain.netlify.app/**`

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev:netlify
   ```
2. Navigate to the Sign Up or Login page
3. Click "Continue with Google"
4. You should be redirected to Google's sign-in page
5. After signing in, you'll be redirected back to your app

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Make sure the redirect URI in Google Console matches exactly: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Check for trailing slashes or extra characters

2. **"Invalid client" error**
   - Verify your Client ID and Client Secret are correct in Supabase
   - Make sure you copied the credentials for the correct project

3. **Redirect not working after sign-in**
   - Check your Site URL and Redirect URLs in Supabase settings
   - Ensure the redirect URL includes your actual domain

4. **OAuth consent screen issues**
   - If your app is in testing mode, add test users in Google Console
   - For production, you'll need to verify your app with Google

## Production Checklist

- [ ] OAuth consent screen is configured and verified
- [ ] Production URLs are added to Google Console
- [ ] Production URLs are added to Supabase settings
- [ ] Client ID and Secret are set in Supabase
- [ ] Test the flow in production environment

## Security Notes

- Never commit your Client Secret to version control
- Use environment variables for sensitive data
- Regularly rotate your OAuth credentials
- Monitor OAuth usage in Google Console

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase OAuth Providers](https://supabase.com/docs/guides/auth/social-login/auth-google)

