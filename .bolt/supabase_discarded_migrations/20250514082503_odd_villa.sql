/*
  # API Key Management Schema

  1. New Tables
    - `exchange_api_keys`
      - Stores encrypted exchange API credentials
      - Links to auth.users via foreign key
      - Includes audit and status tracking
    
    - `api_key_audit_logs`
      - Tracks API key usage and modifications
      - Links to exchange_api_keys via foreign key

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access control
    - Implement audit logging
*/

-- Create exchange_api_keys table
CREATE TABLE IF NOT EXISTS exchange_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create audit logs table
CREATE TABLE IF NOT EXISTS api_key_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid NOT NULL REFERENCES exchange_api_keys(id) ON DELETE CASCADE,
  action text NOT NULL,
  ip_address inet,
  user_agent text,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Add action type constraint
ALTER TABLE api_key_audit_logs
ADD CONSTRAINT api_key_audit_logs_action_check
CHECK (action = ANY(ARRAY['created', 'updated', 'deleted', 'used', 'rotated']));

-- Enable RLS
ALTER TABLE exchange_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for exchange_api_keys
CREATE POLICY "Users can create API keys"
  ON exchange_api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own API keys"
  ON exchange_api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

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

-- Create policies for audit logs
CREATE POLICY "Users can view own API key audit logs"
  ON api_key_audit_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM exchange_api_keys
    WHERE exchange_api_keys.id = api_key_audit_logs.api_key_id
    AND exchange_api_keys.user_id = auth.uid()
  ));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create API key changes logging function
CREATE OR REPLACE FUNCTION log_api_key_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO api_key_audit_logs (api_key_id, action, details)
    VALUES (NEW.id, 'created', jsonb_build_object('exchange', NEW.exchange_name));
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.api_key != OLD.api_key OR NEW.api_secret != OLD.api_secret THEN
      INSERT INTO api_key_audit_logs (api_key_id, action, details)
      VALUES (NEW.id, 'rotated', jsonb_build_object(
        'exchange', NEW.exchange_name,
        'rotation_due', NEW.rotation_due_at
      ));
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

-- Create triggers
CREATE TRIGGER update_exchange_api_keys_updated_at
  BEFORE UPDATE ON exchange_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER log_api_key_changes
  AFTER INSERT OR UPDATE OR DELETE ON exchange_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION log_api_key_changes();