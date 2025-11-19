# Push to GitHub - Quick Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `invoice-generator-app` (or any name you prefer)
3. **DO NOT** check "Initialize this repository with a README"
4. Click "Create repository"

## Step 2: Push Your Code

Run these commands in your terminal (replace YOUR_USERNAME with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/invoice-generator-app.git
git branch -M main
git push -u origin main
```

If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Select your repository
5. Add environment variables (see DEPLOYMENT.md)
6. Click "Deploy"

Your app will be live at: `https://your-app-name.vercel.app`

