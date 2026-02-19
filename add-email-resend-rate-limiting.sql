-- Email Resend Rate Limiting Table
-- Tracks all email verification resend attempts for security and abuse prevention

CREATE TABLE IF NOT EXISTS email_resend_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for efficient rate limit lookups
CREATE INDEX IF NOT EXISTS idx_email_resend_attempts_email_time 
  ON email_resend_attempts(email, attempted_at DESC);

-- Enable RLS
ALTER TABLE email_resend_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role (backend) can insert/read
DROP POLICY IF EXISTS email_resend_attempts_service_role ON email_resend_attempts;
CREATE POLICY email_resend_attempts_service_role
  ON email_resend_attempts
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Add helpful comments
COMMENT ON TABLE email_resend_attempts IS 'Tracks email verification resend attempts for rate limiting and abuse prevention';
COMMENT ON COLUMN email_resend_attempts.ip_address IS 'Optional: IP address for additional tracking';
COMMENT ON COLUMN email_resend_attempts.success IS 'Whether the resend was successful';
