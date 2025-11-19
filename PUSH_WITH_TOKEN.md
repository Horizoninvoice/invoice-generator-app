# Push with Personal Access Token

## Step 1: Create Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "Invoice App Deployment"
4. Select scope: `repo` (Full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

## Step 2: Push with Token

Run this command (replace YOUR_TOKEN with your actual token):

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/Horizoninvoice/invoice-generator-app.git
git push -u origin main
```

Or use your GitHub username with token:
```bash
git remote set-url origin https://sagheerahmed08:YOUR_TOKEN@github.com/Horizoninvoice/invoice-generator-app.git
git push -u origin main
```

## Alternative: Use SSH (if you have SSH keys set up)

```bash
git remote set-url origin git@github.com:Horizoninvoice/invoice-generator-app.git
git push -u origin main
```

