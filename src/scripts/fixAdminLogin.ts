import { supabase } from '@/integrations/supabase/client';

export async function directFixAdminLogin(): Promise<{ success: boolean; message: string; details?: any }> {
  console.log('🔧 Direct admin login fix...');

  try {
    // Step 1: Test basic connection
    console.log('Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('information_schema.columns')
      .select('table_name')
      .eq('table_name', 'user_roles')
      .limit(1);

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

    // Step 3: Try to sign up admin user first
    console.log('Creating admin user...');
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

    if (signUpError && signUpError.message.includes('already been registered')) {
      // User exists, try to get their ID by signing in
      console.log('User exists, getting user ID...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'password123'
      });

      if (signInData?.user?.id) {
        adminUserId = signInData.user.id;
        console.log('Found existing admin user');
        await supabase.auth.signOut(); // Clean up
      } else if (signInError) {
        // User exists but wrong password - we need to reset or use different method
        console.log('User exists but login failed:', signInError.message);
        
        // Try to get user info from auth admin (this might fail due to permissions)
        try {
          const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
          if (usersData?.users) {
            const adminUser = usersData.users.find(user => user.email === 'admin@example.com');
            if (adminUser) {
              adminUserId = adminUser.id;
              console.log('Found admin user via admin API');
            }
          }
        } catch (adminError) {
          console.warn('Could not access admin API:', adminError);
        }

        if (!adminUserId) {
          return {
            success: false,
            message: 'Admin user exists but password is incorrect. Reset password in Supabase dashboard or use different credentials.',
            details: { signInError }
          };
        }
      }
    } else if (signUpError) {
      return {
        success: false,
        message: 'Failed to create admin user: ' + signUpError.message,
        details: signUpError
      };
    } else if (signUpData?.user?.id) {
      adminUserId = signUpData.user.id;
      console.log('Created new admin user');
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
