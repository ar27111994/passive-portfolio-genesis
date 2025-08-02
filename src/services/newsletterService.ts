import { supabase } from '@/integrations/supabase/client';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  interests: string[];
  subscribe_date: string;
  status: 'active' | 'unsubscribed';
  source: string;
}

class NewsletterService {
  public async subscribe(email: string, name?: string, interests: string[] = []): Promise<{ success: boolean; message: string; data?: any }> {
    if (!email) {
      return { success: false, message: 'Email is required.' };
    }

    const { data, error } = await supabase.rpc('subscribe_to_newsletter', {
      user_email: email,
      user_name: name,
      user_interests: interests,
    });

    if (error) {
      return { success: false, message: 'An unexpected error occurred.' };
    }

    return data;
  }

  public async getAllSubscribers(): Promise<NewsletterSubscriber[]> {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
}

export const newsletterService = new NewsletterService();
