# Supabase Storage Setup for Logo Uploads

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name it: `user-uploads`
5. Make it **Public** (uncheck "Private bucket")
6. Click **Create bucket**

## Step 2: Set Up Storage Policies

Run this SQL in your Supabase SQL Editor:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload their own logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = 'logos');

-- Allow authenticated users to view all logos
CREATE POLICY "Users can view logos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'user-uploads');

-- Allow users to update their own logos
CREATE POLICY "Users can update their own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = 'logos');

-- Allow users to delete their own logos
CREATE POLICY "Users can delete their own logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = 'logos');
```

## Step 3: Run Database Migration

Run the SQL from `lib/supabase/profile_migration.sql` in your Supabase SQL Editor to add the new profile fields.

## Step 4: Test

1. Go to your profile page
2. Try uploading a logo
3. Fill in shop details
4. Select a country and verify currency auto-updates

That's it! Your logo upload feature should now work.

