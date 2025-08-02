import { supabase } from '@/integrations/supabase/client';

export async function directFixAdminLogin(): Promise<{ success: boolean; message: string; details?: any }> {
  console.log('🔧 Direct admin login fix...');

  try {
    // Step 1: Test basic connection
    console.log('Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('user_roles')
      .select('user_id')
      .limit(0); // Just test connection, don't return any data

    if (testError) {
      return {
        success: false,
        message: 'Supabase connection failed',
        details: testError
      };
    }

    // Step 2: Check if user_roles table exists
    console.log('Checking user_roles table...');
    const { data: userRolesCheck, error: userRolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .limit(1);

    if (userRolesError && userRolesError.code === '42P01') {
      // Table doesn't exist - we need to create it via SQL
      return {
        success: false,
        message: 'user_roles table does not exist. You need to run the manual SQL setup in Supabase dashboard.',
        details: {
          error: userRolesError,
          sqlNeeded: true
        }
      };
    }

    console.log('user_roles table exists');

    // Step 3: Check if admin user already exists first
    console.log('Checking if admin user exists...');
    let adminUserId: string | null = null;

    // Try to sign in first to see if user exists
    const { data: existingSignIn, error: existingSignInError } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'password123'
    });

    if (existingSignIn?.user?.id) {
      // User exists and can login
      adminUserId = existingSignIn.user.id;
      console.log('Admin user already exists and can authenticate');
      await supabase.auth.signOut(); // Clean up
    } else if (existingSignInError?.message === 'Invalid login credentials') {
      // User doesn't exist or wrong password, try to create
      console.log('Admin user does not exist or wrong password, attempting to create...');

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'password123',
        options: {
          data: {
            role: 'admin'
          }
        }
      });

      if (signUpError) {
        // Sign up failed - likely due to project settings
        return {
          success: false,
          message: 'Cannot create admin user automatically. This is likely because:\n' +
                   '1. User signup is disabled in Supabase settings\n' +
                   '2. Email confirmation is required\n' +
                   '3. Admin privileges are needed\n\n' +
                   'Please create the user manually in Supabase Dashboard → Authentication → Users',
          details: {
            signUpError,
            needsManualCreation: true,
            instructions: 'Go to Supabase Dashboard → Authentication → Users → Add User'
          }
        };
      } else if (signUpData?.user?.id) {
        adminUserId = signUpData.user.id;
        console.log('Created new admin user successfully');
      } else {
        return {
          success: false,
          message: 'User creation returned no user data - please check Supabase project settings',
          details: { signUpData }
        };
      }
    } else {
      // Some other auth error
      return {
        success: false,
        message: 'Authentication error: ' + (existingSignInError?.message || 'Unknown error'),
        details: existingSignInError
      };
    }

    if (!adminUserId) {
      return {
        success: false,
        message: 'Could not obtain admin user ID'
      };
    }

    // Step 4: Assign admin role
    console.log('Assigning admin role...');
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: adminUserId,
        role: 'admin'
      }, {
        onConflict: 'user_id'
      });

    if (roleError) {
      return {
        success: false,
        message: 'Failed to assign admin role: ' + roleError.message,
        details: roleError
      };
    }

    // Step 5: Test final login
    console.log('Testing final login...');
    const { data: finalTest, error: finalError } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'password123'
    });

    if (finalError || !finalTest.user) {
      return {
        success: false,
        message: 'Setup completed but login test failed: ' + (finalError?.message || 'No user returned'),
        details: finalError
      };
    }

    // Test role check
    const { data: roleCheck, error: roleCheckError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', finalTest.user.id)
      .single();

    await supabase.auth.signOut(); // Clean up

    if (roleCheckError || roleCheck?.role !== 'admin') {
      return {
        success: false,
        message: 'Login works but role verification failed',
        details: { roleCheckError, roleCheck }
      };
    }

    return {
      success: true,
      message: 'Admin login fixed successfully! You can now login with admin@example.com / password123',
      details: {
        userId: adminUserId,
        role: 'admin'
      }
    };

  } catch (error) {
    return {
      success: false,
      message: 'Unexpected error: ' + (error as Error).message,
      details: error
    };
  }
}

export const getQuickSetupSQL = () => `
-- Quick setup SQL for Supabase Dashboard
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor
-- Copy and run this SQL:

-- 1. Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  role TEXT;
BEGIN
  SELECT r.role INTO role FROM public.user_roles r WHERE r.user_id = get_user_role.user_id;
  RETURN COALESCE(role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create policies
DROP POLICY IF EXISTS "Allow admin users to manage user roles" ON public.user_roles;
CREATE POLICY "Allow admin users to manage user roles" ON public.user_roles 
FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Users can read their own role" ON public.user_roles;
CREATE POLICY "Users can read their own role" ON public.user_roles 
FOR SELECT USING (auth.uid() = user_id);

-- 5. After running this SQL:
--    a) Go to Authentication → Users
--    b) Click "Add User"
--    c) Email: admin@example.com
--    d) Password: password123
--    e) Click "Create User"
--    f) Copy the user ID from the users list
--    g) Go to Table Editor → user_roles
--    h) Click "Insert" → "Insert row"
--    i) user_id: [paste the copied user ID]
--    j) role: admin
--    k) Click "Save"

-- Alternative: If you know the admin user ID, replace YOUR_ADMIN_USER_ID below:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('YOUR_ADMIN_USER_ID', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
`;
