CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS VOID AS $$
BEGIN
  -- Check if the user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@example.com') THEN
    -- Create the user
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES (gen_random_uuid(), 'authenticated', 'authenticated', 'admin@example.com', extensions.crypt('password', extensions.gen_salt('bf')), NOW(), NOW(), NOW());
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Call the function to create the admin user
SELECT create_admin_user();
