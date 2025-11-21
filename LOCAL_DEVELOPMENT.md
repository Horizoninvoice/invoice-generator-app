# Local Development Guide

## ⚠️ IMPORTANT: Fix Common Errors First

### Error: Supabase 400 - Missing `notes` Column

If you see `Failed to load resource: the server responded with a status of 400` errors:

**Run this SQL in Supabase SQL Editor:**
```sql
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS notes TEXT;
```

### Error: Netlify Functions 404

If you see `/.netlify/functions/payment/create:1 Failed to load resource: the server responded with a status of 404`:

**You must use `npm run dev:netlify` instead of `npm run dev`**

---

## Running the Application Locally

### Option 1: Using Netlify CLI (Recommended for Payment Testing)

This runs both the frontend and Netlify Functions locally.

1. **Install Netlify CLI** (if not already installed):
```bash
npm install -g netlify-cli
```

Or use the local version:
```bash
npm install
```

2. **Create `.env` file** in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

3. **Run with Netlify Dev**:
```bash
npm run dev:netlify
```

This will:
- Start Vite dev server on `http://localhost:8888`
- Run Netlify Functions locally
- Make payment endpoints available at `http://localhost:8888/.netlify/functions/payment/create`

### Option 2: Using Vite Only (Frontend Only)

If you just want to test the frontend without payments:

```bash
npm run dev
```

This runs on `http://localhost:3000` but payment functions won't work.

## Environment Variables for Local Development

Create a `.env` file in the root directory:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay (Test Mode)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
```

**Important:**
- Never commit `.env` file to git (it's in `.gitignore`)
- Use test mode keys for local development
- Test keys start with `rzp_test_`

## Testing Payments Locally

1. **Start Netlify Dev**:
```bash
npm run dev:netlify
```

2. **Open the app**: `http://localhost:8888`

3. **Navigate to Subscription page**: `/subscription`

4. **Click "Upgrade to Pro" or "Get Lifetime Access"**

5. **Use Razorpay test card**:
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

## Troubleshooting

### Error: "Failed to execute 'json' on 'Response': Unexpected end of JSON input"

**Cause**: Netlify Functions aren't running locally.

**Solution**: 
- Use `npm run dev:netlify` instead of `npm run dev`
- Or deploy to Netlify and test there

### Error: "Payment gateway not configured"

**Cause**: Environment variables not set.

**Solution**:
- Create `.env` file with `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- Restart the dev server

### Error: "Cannot find module '@netlify/functions'"

**Cause**: Dependencies not installed.

**Solution**:
```bash
npm install
```

### Functions not loading

**Cause**: Netlify CLI not installed or wrong command.

**Solution**:
```bash
npm install -g netlify-cli
# Or use local version
npm install
npm run dev:netlify
```

## Port Configuration

- **Vite only**: `http://localhost:3000` (default)
- **Netlify Dev**: `http://localhost:8888` (default)

You can change ports in:
- `vite.config.ts` for Vite port
- `netlify.toml` for Netlify Dev port

## Next Steps

1. ✅ Set up `.env` file with test keys
2. ✅ Run `npm run dev:netlify`
3. ✅ Test payment flow
4. ✅ Verify profile updates in Supabase
5. ✅ Deploy to Netlify for production testing

