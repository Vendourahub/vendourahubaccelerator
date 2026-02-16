-- Create Admin User Record for admin@vendoura.com
-- User ID from Supabase Authentication

INSERT INTO admin_users (user_id, email, name, admin_role)
VALUES (
  'ce0f9402-b82d-40b9-9891-ab42976f8f06',
  'admin@vendoura.com',
  'Emmanuel',
  'super_admin'
);
