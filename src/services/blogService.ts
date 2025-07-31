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

export class BlogService {
  // Blog Posts
  async getAllPublishedPosts(limit?: number): Promise<BlogPost[]> {
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
      console.error('Error fetching blog posts:', error.message || error);
      throw new Error(`Failed to fetch blog posts: ${error.message || JSON.stringify(error)}`);
    }
    
    return data || [];
  }

  async getFeaturedPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('publish_date', { ascending: false })
      .limit(2);
    
    if (error) {
      console.error('Error fetching featured posts:', error);
      throw error;
    }
    
    return data || [];
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    
    if (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
    
    return data;
  }

  async getPostsByCategory(category: string, limit?: number): Promise<BlogPost[]> {
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
      console.error('Error fetching posts by category:', error);
      throw error;
    }
    
    return data || [];
  }

  async searchPosts(searchTerm: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('publish_date', { ascending: false });
    
    if (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
    
    return data || [];
  }

  async createPost(post: BlogPostInsert): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }
    
    return data;
  }

  async updatePost(id: string, updates: Partial<BlogPostInsert>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating post:', error);
      throw error;
    }
    
    return data;
  }

  async incrementViews(postId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_blog_views', {
      post_id: postId
    });
    
    if (error) {
      console.error('Error incrementing views:', error);
    }
  }

  async incrementLikes(postId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_blog_likes', {
      post_id: postId
    });
    
    if (error) {
      console.error('Error incrementing likes:', error);
    }
  }

  // Categories
  async getAllCategories(): Promise<BlogCategory[]> {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    return data || [];
  }

  async updateCategoryPostCounts(): Promise<void> {
    const { error } = await supabase.rpc('update_category_post_counts');
    
    if (error) {
      console.error('Error updating category post counts:', error);
    }
  }

  // Statistics
  async getBlogStatistics(): Promise<BlogStatistic[]> {
    const { data, error } = await supabase
      .from('blog_statistics')
      .select('*')
      .order('sort_order');
    
    if (error) {
      console.error('Error fetching blog statistics:', error);
      throw error;
    }
    
    return data || [];
  }

  async updateBlogStatistic(id: string, value: string): Promise<BlogStatistic> {
    const { data, error } = await supabase
      .from('blog_statistics')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating blog statistic:', error);
      throw error;
    }
    
    return data;
  }

  // Tags
  async getAllTags(): Promise<BlogTag[]> {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('usage_count', { ascending: false });
    
    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
    
    return data || [];
  }

  async updateTagUsageCounts(): Promise<void> {
    const { error } = await supabase.rpc('update_tag_usage_counts');
    
    if (error) {
      console.error('Error updating tag usage counts:', error);
    }
  }

  // Analytics and Insights
  async getBlogAnalytics() {
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
      averageReadTime: Math.round(averageReadTime),
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
  }

  // Bulk operations for AI content generation
  async createMultiplePosts(posts: BlogPostInsert[]): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(posts)
      .select();
    
    if (error) {
      console.error('Error creating multiple posts:', error);
      throw error;
    }
    
    // Update category and tag counts after bulk insert
    await Promise.all([
      this.updateCategoryPostCounts(),
      this.updateTagUsageCounts()
    ]);
    
    return data || [];
  }
}

export const blogService = new BlogService();
