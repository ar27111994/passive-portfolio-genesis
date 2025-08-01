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

  // Handle different error types
  if (error?.message) {
    errorMessage = error.message;
  } else if (error?.error?.message) {
    errorMessage = error.error.message;
  } else if (error?.details) {
    errorMessage = error.details;
  } else if (error?.hint) {
    errorMessage = error.hint;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error?.name === 'TypeError' && error?.message) {
    errorMessage = `Network error: ${error.message}`;
  } else {
    // Last resort - try to extract meaningful info
    try {
      const errorStr = JSON.stringify(error, Object.getOwnPropertyNames(error));
      errorMessage = errorStr !== '{}' ? errorStr : 'Connection failed';
    } catch {
      errorMessage = 'Connection failed';
    }
  }

  console.error(`Supabase ${operation} error:`, error);
  console.error(`Error message extracted: ${errorMessage}`);
  throw new Error(`Failed to ${operation}: ${errorMessage}`);
}

export class BlogService {
  // Simple connection test without querying system tables
  async testConnection(): Promise<boolean> {
    try {
      // Try a simple query that should work with any Supabase project
      const { error } = await supabase
        .from('blog_posts')
        .select('count')
        .limit(0);

      // If we get a "does not exist" error, that actually means we're connected
      // but the table doesn't exist yet
      if (error && error.message.includes('does not exist')) {
        return true; // Connected but tables don't exist
      }

      // If no error, we're connected and tables exist
      return !error;
    } catch (err) {
      return false;
    }
  }
  // Check if tables exist and get connection status
  async getConnectionStatus(): Promise<{
    connected: boolean;
    tablesExist: boolean;
    error?: string;
  }> {
    try {
      // Test if our main blog tables exist by trying to query them
      const tableChecks = await Promise.allSettled([
        supabase.from('blog_posts').select('id').limit(1),
        supabase.from('blog_categories').select('id').limit(1),
        supabase.from('blog_statistics').select('id').limit(1),
        supabase.from('blog_tags').select('id').limit(1)
      ]);

      // Check if any table queries succeeded
      const tablesExist = tableChecks.some(result =>
        result.status === 'fulfilled' && !result.value.error
      );

      // Check if all queries failed with "does not exist" errors
      const allTablesExist = tableChecks.every(result =>
        result.status === 'fulfilled' && !result.value.error
      );

      // If at least one table query succeeded, we're connected
      if (tablesExist) {
        return {
          connected: true,
          tablesExist: allTablesExist,
          error: allTablesExist ? undefined : 'Some tables missing - may need to re-run setup script'
        };
      }

      // Check what kind of errors we got
      const errors = tableChecks
        .filter(result => result.status === 'fulfilled' && result.value.error)
        .map(result => (result as any).value.error.message);

      if (errors.some(error => error.includes('does not exist'))) {
        return {
          connected: true,
          tablesExist: false,
          error: 'Database tables not created yet - please run the setup SQL script'
        };
      }

      // Some other error occurred
      return {
        connected: false,
        tablesExist: false,
        error: errors[0] || 'Connection failed'
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

  // Analytics and Insights
  async getBlogAnalytics() {
    try {
      const [posts, categories, stats] = await Promise.all([
        this.getAllPublishedPosts(),
        this.getAllCategories(),
        this.getBlogStatistics()
      ]);

      const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
      const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
      const averageReadTime = posts.reduce((sum, post) => sum + (post.read_time_minutes || 0), 0) / posts.length;

      return {
        totalPosts: posts.length,
        totalViews,
        totalLikes,
        averageReadTime: Math.round(averageReadTime) || 0,
        categoriesCount: categories.length,
        featuredPostsCount: posts.filter(p => p.featured).length,
        recentPostsCount: posts.filter(p => {
          const publishDate = new Date(p.publish_date || '');
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          return publishDate > oneMonthAgo;
        }).length,
        categories: categories.map(cat => ({
          name: cat.name,
          postCount: cat.post_count,
          colorClass: cat.color_class
        })),
        statistics: stats
      };
    } catch (err) {
      console.error('Error fetching blog analytics:', err);
      throw err;
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
