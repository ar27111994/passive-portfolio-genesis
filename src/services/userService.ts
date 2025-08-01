import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

class UserService {
  async getAllUsers(): Promise<User[]> {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
      throw new Error(error.message);
    }
    return users || [];
  }

  async createUser(email: string, password: string):Promise<User> {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data.user;
  }
}

export const userService = new UserService();
