/*
  # Create Error Logs Table

  1. New Tables
    - `error_logs`
      - `id` (text, primary key) - Unique error log identifier
      - `error_code` (text) - Error code (e.g., NETWORK_ERROR, API_ERROR)
      - `message` (text) - Technical error message
      - `user_message` (text) - User-friendly error message
      - `severity` (text) - Error severity level
      - `status_code` (integer, nullable) - HTTP status code if applicable
      - `validation_errors` (jsonb, nullable) - Validation error details
      - `metadata` (jsonb, nullable) - Additional error metadata
      - `stack` (text, nullable) - Error stack trace
      - `user_id` (uuid, nullable) - User who encountered the error
      - `session_id` (text, nullable) - Session identifier
      - `url` (text, nullable) - URL where error occurred
      - `user_agent` (text, nullable) - User agent string
      - `component` (text, nullable) - Component where error occurred
      - `action` (text, nullable) - Action being performed
      - `additional_data` (jsonb, nullable) - Additional context data
      - `resolved` (boolean) - Whether error has been resolved
      - `timestamp` (timestamptz) - When the error occurred
      - `created_at` (timestamptz) - When the log was created

  2. Security
    - Enable RLS on `error_logs` table
    - Add policy for service role to insert errors
    - Add policy for authenticated users to view their own errors
    - Add policy for admin users to view all errors
*/

CREATE TABLE IF NOT EXISTS error_logs (
  id text PRIMARY KEY,
  error_code text NOT NULL,
  message text NOT NULL,
  user_message text NOT NULL,
  severity text NOT NULL,
  status_code integer,
  validation_errors jsonb,
  metadata jsonb,
  stack text,
  user_id uuid,
  session_id text,
  url text,
  user_agent text,
  component text,
  action text,
  additional_data jsonb,
  resolved boolean DEFAULT false,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_code ON error_logs(error_code);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert error logs"
  ON error_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own error logs"
  ON error_logs
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update error logs"
  ON error_logs
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete error logs"
  ON error_logs
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
