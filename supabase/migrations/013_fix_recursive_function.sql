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
