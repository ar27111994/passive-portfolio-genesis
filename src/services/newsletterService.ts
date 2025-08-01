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
  public async subscribe(email: string, name?: string, interests: string[] = []): Promise<void> {
    if (!email) {
      throw new Error('Email is required.');
    }

    const { data: existingSubscriber, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: 'exact one row not found'
        throw new Error(fetchError.message);
    }

    if (existingSubscriber && existingSubscriber.status === 'active') {
      throw new Error('You are already subscribed.');
    }

    const { error: upsertError } = await supabase
        .from('newsletter_subscribers')
        .upsert({
            email,
            name,
            interests,
            status: 'active',
            source: 'Website',
        }, { onConflict: 'email' });

    if (upsertError) {
      throw new Error(upsertError.message);
    }
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
