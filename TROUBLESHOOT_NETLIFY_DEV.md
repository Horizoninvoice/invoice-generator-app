# Troubleshooting Netlify Dev Connection Issues

## Error: ERR_CONNECTION_REFUSED on localhost:8888

If you're getting "This site can't be reached" or "ERR_CONNECTION_REFUSED" when trying to access `localhost:8888`, follow these steps:

### Step 1: Check if Netlify CLI is Installed

Run:
```bash
npx netlify --version
```

If it's not installed or shows an error, install it:
```bash
npm install -g netlify-cli
```

Or use the local version:
```bash
npm install
```

### Step 2: Check if Port 8888 is Already in Use

Check if something else is using port 8888:
```bash
# On Windows PowerShell
netstat -ano | findstr :8888

# On Mac/Linux
lsof -i :8888
```

If port 8888 is in use, you can change it in `netlify.toml`:
```toml
[dev]
  port = 3001  # Change to any available port
```

### Step 3: Verify Your .env File Exists

Make sure you have a `.env` file in the root directory with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 4: Run Netlify Dev with Verbose Output

Run with debug mode to see what's happening:
```bash
npx netlify dev --debug
```

This will show detailed logs of what's happening.

### Step 5: Alternative - Run Vite and Functions Separately

If `netlify dev` doesn't work, you can run them separately:

**Terminal 1 - Start Vite:**
```bash
npm run dev
```
This runs on `http://localhost:3000`

**Terminal 2 - Start Netlify Functions (if you have a separate server):**
For now, you'll need to deploy to Netlify to test payments, or use `netlify dev`.

### Step 6: Check Netlify Functions Directory

Make sure your functions exist:
```bash
ls netlify/functions/payment/
```

You should see:
- `create.ts`
- `verify.ts`

### Step 7: Common Issues

**Issue: "Command not found: netlify"**
- Solution: Install Netlify CLI globally: `npm install -g netlify-cli`
- Or use: `npx netlify dev` instead

**Issue: "Port already in use"**
- Solution: Change port in `netlify.toml` or kill the process using port 8888

**Issue: "Functions not found"**
- Solution: Make sure `netlify/functions` directory exists and contains your functions

**Issue: "Environment variables not loaded"**
- Solution: Create `.env` file in root directory (not in `src` or `netlify`)

### Step 8: Quick Test

Try this minimal test:
```bash
# 1. Make sure you're in the project root
cd C:\Users\saghe\OneDrive\Desktop\GUVI\invoice

# 2. Check if .env exists
dir .env

# 3. Run netlify dev
npx netlify dev
```

### Step 9: If Nothing Works - Deploy to Netlify

If local development isn't working, you can:
1. Push your code to GitHub
2. Deploy to Netlify
3. Test payments on the deployed site

The payment functions will work on Netlify even if they don't work locally.

## Still Having Issues?

1. Check the terminal output when running `npm run dev:netlify`
2. Look for error messages
3. Make sure all dependencies are installed: `npm install`
4. Try deleting `node_modules` and reinstalling: `rm -rf node_modules && npm install`

