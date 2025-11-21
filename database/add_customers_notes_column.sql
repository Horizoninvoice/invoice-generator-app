-- Add notes column to customers table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE customers
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN customers.notes IS 'Additional notes about the customer';

