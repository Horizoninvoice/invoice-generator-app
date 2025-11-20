# Supabase Email Confirmation Setup

## Overview
This application uses Supabase Auth with email confirmation enabled. Users must confirm their email address before they can access protected routes.

## Supabase Configuration

### 1. Enable Email Confirmation

1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Settings**
3. Under **Email Auth**, ensure:
   - ✅ **Enable email confirmations** is checked
   - ✅ **Secure email change** is enabled (optional but recommended)

### 2. Configure Email Templates

1. Go to **Authentication > Email Templates**
2. Customize the **Confirm signup** template:

**Subject:**
```
Confirm your signup
```

**Body (HTML):**
```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>

<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>

<p>If you didn't sign up for this account, you can safely ignore this email.</p>
```

**Body (Plain Text):**
```
Confirm your signup

Follow this link to confirm your user:

{{ .ConfirmationURL }}

If you didn't sign up for this account, you can safely ignore this email.
```

### 3. Set Site URL

1. Go to **Authentication > URL Configuration**
2. Set **Site URL** to your Vercel deployment URL:
   ```
   https://your-project.vercel.app
   ```
3. Add **Redirect URLs**:
   ```
   https://your-project.vercel.app/auth/confirm-email
   https://your-project.vercel.app/**
   ```

### 4. Email Provider Setup

Supabase uses its default email provider, but you can configure a custom SMTP:

1. Go to **Settings > Auth**
2. Under **SMTP Settings**, configure:
   - **SMTP Host**: Your SMTP server
   - **SMTP Port**: Usually 587 or 465
   - **SMTP User**: Your SMTP username
   - **SMTP Password**: Your SMTP password
   - **Sender email**: The email address that sends confirmation emails
   - **Sender name**: Display name (e.g., "Horizon Invoice Generator")

## How It Works

### Signup Flow:
1. User signs up with email and password
2. Supabase sends confirmation email automatically
3. User is redirected to `/auth/confirm-email` page
4. User clicks confirmation link in email
5. Link redirects to `/auth/confirm-email?token=...&type=email`
6. App verifies the token and confirms the email
7. User is redirected to dashboard

### Login Flow:
1. User tries to login
2. If email not confirmed, error message is shown
3. User is redirected to confirmation page
4. User can resend confirmation email if needed

### Protected Routes:
- Users with unconfirmed emails are redirected to `/auth/confirm-email`
- Confirmation page and resend page are accessible without confirmation

## Testing

### Test Email Confirmation:
1. Sign up with a test email
2. Check your email inbox (and spam folder)
3. Click the confirmation link
4. Verify you're redirected to dashboard

### Test Resend:
1. Go to `/auth/resend-confirmation`
2. Enter your email
3. Check for new confirmation email

## Troubleshooting

### Emails Not Sending:
- Check Supabase email logs in Dashboard > Authentication > Logs
- Verify SMTP settings if using custom SMTP
- Check spam/junk folder
- Ensure Site URL is correctly configured

### Confirmation Link Not Working:
- Verify Redirect URLs are set in Supabase
- Check that the link hasn't expired (default: 24 hours)
- Ensure token parameters are being passed correctly

### Users Can't Access Dashboard:
- Check if email confirmation is required in Supabase settings
- Verify `email_confirmed_at` is being set correctly
- Check ProtectedRoute component logic

## Environment Variables

No additional environment variables needed for email confirmation - it's handled by Supabase automatically when configured in the dashboard.

