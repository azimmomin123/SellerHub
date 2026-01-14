-- Run this SQL in your Supabase Dashboard SQL Editor
-- Go to: https://supabase.com/dashboard/project/_/sql

-- Create table for storing user's Amazon SP-API credentials
-- Credentials are encrypted before storing
CREATE TABLE IF NOT EXISTS amazon_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id TEXT NOT NULL,
  marketplace_id TEXT NOT NULL DEFAULT 'ATVPDKIKX0DER', -- Default: US
  aws_access_key_id TEXT NOT NULL,
  aws_secret_key TEXT NOT NULL,
  role_arn TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_amazon_credentials_user_id ON amazon_credentials(user_id);

-- Enable Row Level Security
ALTER TABLE amazon_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own credentials
CREATE POLICY "Users can view own credentials"
  ON amazon_credentials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credentials"
  ON amazon_credentials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credentials"
  ON amazon_credentials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own credentials"
  ON amazon_credentials FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_amazon_credentials_updated_at
  BEFORE UPDATE ON amazon_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Common Marketplace IDs:
-- US: ATVPDKIKX0DER
-- CA: A2EUQ1WTGCTBG2
-- MX: A1AM78C64UM0Y8
-- UK: A1F83G8C2ARO7P
-- DE: A1PA6795UKMFR9
-- FR: A13V1IB3VIYZZH
-- IT: APJ6JRA9NG5A4
-- ES: A1RKKUPIHCS9HS
-- JP: A1VC38T7YXB5NI
-- AU: A39IBJ37TRQ1SH
-- IN: A21TJRUUN4KFC
