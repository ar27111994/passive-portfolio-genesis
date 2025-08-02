import { supabase } from '@/integrations/supabase/client';

interface AdminSetupResult {
  success: boolean;
  message: string;
  details?: any;
}

export async function createAdminUser(): Promise<AdminSetupResult> {
  console.log('🔐 Setting up admin user...');

  try {
    // First, let's check if the user_roles table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'user_roles');

    if (tablesError) {
      return {
        success: false,
        message: 'Failed to check database structure',
        details: tablesError
      };
    }

    // Create user_roles table if it doesn't exist
    if (!tables || tables.length === 0) {
      console.log('📋 Creating user_roles table...');
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.user_roles (
          user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          role TEXT NOT NULL DEFAULT 'user'
        );
        
        -- Enable RLS
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
        
        -- Create admin check function
        CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
        RETURNS TEXT AS $$
        DECLARE
          role TEXT;
        BEGIN
          SELECT r.role INTO role FROM public.user_roles r WHERE r.user_id = get_user_role.user_id;
          RETURN COALESCE(role, 'user');
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Create policy for user_roles table
        CREATE POLICY "Allow admin users to manage user roles" ON public.user_roles 
        FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');
        
        -- Allow users to read their own role
        CREATE POLICY "Users can read their own role" ON public.user_roles 
        FOR SELECT USING (auth.uid() = user_id);
      `;

      // Execute table creation (this may fail if permissions don't allow DDL)
      const { error: createError } = await supabase.rpc('exec', {
        query: createTableSQL
      });

      if (createError) {
        console.warn('Table creation via RPC failed, this is expected for security reasons');
        console.log('You need to run the migrations manually in Supabase SQL Editor');
      }
    }

    // Try to create the admin user via Supabase Auth
    console.log('👤 Creating admin user account...');
    
    // First try to sign up the admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'password123',
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    let adminUserId: string | null = null;

    if (signUpError) {
      // User might already exist, try to get the user ID
      console.log('User might already exist, checking...');
      
      // Try to sign in to see if user exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'password123'
      });

      if (signInData?.user?.id) {
        adminUserId = signInData.user.id;
        console.log('✅ Admin user already exists and credentials work');
      } else {
        return {
          success: false,
          message: 'Failed to create or verify admin user account',
          details: { signUpError, signInError }
        };
      }
    } else if (signUpData?.user?.id) {
      adminUserId = signUpData.user.id;
      console.log('✅ Admin user account created successfully');
    }

    if (!adminUserId) {
      return {
        success: false,
        message: 'Could not obtain admin user ID'
      };
    }

    // Now try to assign admin role
    console.log('🎯 Assigning admin role...');
    
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: adminUserId,
        role: 'admin'
      }, {
        onConflict: 'user_id'
      });

    if (roleError) {
      console.warn('Failed to assign role via table insert:', roleError.message);
      
      // Try alternative method - direct SQL if available
      const { error: sqlError } = await supabase.rpc('exec', {
        query: `
          INSERT INTO public.user_roles (user_id, role) 
          VALUES ('${adminUserId}', 'admin') 
          ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
        `
      });

      if (sqlError) {
        return {
          success: false,
          message: 'Failed to assign admin role to user',
          details: { roleError, sqlError }
        };
      }
    }

    console.log('✅ Admin role assigned successfully');

    // Test the setup
    console.log('🧪 Testing admin authentication...');
    
    const { data: testAuth, error: testError } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'password123'
    });

    if (testError || !testAuth.user) {
      return {
        success: false,
        message: 'Admin user created but authentication test failed',
        details: testError
      };
    }

    // Test role retrieval
    const { data: roleData, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', testAuth.user.id)
      .single();

    if (roleCheckError || roleData?.role !== 'admin') {
      return {
        success: false,
        message: 'Admin user authenticated but role check failed',
        details: { roleCheckError, roleData }
      };
    }

    console.log('🎉 Admin setup completed successfully!');

    return {
      success: true,
      message: 'Admin user setup completed successfully',
      details: {
        userId: adminUserId,
        email: 'admin@example.com',
        role: 'admin'
      }
    };

  } catch (error) {
    console.error('❌ Admin setup failed:', error);
    return {
      success: false,
      message: 'Unexpected error during admin setup',
      details: error
    };
  }
}

export async function manualAdminSetupInstructions(): Promise<string> {
  return `
🔧 Manual Admin Setup Instructions

If the automatic setup failed, follow these steps in your Supabase dashboard:

1. Go to https://supabase.com/dashboard
2. Select your project: mrhdiilrbvrwwwhdocnr
3. Navigate to SQL Editor

4. Run this SQL to create the user_roles table and admin user:

\`\`\`sql
-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user'
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create admin check function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  role TEXT;
BEGIN
  SELECT r.role INTO role FROM public.user_roles r WHERE r.user_id = get_user_role.user_id;
  RETURN COALESCE(role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies
CREATE POLICY "Allow admin users to manage user roles" ON public.user_roles 
FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can read their own role" ON public.user_roles 
FOR SELECT USING (auth.uid() = user_id);

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS VOID AS $$
DECLARE
  admin_user_id UUID;
  has_admin_role BOOLEAN;
BEGIN
  -- Check if the user already exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@example.com';

  IF admin_user_id IS NULL THEN
    -- Create the user (this requires auth.users write access)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      invited_at,
      confirmation_token,
      confirmation_sent_at,
      recovery_token,
      recovery_sent_at,
      email_change_token_new,
      email_change,
      email_change_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('password123', gen_salt('bf')),
      NOW(),
      NULL,
      '',
      NULL,
      '',
      NULL,
      '',
      '',
      NULL,
      NULL,
      '{"provider":"email","providers":["email"]}',
      '{}',
      FALSE,
      NOW(),
      NOW()
    )
    RETURNING id INTO admin_user_id;
  END IF;

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Execute the function
SELECT create_admin_user();
\`\`\`

5. After running the SQL, test the login with:
   - Email: admin@example.com
   - Password: password123

If you still have issues, you can also create the user manually:

1. Go to Authentication > Users in Supabase dashboard
2. Click "Add user" 
3. Email: admin@example.com
4. Password: password123
5. Then go to Table Editor > user_roles
6. Add a row with the user's ID and role 'admin'
`;
}
