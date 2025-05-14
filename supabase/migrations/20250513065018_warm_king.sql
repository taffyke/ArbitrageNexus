/*
  # Authentication and API Key Management Schema

  1. New Tables
    - `user_profiles`
      - Extends default Supabase auth.users
      - Stores additional user information
      - Links to auth.users via foreign key
    
    - `exchange_api_keys`
      - Stores encrypted exchange API credentials
      - Links to auth.users via foreign key
      - Includes audit and status tracking
    
    - `user_preferences`
      - Stores user settings and preferences
      - Links to auth.users via foreign key
      - Includes UI, notification, and trading preferences
    
    - `api_key_audit_logs`
      - Tracks API key usage and modifications
      - Links to exchange_api_keys via foreign key

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access control
    - Implement encryption for sensitive data
    
  3. Functions
    - Add helper functions for encryption/decryption
    - Add trigger functions for audit logging
*/

-- Create encryption helper functions
CREATE OR REPLACE FUNCTION encrypt_api_key(key_data text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN encode(
    pgp_sym_encrypt(
      key_data::text,
      encryption_key,
      'cipher-algo=aes256'
    )::bytea,
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_api_key(encrypted_data text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(encrypted_data, 'base64')::bytea,
    encryption_key
  )::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  phone_number text,
  country text,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  api_usage_limit integer DEFAULT 1000,
  api_usage_count integer DEFAULT 0,
  two_factor_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create exchange_api_keys table
CREATE TABLE IF NOT EXISTS exchange_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exchange_name text NOT NULL,
  api_key text NOT NULL,
  api_secret text NOT NULL,
  description text,
  permissions text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  rotation_due_at timestamptz DEFAULT (now() + interval '90 days'),
  UNIQUE(user_id, exchange_name)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme text DEFAULT 'dark',
  color_scheme text DEFAULT 'blue',
  notification_settings jsonb DEFAULT '{
    "email": true,
    "push": false,
    "arbitrage_alerts": true,
    "security_alerts": true
  }'::jsonb,
  trading_pairs text[] DEFAULT '{}',
  dashboard_layout jsonb DEFAULT '{}',
  alert_thresholds jsonb DEFAULT '{
    "min_profit_percentage": 0.5,
    "max_slippage": 1.0
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create api_key_audit_logs table
CREATE TABLE IF NOT EXISTS api_key_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES exchange_api_keys(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'used', 'rotated')),
  ip_address inet,
  user_agent text,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for exchange_api_keys
CREATE POLICY "Users can view own API keys"
  ON exchange_api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create API keys"
  ON exchange_api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON exchange_api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON exchange_api_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for api_key_audit_logs
CREATE POLICY "Users can view own API key audit logs"
  ON api_key_audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exchange_api_keys
      WHERE exchange_api_keys.id = api_key_audit_logs.api_key_id
      AND exchange_api_keys.user_id = auth.uid()
    )
  );

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_exchange_api_keys_updated_at
  BEFORE UPDATE ON exchange_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create trigger for API key audit logging
CREATE OR REPLACE FUNCTION log_api_key_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO api_key_audit_logs (api_key_id, action, details)
    VALUES (NEW.id, 'created', jsonb_build_object('exchange', NEW.exchange_name));
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.api_key != NEW.api_key OR OLD.api_secret != NEW.api_secret THEN
      INSERT INTO api_key_audit_logs (api_key_id, action, details)
      VALUES (NEW.id, 'rotated', jsonb_build_object('exchange', NEW.exchange_name));
    ELSE
      INSERT INTO api_key_audit_logs (api_key_id, action, details)
      VALUES (NEW.id, 'updated', jsonb_build_object(
        'exchange', NEW.exchange_name,
        'changes', jsonb_build_object(
          'is_active', NEW.is_active != OLD.is_active,
          'permissions', NEW.permissions != OLD.permissions
        )
      ));
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO api_key_audit_logs (api_key_id, action, details)
    VALUES (OLD.id, 'deleted', jsonb_build_object('exchange', OLD.exchange_name));
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_api_key_changes
  AFTER INSERT OR UPDATE OR DELETE ON exchange_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION log_api_key_changes();