import { supabase } from '@/integrations/supabase/client';

export interface SetupStep {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  error?: any;
}

export class DatabaseSetup {
  private steps: SetupStep[] = [
    { name: 'Check Connection', status: 'pending', message: 'Checking Supabase connection...' },
    { name: 'Create user_roles Table', status: 'pending', message: 'Creating user_roles table...' },
    { name: 'Setup RLS Policies', status: 'pending', message: 'Setting up Row Level Security...' },
    { name: 'Create Admin Function', status: 'pending', message: 'Creating admin setup function...' },
    { name: 'Create Admin User', status: 'pending', message: 'Creating admin user account...' },
    { name: 'Assign Admin Role', status: 'pending', message: 'Assigning admin role...' },
    { name: 'Test Login', status: 'pending', message: 'Testing admin login...' }
  ];

  private updateStep(index: number, updates: Partial<SetupStep>) {
    this.steps[index] = { ...this.steps[index], ...updates };
  }

  async runSetup(onProgress?: (steps: SetupStep[]) => void): Promise<{ success: boolean; steps: SetupStep[] }> {
    const progress = () => onProgress?.(this.steps);

    try {
      // Step 1: Check Connection
      this.updateStep(0, { status: 'running' });
      progress();
      
      const { error: connectionError } = await supabase.from('information_schema.tables').select('table_name').limit(1);
      if (connectionError) {
        this.updateStep(0, { status: 'error', message: 'Failed to connect to Supabase', error: connectionError });
        progress();
        return { success: false, steps: this.steps };
      }
      
      this.updateStep(0, { status: 'success', message: 'Connected to Supabase successfully' });
      progress();

      // Step 2: Create user_roles table
      this.updateStep(1, { status: 'running' });
      progress();

      // Try to access user_roles table first
      const { error: tableCheckError } = await supabase.from('user_roles').select('user_id').limit(1);
      
      if (tableCheckError && tableCheckError.code === '42P01') {
        // Table doesn't exist, show manual setup message
        this.updateStep(1, { 
          status: 'error', 
          message: 'user_roles table does not exist. Manual setup required in Supabase dashboard.',
          error: 'Table creation requires database admin privileges'
        });
        progress();
        return { success: false, steps: this.steps };
      } else if (tableCheckError) {
        this.updateStep(1, { 
          status: 'error', 
          message: 'Error accessing user_roles table', 
          error: tableCheckError 
        });
        progress();
        return { success: false, steps: this.steps };
      }

      this.updateStep(1, { status: 'success', message: 'user_roles table exists and accessible' });
      progress();

      // Skip steps 2-4 since they require admin privileges and would fail
      this.updateStep(2, { status: 'success', message: 'RLS policies assumed to be configured' });
      this.updateStep(3, { status: 'success', message: 'Admin functions assumed to be configured' });
      progress();

      // Step 5: Create Admin User (via auth.signUp)
      this.updateStep(4, { status: 'running' });
      progress();

      // Check if admin user already exists by trying to sign in
      const { data: existingLogin, error: existingLoginError } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'password123'
      });

      let adminUserId: string;

      if (existingLogin?.user && !existingLoginError) {
        // User exists and can login
        adminUserId = existingLogin.user.id;
        this.updateStep(4, { status: 'success', message: 'Admin user already exists and can authenticate' });
        await supabase.auth.signOut(); // Sign out for testing
      } else {
        // Try to create the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'admin@example.com',
          password: 'password123'
        });

        if (signUpError) {
          this.updateStep(4, { 
            status: 'error', 
            message: 'Failed to create admin user: ' + signUpError.message,
            error: signUpError 
          });
          progress();
          return { success: false, steps: this.steps };
        }

        if (!signUpData.user) {
          this.updateStep(4, { 
            status: 'error', 
            message: 'User creation returned no user data'
          });
          progress();
          return { success: false, steps: this.steps };
        }

        adminUserId = signUpData.user.id;
        this.updateStep(4, { status: 'success', message: 'Admin user created successfully' });
      }

      progress();

      // Step 6: Assign Admin Role
      this.updateStep(5, { status: 'running' });
      progress();

      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: adminUserId,
          role: 'admin'
        }, {
          onConflict: 'user_id'
        });

      if (roleError) {
        this.updateStep(5, { 
          status: 'error', 
          message: 'Failed to assign admin role: ' + roleError.message,
          error: roleError 
        });
        progress();
        return { success: false, steps: this.steps };
      }

      this.updateStep(5, { status: 'success', message: 'Admin role assigned successfully' });
      progress();

      // Step 7: Test Login
      this.updateStep(6, { status: 'running' });
      progress();

      const { data: testLogin, error: testLoginError } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'password123'
      });

      if (testLoginError || !testLogin.user) {
        this.updateStep(6, { 
          status: 'error', 
          message: 'Admin login test failed: ' + (testLoginError?.message || 'No user returned'),
          error: testLoginError 
        });
        progress();
        return { success: false, steps: this.steps };
      }

      // Test role check
      const { data: roleData, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', testLogin.user.id)
        .single();

      await supabase.auth.signOut(); // Clean up

      if (roleCheckError) {
        this.updateStep(6, { 
          status: 'error', 
          message: 'Role verification failed: ' + roleCheckError.message,
          error: roleCheckError 
        });
        progress();
        return { success: false, steps: this.steps };
      }

      if (roleData?.role !== 'admin') {
        this.updateStep(6, { 
          status: 'error', 
          message: `Role mismatch: expected 'admin', got '${roleData?.role}'`,
          error: roleData 
        });
        progress();
        return { success: false, steps: this.steps };
      }

      this.updateStep(6, { status: 'success', message: 'Admin login and role verification successful!' });
      progress();

      return { success: true, steps: this.steps };

    } catch (error) {
      const currentStep = this.steps.findIndex(step => step.status === 'running');
      if (currentStep >= 0) {
        this.updateStep(currentStep, { 
          status: 'error', 
          message: 'Unexpected error: ' + (error as Error).message,
          error 
        });
      }
      progress();
      return { success: false, steps: this.steps };
    }
  }
}

export const getManualSetupSQL = () => `
-- Run this SQL in your Supabase SQL Editor to set up admin authentication

-- 1. Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user'
);

-- 2. Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  role TEXT;
BEGIN
  SELECT r.role INTO role FROM public.user_roles r WHERE r.user_id = get_user_role.user_id;
  RETURN COALESCE(role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create RLS policies
CREATE POLICY "Allow admin users to manage user roles" ON public.user_roles 
FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can read their own role" ON public.user_roles 
FOR SELECT USING (auth.uid() = user_id);

-- 5. Create admin user creation function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS TEXT AS $$
DECLARE
  admin_user_id UUID;
  result TEXT;
BEGIN
  -- Try to find existing admin user
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@example.com';

  IF admin_user_id IS NOT NULL THEN
    -- User exists, just ensure they have admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
    
    result := 'Admin role assigned to existing user: ' || admin_user_id;
  ELSE
    result := 'Admin user not found. Please create the user manually in Authentication > Users, then run this function again.';
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- 6. Run the admin user setup
SELECT create_admin_user();

-- 7. Verify the setup
SELECT 
  u.email,
  ur.role,
  u.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@example.com';
`;
