# Fix for MIME Type Errors on Vercel

## Problem
JavaScript files are being served as HTML, causing MIME type errors:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"
```

## Root Cause
Vercel's rewrite rule was catching static assets (JS, CSS files) and serving them as HTML instead of the actual files.

## Solution Applied

### 1. Updated `vite.config.ts`
Added `base: '/'` to ensure all asset paths are absolute:
```typescript
export default defineConfig({
  base: '/',
  // ... rest of config
})
```

### 2. Updated `vercel.json`
Changed the rewrite pattern to explicitly exclude:
- Files with extensions (`.js`, `.css`, `.png`, etc.)
- The `/api/` directory
- The `/assets/` directory

```json
{
  "rewrites": [
    {
      "source": "/((?!api|assets|.*\\..*).*)",
      "destination": "/index.html"
    }
  ]
}
```

This pattern uses a negative lookahead to exclude:
- `api` - API routes
- `assets` - Assets directory
- `.*\\..*` - Any file with an extension (static files)

## How It Works

1. **Static files** (with extensions like `.js`, `.css`, `.png`) are automatically served by Vercel
2. **API routes** (`/api/*`) are handled by serverless functions
3. **All other routes** are rewritten to `/index.html` for SPA routing

## Next Steps

1. **Commit the changes**:
   ```bash
   git add vite.config.ts vercel.json
   git commit -m "Fix MIME type errors - exclude static assets from rewrites"
   git push origin main
   ```

2. **Vercel will automatically redeploy**

3. **Verify the fix**:
   - Check that JavaScript files load correctly
   - Verify no MIME type errors in browser console
   - Test that SPA routing still works

## If Issues Persist

1. **Clear Vercel build cache**:
   - Go to Project Settings → Build & Development Settings
   - Click "Clear Build Cache"

2. **Check build output**:
   - Verify `dist/assets/` contains JavaScript files
   - Check that `dist/index.html` references assets correctly

3. **Verify file paths**:
   - All asset paths in `index.html` should start with `/` (absolute paths)
   - Example: `/assets/index-xxx.js` not `assets/index-xxx.js`

