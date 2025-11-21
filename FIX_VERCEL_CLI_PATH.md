# Fix Vercel CLI PATH Issue on Windows

If you installed Vercel CLI globally but PowerShell can't find it, here are solutions:

## Solution 1: Use npx (Recommended - No PATH changes needed)

Instead of `vercel dev`, use:
```bash
npx vercel dev --yes
```

Or use the npm script:
```bash
npm run dev:vercel
```

## Solution 2: Fix PATH in PowerShell

1. **Find your npm global bin directory:**
```powershell
npm config get prefix
```

2. **Add it to your PATH:**
   - Open System Properties → Environment Variables
   - Edit "Path" in User variables
   - Add: `C:\Users\YourUsername\AppData\Roaming\npm` (or wherever npm installs global packages)
   - Click OK

3. **Restart PowerShell** for changes to take effect

## Solution 3: Use npm script (Easiest)

We've added a script to `package.json`. Just run:
```bash
npm run dev:vercel
```

This uses `npx` internally, so it doesn't require PATH changes.

## Verify Installation

Check if Vercel CLI is installed:
```bash
npx vercel --version
```

If it shows a version number, you're good to go!

