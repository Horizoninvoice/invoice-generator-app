# Razorpay Test Mode Payment Guide

## Test Mode Setup

### 1. Environment Variables in Netlify

Add these environment variables in your Netlify Dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add the following variables:

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:**
- Use your **Test Mode** keys from Razorpay Dashboard
- Test keys start with `rzp_test_`
- Mark these as **Secret** in Netlify

### 2. Test Cards for Razorpay

Use these test card numbers in Razorpay Test Mode:

#### Success Cards:
- **Card Number**: `4111 1111 1111 1111`
- **CVV**: Any 3 digits (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)
- **Name**: Any name

#### Failure Cards:
- **Card Number**: `4000 0000 0000 0002` (Card declined)
- **Card Number**: `4000 0000 0000 0069` (Expired card)

### 3. Testing the Payment Flow

1. **Login/Signup** to your application
2. Navigate to **Subscription** page (`/subscription`)
3. Click **"Upgrade to Pro"** or **"Get Lifetime Access"** (Max)
4. Razorpay checkout will open
5. Use test card: `4111 1111 1111 1111`
6. Enter any CVV and future expiry date
7. Complete the payment

### 4. Expected Behavior

**After successful payment:**
- ✅ Payment verification happens automatically
- ✅ User profile is updated in Supabase
- ✅ User role changes to `pro` or `max`
- ✅ Redirects to `/payment/success`
- ✅ Toast notification shows success message

**If payment fails:**
- ❌ Redirects to `/payment/cancel`
- ❌ Error message displayed
- ❌ User profile remains unchanged

### 5. Pricing

- **Pro Plan**: ₹249/month (24,900 paise)
- **Max Plan**: ₹1,499 one-time (149,900 paise)

### 6. Troubleshooting

**Issue: "Payment gateway not configured"**
- ✅ Check if `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in Netlify
- ✅ Redeploy after adding environment variables
- ✅ Check Netlify Function logs

**Issue: "Payment verification failed"**
- ✅ Check if `RAZORPAY_KEY_SECRET` matches the key used to create the order
- ✅ Verify Supabase connection in verify function
- ✅ Check Netlify Function logs for errors

**Issue: Payment succeeds but profile not updated**
- ✅ Check Supabase `user_profiles` table
- ✅ Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- ✅ Check Netlify Function logs

### 7. Checking Payment Status

After payment, check:
1. **Razorpay Dashboard** → **Payments** → Should show test payment
2. **Supabase** → `user_profiles` table → `role` should be `pro` or `max`
3. **Supabase** → `payments` table (if exists) → Should have payment record

### 8. Netlify Function Logs

To debug issues, check Netlify Function logs:
1. Go to **Netlify Dashboard** → **Functions**
2. Click on `payment/create` or `payment/verify`
3. View logs for errors

### 9. Test Mode vs Live Mode

**Test Mode:**
- Use test API keys (`rzp_test_...`)
- Use test card numbers
- No real money is charged
- Perfect for development and testing

**Live Mode:**
- Use live API keys (`rzp_live_...`)
- Use real card numbers
- Real money is charged
- Only use after Razorpay account is fully approved

### 10. Next Steps After Testing

Once test payments work:
1. ✅ Verify all payment flows work correctly
2. ✅ Test both Pro and Max plans
3. ✅ Verify profile updates in Supabase
4. ✅ Test payment cancellation
5. ✅ Submit for Razorpay live mode approval
6. ✅ Switch to live keys after approval

## Support

If you encounter issues:
1. Check Netlify Function logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test with different test cards
5. Contact Razorpay support if payment gateway issues persist

