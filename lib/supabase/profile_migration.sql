-- Migration: Add shop/business fields to user_profiles table
-- Run this in Supabase SQL Editor

-- Add new columns to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS shop_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS shop_address TEXT,
ADD COLUMN IF NOT EXISTS shop_email VARCHAR(255);

-- Update the role check constraint to include 'max'
ALTER TABLE user_profiles
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

ALTER TABLE user_profiles
ADD CONSTRAINT user_profiles_role_check CHECK (role IN ('free', 'pro', 'max'));

-- Add subscription_type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_type'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_type VARCHAR(50) DEFAULT 'free';
  END IF;
END $$;

-- Add country if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'country'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN country VARCHAR(2) DEFAULT 'IN';
  END IF;
END $$;

-- Add currency if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'currency'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN currency VARCHAR(3) DEFAULT 'INR';
  END IF;
END $$;

