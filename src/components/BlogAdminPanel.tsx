import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, 
  Plus, 
  RefreshCw, 
  BarChart3, 
  FileText, 
  Settings,
  Edit,
  Trash2,
  Eye,
  Heart,
  Database,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { useBlog } from "@/hooks/useBlog";
import { generateAndPopulateBlogContent, regenerateSinglePost, enhancedBlogPostSeeds } from "@/scripts/generateBlogContent";
import { aiContentGenerator } from "@/services/aiContentGenerator";
import { blogService } from "@/services/blogService";
import { simpleInitializeDatabase } from "@/scripts/initializeDatabase";

const BlogAdminPanel = () => {
  const { 
    posts, 
    featuredPosts, 
    categories, 
    statistics, 
    loading, 
    error,
    refreshData 
  } = useBlog();
  
  const [isWorking, setIsWorking] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error' | null>(null);
  const [customPost, setCustomPost] = useState({
    title: '',
    category: '',
    tags: '',
    targetLength: 'medium' as 'short' | 'medium' | 'long',
    style: 'tutorial' as 'tutorial' | 'opinion' | 'case-study' | 'technical-deep-dive'
  });

  // Test connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      await blogService.checkTablesExist();
      setConnectionStatus('connected');
    } catch (err) {
      setConnectionStatus('error');
    }
  };

  const handleInitializeDatabase = async () => {
    try {
      setIsWorking(true);
      setMessage('🚀 Initializing database with tables and seed data...');
      
      await simpleInitializeDatabase();
      await refreshData();
      setConnectionStatus('connected');
      
      setMessage('✅ Database initialized successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setMessage(`❌ Database initialization failed: ${errorMsg}`);
    } finally {
      setIsWorking(false);
    }
  };

  const handleGenerateAllContent = async () => {
    try {
      setIsWorking(true);
      setMessage(`🤖 Generating ${blogPostSeeds.length} AI-powered blog posts...`);
      
      await generateAndPopulateBlogContent();
      await refreshData();
      
      setMessage('🎉 All blog content generated successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setMessage(`❌ Content generation failed: ${errorMsg}`);
    } finally {
      setIsWorking(false);
    }
  };

  const handleGenerateSinglePost = async () => {
    try {
      setIsWorking(true);
      setMessage(`🤖 Generating single post: ${blogPostSeeds[selectedSeed].title}...`);
      
      await regenerateSinglePost(blogPostSeeds[selectedSeed]);
      await refreshData();
      
      setMessage('✅ Single post generated successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setMessage(`❌ Single post generation failed: ${errorMsg}`);
    } finally {
      setIsWorking(false);
    }
  };

  const handleGenerateCustomPost = async () => {
    if (!customPost.title || !customPost.category) {
      setMessage('❌ Please fill in title and category');
      return;
    }

    try {
      setIsWorking(true);
      setMessage('🤖 Generating custom blog post...');
      
      const seed = {
        title: customPost.title,
        category: customPost.category,
        tags: customPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        targetLength: customPost.targetLength,
        style: customPost.style
      };

      const generatedPost = await aiContentGenerator.generateBlogPost(seed);
      
      await blogService.createPost({
        title: generatedPost.title,
        slug: generatedPost.slug,
        excerpt: generatedPost.excerpt,
        content: generatedPost.content,
        image_url: generatedPost.imageUrl,
        category: generatedPost.category,
        tags: generatedPost.tags,
        featured: false,
        published: true,
        publish_date: new Date().toISOString(),
        read_time_minutes: generatedPost.readTimeMinutes,
        views: 0, // Will be updated based on actual engagement
        likes: 0,
        comments: 0
      });

      await refreshData();
      
      // Reset form
      setCustomPost({
        title: '',
        category: '',
        tags: '',
        targetLength: 'medium',
        style: 'tutorial'
      });
      
      setMessage('✅ Custom post generated successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setMessage(`❌ Custom post generation failed: ${errorMsg}`);
    } finally {
      setIsWorking(false);
    }
  };

  const analytics = {
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0),
    totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
    avgReadTime: Math.round(posts.reduce((sum, post) => sum + post.read_time_minutes, 0) / posts.length || 0),
    featuredCount: featuredPosts.length,
    categoriesCount: categories.length,
    engagementRate: posts.length > 0 ? Math.round((posts.reduce((sum, post) => sum + post.likes, 0) / posts.reduce((sum, post) => sum + post.views, 0)) * 100 * 10) / 10 : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Administration</h1>
          <p className="text-muted-foreground">Manage your AI-powered blog system with real Supabase backend</p>
        </div>
        <div className="flex items-center gap-2">
          {connectionStatus === 'connected' && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Connected</span>
            </div>
          )}
          {connectionStatus === 'error' && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Error</span>
            </div>
          )}
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-4">
            <p className="text-blue-800 dark:text-blue-200">{message}</p>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 dark:text-red-200">Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Initialize database and generate content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={handleInitializeDatabase} 
              disabled={isWorking}
              variant="secondary"
            >
              {isWorking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
              Initialize Database
            </Button>
            <Button 
              onClick={handleGenerateAllContent} 
              disabled={isWorking}
            >
              {isWorking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Generate All Content ({blogPostSeeds.length} posts)
            </Button>
            <Button 
              onClick={testConnection} 
              disabled={isWorking}
              variant="outline"
            >
              <Database className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{analytics.totalPosts}</div>
            <div className="text-xs text-muted-foreground">Total Posts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{analytics.totalLikes}</div>
            <div className="text-xs text-muted-foreground">Total Likes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{analytics.avgReadTime}m</div>
            <div className="text-xs text-muted-foreground">Avg Read Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Badge className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{analytics.featuredCount}</div>
            <div className="text-xs text-muted-foreground">Featured</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Settings className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{analytics.categoriesCount}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
            <div className="text-2xl font-bold">{analytics.engagementRate}%</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Generation */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Single Post Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Single Post</CardTitle>
            <CardDescription>Generate from predefined templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedSeed.toString()} onValueChange={(value) => setSelectedSeed(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a post template" />
              </SelectTrigger>
              <SelectContent>
                {blogPostSeeds.map((seed, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {seed.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleGenerateSinglePost}
              disabled={isWorking}
              className="w-full"
            >
              {isWorking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Selected Post
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Custom Post Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Custom Post</CardTitle>
            <CardDescription>Create with custom specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Post title"
              value={customPost.title}
              onChange={(e) => setCustomPost(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <Select 
              value={customPost.category} 
              onValueChange={(value) => setCustomPost(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Tags (comma-separated)"
              value={customPost.tags}
              onChange={(e) => setCustomPost(prev => ({ ...prev, tags: e.target.value }))}
            />

            <div className="grid grid-cols-2 gap-2">
              <Select 
                value={customPost.targetLength} 
                onValueChange={(value: 'short' | 'medium' | 'long') => setCustomPost(prev => ({ ...prev, targetLength: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={customPost.style} 
                onValueChange={(value: 'tutorial' | 'opinion' | 'case-study' | 'technical-deep-dive') => setCustomPost(prev => ({ ...prev, style: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="opinion">Opinion</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                  <SelectItem value="technical-deep-dive">Deep-dive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerateCustomPost}
              disabled={isWorking || !customPost.title || !customPost.category}
              className="w-full"
            >
              {isWorking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Custom Post
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts Management */}
      {posts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts ({posts.length})</CardTitle>
            <CardDescription>Manage your published blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.slice(0, 10).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{post.title}</h4>
                      {post.featured && <Badge variant="secondary">Featured</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {post.category} • {post.read_time_minutes} min read • {post.views} views • {post.likes} likes
                    </p>
                    <div className="flex gap-1">
                      {post.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogAdminPanel;
