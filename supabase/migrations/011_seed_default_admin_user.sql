-- Note: You will need to replace 'YOUR_INSTANCE_ID' with your actual Supabase instance ID.
-- You can find this in your Supabase project's settings.

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_token, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token_encrypted)
VALUES
('YOUR_INSTANCE_ID', 'a6c2c26c-223a-446a-9a3d-5d9333f5b0f5', 'authenticated', 'authenticated', 'admin@example.com', crypt('password', gen_salt('bf')), NOW(), NULL, NULL, NULL, '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW(), NULL, '', '', NULL);

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
('a6c2c26c-223a-446a-9a3d-5d9333f5b0f5', 'a6c2c26c-223a-446a-9a3d-5d9333f5b0f5', '{"sub":"a6c2c26c-223a-446a-9a3d-5d9333f5b0f5","email":"admin@example.com"}', 'email', NOW(), NOW(), NOW());
