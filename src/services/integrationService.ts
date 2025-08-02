import { supabase } from '@/integrations/supabase/client';
import { blogService } from './blogService';

interface SocialBlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  category: string;
  tags: string[];
  publishDate: string;
}

export interface SocialPlatform {
    id: string;
    name: string;
    connected: boolean;
    username?: string;
    followers?: number;
    last_post?: string;
    auto_post: boolean;
    post_template: string;
}

export interface SocialPost {
    id: string;
    blog_post_id: string;
    blog_title: string;
    platforms: string[];
    content: string;
    scheduled_time?: string;
    status: 'draft' | 'scheduled' | 'posted' | 'failed';
    engagement: {
      likes: number;
      shares: number;
      comments: number;
      reach: number;
    };
    created_at: string;
    posted_at?: string;
}

class IntegrationService {
  private baseUrl = 'https://blog.ahmedrehan.dev';

  async getPublishedBlogPosts(): Promise<SocialBlogPost[]> {
    try {
      const posts = await blogService.getAllPublishedPosts();
      
      return posts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        url: `${this.baseUrl}/${post.slug}`,
        category: post.category,
        tags: post.tags,
        publishDate: post.publish_date
      }));
    } catch (error) {
      console.error('Failed to fetch published blog posts:', error);
      return [];
    }
  }

  async getSocialPlatforms(): Promise<SocialPlatform[]> {
    const { data, error } = await supabase.from('social_platforms').select('*');
    if (error) {
        console.error('Failed to fetch social platforms:', error);
        return [];
    }
    return data;
  }

  async updateSocialPlatform(platform: Partial<SocialPlatform>): Promise<void> {
    const { error } = await supabase.from('social_platforms').update(platform).eq('id', platform.id);
    if (error) {
        console.error('Failed to update social platform:', error);
    }
  }

  async getSocialPosts(): Promise<SocialPost[]> {
    const { data, error } = await supabase.from('social_posts').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error('Failed to fetch social posts:', error);
        return [];
    }
    return data;
  }

    async createSocialPost(post: Omit<SocialPost, 'id' | 'created_at' | 'engagement'>): Promise<void> {
        const { error } = await supabase.from('social_posts').insert([{ ...post, engagement: { likes: 0, shares: 0, comments: 0, reach: 0 } }]);
        if (error) {
            console.error('Failed to create social post:', error);
        }
    }

    async updateSocialPost(post: Partial<SocialPost>): Promise<void> {
        const { error } = await supabase.from('social_posts').update(post).eq('id', post.id);
        if (error) {
            console.error('Failed to update social post:', error);
        }
    }
}

export const integrationService = new IntegrationService();
