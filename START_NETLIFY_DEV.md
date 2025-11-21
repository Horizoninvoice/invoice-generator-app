# How to Start Netlify Dev Successfully

## Quick Start Guide

### Step 1: Open Terminal in Project Root

Make sure you're in the correct directory:
```bash
cd C:\Users\saghe\OneDrive\Desktop\GUVI\invoice
```

### Step 2: Check if Port 8888 is Free

If port 8888 is already in use, you'll get connection refused. Check:
```bash
netstat -ano | findstr :8888
```

If something is using it, either:
- Kill that process, OR
- Change the port in `netlify.toml` to something else (like 3001)

### Step 3: Run Netlify Dev

Run this command:
```bash
npm run dev:netlify
```

**OR** use npx directly:
```bash
npx netlify dev
```

### Step 4: What to Expect

You should see output like:
```
◈ Netlify Dev ◈
◈ Ignored general context env var: NODE_VERSION
◈ Starting Netlify Dev with Vite
◈ Functions server is listening on 8888
◈ Server now ready on http://localhost:8888
```

### Step 5: If It Doesn't Start

**Option A: Use Different Port**

Edit `netlify.toml` and change:
```toml
[dev]
  port = 3001  # Change from 8888 to 3001
```

Then run:
```bash
npm run dev:netlify
```

Access at: `http://localhost:3001`

**Option B: Run Vite Only (No Payments)**

If Netlify Dev won't start, you can still test the frontend:
```bash
npm run dev
```

This runs on `http://localhost:3000` but payment functions won't work.

**Option C: Deploy to Netlify**

The easiest way to test payments is to deploy to Netlify:
1. Push code to GitHub
2. Connect to Netlify
3. Deploy
4. Test payments on the live site

## Common Error Messages

### "Port 8888 already in use"
- Solution: Change port in `netlify.toml` or kill the process using port 8888

### "Command not found"
- Solution: Run `npm install` first, then try `npx netlify dev`

### "Functions not found"
- Solution: Make sure `netlify/functions/payment/` directory exists with `create.ts` and `verify.ts`

### "Environment variables not found"
- Solution: Create `.env` file in root directory (you already have this)

## Still Not Working?

Try running with debug mode to see detailed errors:
```bash
npx netlify dev --debug
```

This will show you exactly what's failing.

