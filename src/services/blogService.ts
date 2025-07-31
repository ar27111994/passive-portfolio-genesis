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

// Helper function to handle Supabase errors
function handleSupabaseError(error: any, operation: string): never {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  console.error(`Supabase ${operation} error:`, error);
  throw new Error(`Failed to ${operation}: ${errorMessage}`);
}

export class BlogService {
  // Check if tables exist by trying a simple query
  async checkTablesExist(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .select('id')
        .limit(1);
      
      if (error && error.message.includes('relation "public.blog_posts" does not exist')) {
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Error checking tables:', err);
      return false;
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

  async getPostsByCategory(category: string, limit?: number): Promise<BlogPost[]> {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .eq('category', category)
        .order('publish_date', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        handleSupabaseError(error, 'fetch posts by category');
      }
      
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        throw err;
      }
      handleSupabaseError(err, 'fetch posts by category');
    }
  }

  async searchPosts(searchTerm: string): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .order('publish_date', { ascending: false });
      
      if (error) {
        handleSupabaseError(error, 'search posts');
      }
      
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to search')) {
        throw err;
      }
      handleSupabaseError(err, 'search posts');
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

  async updatePost(id: string, updates: Partial<BlogPostInsert>): Promise<BlogPost> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        handleSupabaseError(error, 'update post');
      }
      
      return data;
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to update')) {
        throw err;
      }
      handleSupabaseError(err, 'update post');
    }
  }

  async incrementViews(postId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_blog_views', {
        post_id: postId
      });
      
      if (error) {
        console.warn('Error incrementing views:', error);
      }
    } catch (err) {
      console.warn('Error incrementing views:', err);
    }
  }

  async incrementLikes(postId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_blog_likes', {
        post_id: postId
      });
      
      if (error) {
        console.warn('Error incrementing likes:', error);
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

  async updateCategoryPostCounts(): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_category_post_counts');
      
      if (error) {
        console.warn('Error updating category post counts:', error);
      }
    } catch (err) {
      console.warn('Error updating category post counts:', err);
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

  async updateBlogStatistic(id: string, value: string): Promise<BlogStatistic> {
    try {
      const { data, error } = await supabase
        .from('blog_statistics')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        handleSupabaseError(error, 'update blog statistic');
      }
      
      return data;
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to update')) {
        throw err;
      }
      handleSupabaseError(err, 'update blog statistic');
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

  async updateTagUsageCounts(): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_tag_usage_counts');
      
      if (error) {
        console.warn('Error updating tag usage counts:', error);
      }
    } catch (err) {
      console.warn('Error updating tag usage counts:', err);
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
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(posts)
        .select();
      
      if (error) {
        handleSupabaseError(error, 'create multiple posts');
      }
      
      // Update category and tag counts after bulk insert
      await Promise.all([
        this.updateCategoryPostCounts(),
        this.updateTagUsageCounts()
      ]);
      
      return data || [];
    } catch (err) {
      if (err instanceof Error && err.message.includes('Failed to create')) {
        throw err;
      }
      handleSupabaseError(err, 'create multiple posts');
    }
  }

  // Initialize database with seed data if tables are empty
  async initializeDatabase(): Promise<void> {
    try {
      // Check if we have any data
      const [posts, categories, stats] = await Promise.all([
        this.getAllPublishedPosts(1),
        this.getAllCategories(),
        this.getBlogStatistics()
      ]);

      // If everything is empty, we might need to create tables first
      if (posts.length === 0 && categories.length === 0 && stats.length === 0) {
        console.log('Database appears to be empty, might need to run migrations first');
        throw new Error('Database tables do not exist or are empty. Please run migrations first.');
      }
    } catch (err) {
      console.error('Database initialization check failed:', err);
      throw err;
    }
  }
}

export const blogService = new BlogService();
