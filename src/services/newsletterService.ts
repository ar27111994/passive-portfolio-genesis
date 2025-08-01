export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  interests: string[];
  subscribeDate: string;
  status: 'active' | 'unsubscribed';
  source: string;
}

class NewsletterService {
  private static readonly STORAGE_KEY = 'newsletterSubscribers';

  public async subscribe(email: string, name?: string, interests: string[] = []): Promise<void> {
    if (!email) {
      throw new Error('Email is required.');
    }

    const subscribers = this.getAllSubscribers();
    const existingSubscriber = subscribers.find(sub => sub.email === email);

    if (existingSubscriber && existingSubscriber.status === 'active') {
      throw new Error('You are already subscribed.');
    }

    const newSubscriber: NewsletterSubscriber = {
      id: `sub_${Date.now()}`,
      email,
      name,
      interests,
      subscribeDate: new Date().toISOString(),
      status: 'active',
      source: 'Website',
    };

    const updatedSubscribers = existingSubscriber
      ? subscribers.map(sub => (sub.email === email ? newSubscriber : sub))
      : [...subscribers, newSubscriber];

    localStorage.setItem(NewsletterService.STORAGE_KEY, JSON.stringify(updatedSubscribers));
  }

  public getAllSubscribers(): NewsletterSubscriber[] {
    try {
      const subscribersData = localStorage.getItem(NewsletterService.STORAGE_KEY);
      return subscribersData ? JSON.parse(subscribersData) : [];
    } catch {
      return [];
    }
  }
}

export const newsletterService = new NewsletterService();
