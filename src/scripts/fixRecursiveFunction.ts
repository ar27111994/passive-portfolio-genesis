import { supabase } from '@/integrations/supabase/client';

export async function fixRecursiveFunction(): Promise<{ success: boolean; message: string }> {
  console.log('🔧 Fixing recursive function issue...');

  const fixSQL = `
-- Fix the recursive function bug in get_user_role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  role TEXT;
BEGIN
  -- Fix: Use the parameter user_id directly, not get_user_role.user_id
  SELECT r.role INTO role FROM public.user_roles r WHERE r.user_id = $1;
  RETURN COALESCE(role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

  try {
    const { error } = await supabase.rpc('exec', { query: fixSQL });
    
    if (error) {
      return {
        success: false,
        message: 'Failed to fix function via RPC. Please run the SQL manually in Supabase Dashboard.'
      };
    }

    return {
      success: true,
      message: 'Recursive function fixed successfully!'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error occurred while fixing function: ' + (error as Error).message
    };
  }
}

export const getFixSQL = () => `
-- Run this SQL in Supabase Dashboard → SQL Editor to fix the recursive function:

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  role TEXT;
BEGIN
  -- Fix: Use the parameter user_id directly, not get_user_role.user_id  
  SELECT r.role INTO role FROM public.user_roles r WHERE r.user_id = $1;
  RETURN COALESCE(role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the function (should return 'admin' for the admin user):
-- SELECT public.get_user_role('440b86e4-5d0c-4584-9e94-f0325af3cad3');
`;
