# Local Development Guide

## ⚠️ IMPORTANT: Fix Common Errors First

### Error: Supabase 400 - Missing `notes` Column

If you see `Failed to load resource: the server responded with a status of 400` errors:

**Run this SQL in Supabase SQL Editor:**
```sql
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS notes TEXT;
```

### Error: Vercel API Routes 404

If you see `/api/payment/create:1 Failed to load resource: the server responded with a status of 404`:

**You must use `vercel dev` for local development with API routes**

---

## Running the Application Locally

### Option 1: Using Vercel CLI (Recommended for Payment Testing)

This runs both the frontend and Vercel API routes locally.

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
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

3. **Run with Vercel Dev**:
```bash
npm run dev:vercel
```

Or directly:
```bash
npx vercel dev --yes
```

This will:
- Start Vite dev server on `http://localhost:3000`
- Run Vercel API routes locally
- Make payment endpoints available at `http://localhost:3000/api/payment/create`

### Option 2: Using Vite Only (Frontend Only)

If you just want to test the frontend without payments:

```bash
npm run dev
```

This runs on `http://localhost:3000` but payment API routes won't work.

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

1. **Start Vercel Dev**:
```bash
vercel dev
```

2. **Open the app**: `http://localhost:3000`

3. **Navigate to Subscription page**: `/subscription`

4. **Click "Upgrade to Pro" or "Get Lifetime Access"**

5. **Use Razorpay test card**:
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

## Troubleshooting

### Error: "Failed to execute 'json' on 'Response': Unexpected end of JSON input"

**Cause**: Vercel API routes aren't running locally.

**Solution**: 
- Use `vercel dev` instead of `npm run dev`
- Or deploy to Vercel and test there

### Error: "Payment gateway not configured"

**Cause**: Environment variables not set.

**Solution**:
- Create `.env` file with `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- Restart the dev server

### Error: "Cannot find module '@vercel/node'"

**Cause**: Dependencies not installed.

**Solution**:
```bash
npm install
```

### API Routes not loading

**Cause**: Vercel CLI not installed or wrong command.

**Solution**:
```bash
npm install -g vercel
# Or use local version
npm install
vercel dev
```

## Port Configuration

- **Vite only**: `http://localhost:3000` (default)
- **Vercel Dev**: `http://localhost:3000` (default)

You can change ports in:
- `vite.config.ts` for Vite port
- Vercel will use the same port as Vite

## Next Steps

1. ✅ Set up `.env` file with test keys
2. ✅ Run `vercel dev`
3. ✅ Test payment flow
4. ✅ Verify profile updates in Supabase
5. ✅ Deploy to Vercel for production testing
