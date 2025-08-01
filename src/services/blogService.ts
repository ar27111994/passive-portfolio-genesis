import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
type BlogCategory = Database['public']['Tables']['blog_categories']['Row'];
type BlogStatistic = Database['public']['Tables']['blog_statistics']['Row'];
type BlogTag = Database['public']['Tables']['blog_tags']['Row'];

export interface BlogPostWithStats extends BlogPost {
  category_info?: BlogCategory;
}

// Helper function to handle Supabase errors properly
function handleSupabaseError(error: any, operation: string): never {
  let errorMessage = 'Unknown error';
  
  if (error?.message) {
    errorMessage = error.message;
  } else if (error?.error?.message) {
    errorMessage = error.error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error?.toString && typeof error.toString === 'function') {
    errorMessage = error.toString();
  } else {
    errorMessage = JSON.stringify(error);
  }
  
  console.error(`Supabase ${operation} error:`, error);
  throw new Error(`Failed to ${operation}: ${errorMessage}`);
}

export class BlogService {
  // Check if tables exist and get connection status
  async getConnectionStatus(): Promise<{
    connected: boolean;
    tablesExist: boolean;
    error?: string;
  }> {
    try {
      // Test basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);
      
      if (connectionError) {
        return {
          connected: false,
          tablesExist: false,
          error: connectionError.message
        };
      }
      
      // Test if our tables exist
      const { error: tableError } = await supabase
        .from('blog_posts')
        .select('id')
        .limit(1);
      
      if (tableError) {
        if (tableError.message.includes('does not exist')) {
          return {
            connected: true,
            tablesExist: false,
            error: 'Database tables not created yet'
          };
        }
        return {
          connected: true,
          tablesExist: false,
          error: tableError.message
        };
      }
      
      return {
        connected: true,
        tablesExist: true
      };
      
    } catch (err) {
      return {
        connected: false,
        tablesExist: false,
        error: err instanceof Error ? err.message : 'Unknown connection error'
      };
    }
  }

  // Blog Posts
  async getAllPublishedPosts(limit?: number): Promise<BlogPost[]> {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('publish_date', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        handleSupabaseError(error, 'fetch blog posts');
      }
      
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        throw err;
      }
      handleSupabaseError(err, 'fetch blog posts');
    }
  }

  async getFeaturedPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('publish_date', { ascending: false })
        .limit(2);
      
      if (error) {
        handleSupabaseError(error, 'fetch featured posts');
      }
      
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        throw err;
      }
      handleSupabaseError(err, 'fetch featured posts');
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows found
        }
        handleSupabaseError(error, 'fetch post by slug');
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching post by slug:', err);
      return null;
    }
  }

  async createPost(post: BlogPostInsert): Promise<BlogPost> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(post)
        .select()
        .single();
      
      if (error) {
        handleSupabaseError(error, 'create post');
      }
      
      return data;
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to create')) {
        throw err;
      }
      handleSupabaseError(err, 'create post');
    }
  }

  async incrementViews(postId: string): Promise<void> {
    try {
      // Simple approach - just update the views count directly
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          views: supabase.sql`views + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);
      
      if (error) {
        console.warn('Error incrementing views:', error.message);
      }
    } catch (err) {
      console.warn('Error incrementing views:', err);
    }
  }

  async incrementLikes(postId: string): Promise<void> {
    try {
      // Simple approach - just update the likes count directly
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          likes: supabase.sql`likes + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);
      
      if (error) {
        console.warn('Error incrementing likes:', error.message);
      }
    } catch (err) {
      console.warn('Error incrementing likes:', err);
    }
  }

  // Categories
  async getAllCategories(): Promise<BlogCategory[]> {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      
      if (error) {
        handleSupabaseError(error, 'fetch categories');
      }
      
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        throw err;
      }
      handleSupabaseError(err, 'fetch categories');
    }
  }

  // Statistics
  async getBlogStatistics(): Promise<BlogStatistic[]> {
    try {
      const { data, error } = await supabase
        .from('blog_statistics')
        .select('*')
        .order('sort_order');
      
      if (error) {
        handleSupabaseError(error, 'fetch blog statistics');
      }
      
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        throw err;
      }
      handleSupabaseError(err, 'fetch blog statistics');
    }
  }

  // Tags
  async getAllTags(): Promise<BlogTag[]> {
    try {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('usage_count', { ascending: false });
      
      if (error) {
        handleSupabaseError(error, 'fetch tags');
      }
      
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        throw err;
      }
      handleSupabaseError(err, 'fetch tags');
    }
  }

  // Bulk operations for AI content generation
  async createMultiplePosts(posts: BlogPostInsert[]): Promise<BlogPost[]> {
    try {
      // Create posts one by one to handle potential errors better
      const createdPosts: BlogPost[] = [];
      
      for (const post of posts) {
        try {
          const { data, error } = await supabase
            .from('blog_posts')
            .insert(post)
            .select()
            .single();
          
          if (error) {
            console.error(`Error creating post "${post.title}":`, error.message);
            continue; // Skip this post and continue with others
          }
          
          if (data) {
            createdPosts.push(data);
          }
        } catch (postError) {
          console.error(`Error creating post "${post.title}":`, postError);
          continue;
        }
      }
      
      if (createdPosts.length === 0) {
        throw new Error('Failed to create any posts. Check database tables exist.');
      }
      
      return createdPosts;
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to create')) {
        throw err;
      }
      handleSupabaseError(err, 'create multiple posts');
    }
  }

  // Simple data insertion for basic setup
  async insertBasicData(): Promise<void> {
    try {
      // Try to insert basic categories
      const categories = [
        { name: 'Angular', description: 'Angular framework tutorials', color_class: 'bg-red-100 text-red-800' },
        { name: 'Career', description: 'Career development', color_class: 'bg-green-100 text-green-800' },
        { name: 'TypeScript', description: 'TypeScript tutorials', color_class: 'bg-blue-100 text-blue-800' },
      ];
      
      for (const category of categories) {
        const { error } = await supabase
          .from('blog_categories')
          .upsert(category, { onConflict: 'name', ignoreDuplicates: true });
        
        if (error) {
          console.warn(`Warning inserting category ${category.name}:`, error.message);
        }
      }
      
      // Try to insert basic statistics
      const statistics = [
        { label: 'Technical Articles', value: '0+', icon_name: 'BookOpen', sort_order: 1 },
        { label: 'Monthly Readers', value: '0+', icon_name: 'Users', sort_order: 2 },
        { label: 'Developer Engagement', value: '0%', icon_name: 'Heart', sort_order: 3 },
        { label: 'Community Reach', value: '0+', icon_name: 'TrendingUp', sort_order: 4 }
      ];
      
      for (const stat of statistics) {
        const { error } = await supabase
          .from('blog_statistics')
          .upsert(stat, { onConflict: 'label', ignoreDuplicates: true });
        
        if (error) {
          console.warn(`Warning inserting statistic ${stat.label}:`, error.message);
        }
      }
      
    } catch (err) {
      console.error('Error inserting basic data:', err);
      throw err;
    }
  }
}

export const blogService = new BlogService();
