# Quick Fix for Current Errors

## Error 1: Supabase 400 Error - Missing `notes` Column

The error `Failed to load resource: the server responded with a status of 400` is because the `notes` column doesn't exist in your `customers` table.

### Solution: Add the `notes` column to your Supabase database

1. Go to your **Supabase Dashboard**
2. Click on **SQL Editor**
3. Run this SQL:

```sql
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS notes TEXT;
```

4. Click **Run** to execute

This will add the `notes` column and fix the 400 errors.

---

## Error 2: Vercel API Routes 404 Error

The error `/api/payment/create:1 Failed to load resource: the server responded with a status of 404` means Vercel API routes aren't running.

### Solution: Use Vercel CLI for local development

**Stop your current dev server** (if running) and use:

```bash
vercel dev
```

This will:
- Start Vite dev server
- Run Vercel API routes locally
- Make payment endpoints available

**Access the app at:** `http://localhost:3000`

---

## Quick Checklist

- [ ] Run the SQL migration to add `notes` column
- [ ] Stop `npm run dev` if running
- [ ] Run `vercel dev` instead
- [ ] Access app at `http://localhost:3000`
- [ ] Test payment flow

---

## If SQL Migration Doesn't Work

If you can't access Supabase SQL Editor, you can also add the column via Table Editor:

1. Go to **Supabase Dashboard** → **Table Editor**
2. Select `customers` table
3. Click **Add Column**
4. Name: `notes`
5. Type: `text`
6. Default: `NULL`
7. Click **Save**
