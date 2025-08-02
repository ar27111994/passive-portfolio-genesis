CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS VOID AS $$
DECLARE
  user_id UUID;
  has_admin_role BOOLEAN;
BEGIN
  -- Check if the user already exists
  SELECT id INTO user_id FROM auth.users WHERE email = 'admin@example.com';

  IF user_id IS NULL THEN
    -- Create the user
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES (gen_random_uuid(), 'authenticated', 'authenticated', 'admin@example.com', extensions.crypt('password', extensions.gen_salt('bf')), NOW(), NOW(), NOW())
    RETURNING id INTO user_id;
  END IF;

  -- Check if the user has the admin role
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_roles.user_id = create_admin_user.user_id AND role = 'admin'
  ) INTO has_admin_role;

  -- Assign the admin role if they don't have it
  IF NOT has_admin_role THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_id, 'admin');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Call the function to create the admin user
SELECT create_admin_user();
