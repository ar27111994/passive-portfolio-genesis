import { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import type { Database } from '../integrations/supabase/types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogCategory = Database['public']['Tables']['blog_categories']['Row'];
type BlogStatistic = Database['public']['Tables']['blog_statistics']['Row'];

interface UseBlogReturn {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  recentPosts: BlogPost[];
  categories: BlogCategory[];
  statistics: BlogStatistic[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  incrementViews: (postId: string) => Promise<void>;
  incrementLikes: (postId: string) => Promise<void>;
}

export function useBlog(): UseBlogReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [statistics, setStatistics] = useState<BlogStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data with individual error handling
      const results = await Promise.allSettled([
        blogService.getAllPublishedPosts(),
        blogService.getFeaturedPosts(),
        blogService.getAllCategories(),
        blogService.getBlogStatistics()
      ]);

      const [postsResult, featuredResult, catsResult, statsResult] = results;

      // Handle successful results and provide fallbacks for failures
      const allPosts = postsResult.status === 'fulfilled' ? postsResult.value : [];
      const featured = featuredResult.status === 'fulfilled' ? featuredResult.value : [];
      const cats = catsResult.status === 'fulfilled' ? catsResult.value : [];
      const stats = statsResult.status === 'fulfilled' ? statsResult.value : [
        { id: '1', label: 'Technical Articles', value: '0+', icon_name: 'BookOpen', sort_order: 1, updated_at: new Date().toISOString() },
        { id: '2', label: 'Monthly Readers', value: '0+', icon_name: 'Users', sort_order: 2, updated_at: new Date().toISOString() },
        { id: '3', label: 'Developer Engagement', value: '0%', icon_name: 'Heart', sort_order: 3, updated_at: new Date().toISOString() },
        { id: '4', label: 'Community Reach', value: '0+', icon_name: 'TrendingUp', sort_order: 4, updated_at: new Date().toISOString() }
      ];

      setPosts(allPosts);
      setFeaturedPosts(featured);
      setRecentPosts(allPosts.slice(0, 6)); // First 6 posts as recent
      setCategories(cats);
      setStatistics(stats);

      // Collect any errors from failed operations
      const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => (result as PromiseRejectedResult).reason?.message || 'Unknown error');

      if (errors.length > 0) {
        console.warn('Some blog data failed to load:', errors);
        // Only set error if ALL operations failed
        if (errors.length === results.length) {
          setError(`Failed to fetch blog data: ${errors[0]}`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog data');
      console.error('Error fetching blog data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchBlogData();
  };

  const incrementViews = async (postId: string) => {
    try {
      await blogService.incrementViews(postId);
      // Update local state to reflect the change
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, views: post.views + 1 }
          : post
      ));
      setFeaturedPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, views: post.views + 1 }
          : post
      ));
      setRecentPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, views: post.views + 1 }
          : post
      ));
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  const incrementLikes = async (postId: string) => {
    try {
      await blogService.incrementLikes(postId);
      // Update local state to reflect the change
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
      setFeaturedPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
      setRecentPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    } catch (err) {
      console.error('Error incrementing likes:', err);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  return {
    posts,
    featuredPosts,
    recentPosts,
    categories,
    statistics,
    loading,
    error,
    refreshData,
    incrementViews,
    incrementLikes
  };
}

// Hook for individual blog post
export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        setError(null);
        const postData = await blogService.getPostBySlug(slug);
        setPost(postData);

        // Increment views when post is loaded
        if (postData) {
          await blogService.incrementViews(postData.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return { post, loading, error };
}

// Hook for blog search
export function useBlogSearch() {
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await blogService.searchPosts(term);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      console.error('Error searching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    search,
    clearResults
  };
}
