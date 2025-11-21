# Fix for Vercel Build Issues

## Problem

The build was failing with MIME type errors because JavaScript files were being served as HTML. This happens when the rewrite rules catch static assets.

## Solution

Updated `vercel.json` to:
1. **Exclude static assets** from rewrites (JS, CSS, images, fonts)
2. **Exclude API routes** from rewrites
3. **Only rewrite** non-file, non-API routes to `index.html`

## Changes Made

The `vercel.json` now has explicit rewrites that:
- First, serve static files directly (with extensions)
- Then, serve API routes directly
- Finally, rewrite everything else to `index.html` for SPA routing

## Removed Build Settings

Removed `buildCommand`, `outputDirectory`, `devCommand`, and `installCommand` from `vercel.json` because:
- Vercel **auto-detects** Vite projects
- These settings should be configured in Vercel Dashboard, not in `vercel.json`
- Having them in `vercel.json` can cause conflicts

## Next Steps

1. **Commit and push** the updated `vercel.json`:
   ```bash
   git add vercel.json
   git commit -m "Fix Vercel build configuration"
   git push origin main
   ```

2. **Redeploy** on Vercel - it should automatically trigger a new deployment

3. **Verify** the build succeeds and static assets load correctly

## If Issues Persist

If you still see the warning about `builds` in configuration:
- Check if there's an old `vercel.json` cached
- Clear Vercel build cache in project settings
- Ensure no other config files have build settings

