import { useState } from 'react';
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
  Search,
  Edit,
  Trash2,
  Eye,
  Heart
} from "lucide-react";
import { useBlog } from "@/hooks/useBlog";
import { generateAndPopulateBlogContent, regenerateSinglePost, enhancedBlogPostSeeds } from "@/scripts/generateBlogContent";
import { aiContentGenerator } from "@/services/aiContentGenerator";
import { blogService } from "@/services/blogService";

const BlogAdmin = () => {
  const { 
    posts, 
    featuredPosts, 
    categories, 
    statistics, 
    loading, 
    refreshData 
  } = useBlog();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState(0);
  const [customPost, setCustomPost] = useState({
    title: '',
    category: '',
    tags: '',
    targetLength: 'medium' as 'short' | 'medium' | 'long',
    style: 'tutorial' as 'tutorial' | 'opinion' | 'case-study' | 'technical-deep-dive'
  });

  const handleGenerateAllContent = async () => {
    try {
      setIsGenerating(true);
      await generateAndPopulateBlogContent();
      await refreshData();
    } catch (err) {
      console.error('Failed to generate content:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSinglePost = async () => {
    try {
      setIsGenerating(true);
      await regenerateSinglePost(enhancedBlogPostSeeds[selectedSeed]);
      await refreshData();
    } catch (err) {
      console.error('Failed to generate single post:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCustomPost = async () => {
    if (!customPost.title || !customPost.category) {
      alert('Please fill in title and category');
      return;
    }

    try {
      setIsGenerating(true);
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
    } catch (err) {
      console.error('Failed to generate custom post:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const analytics = {
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0),
    totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
    avgReadTime: Math.round(posts.reduce((sum, post) => sum + post.read_time_minutes, 0) / posts.length || 0),
    featuredCount: featuredPosts.length,
    categoriesCount: categories.length
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Administration</h1>
          <p className="text-muted-foreground">Manage your AI-generated blog content and analytics</p>
        </div>
        <Button onClick={refreshData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
      </div>

      {/* Content Generation */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Bulk Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk Content Generation</CardTitle>
            <CardDescription>
              Generate multiple blog posts using predefined seeds based on Ahmed's expertise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleGenerateAllContent}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate All Blog Posts ({enhancedBlogPostSeeds.length} posts)
                </>
              )}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">This will generate:</p>
              <ul className="space-y-1">
                {blogPostSeeds.slice(0, 4).map((seed, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    {seed.title}
                  </li>
                ))}
                {blogPostSeeds.length > 4 && (
                  <li className="text-xs">... and {blogPostSeeds.length - 4} more</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Single Post Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Single Post Generation</CardTitle>
            <CardDescription>
              Generate a single blog post from predefined seeds
            </CardDescription>
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
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
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
      </div>

      {/* Custom Post Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Post Generation</CardTitle>
          <CardDescription>
            Create a custom blog post with your own specifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Enter post title"
                  value={customPost.title}
                  onChange={(e) => setCustomPost(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
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
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                <Input
                  placeholder="Angular, TypeScript, Tutorial"
                  value={customPost.tags}
                  onChange={(e) => setCustomPost(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Length</label>
                <Select 
                  value={customPost.targetLength} 
                  onValueChange={(value: 'short' | 'medium' | 'long') => setCustomPost(prev => ({ ...prev, targetLength: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (5-7 min read)</SelectItem>
                    <SelectItem value="medium">Medium (8-12 min read)</SelectItem>
                    <SelectItem value="long">Long (13+ min read)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Style</label>
                <Select 
                  value={customPost.style} 
                  onValueChange={(value: 'tutorial' | 'opinion' | 'case-study' | 'technical-deep-dive') => setCustomPost(prev => ({ ...prev, style: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="opinion">Opinion/Personal</SelectItem>
                    <SelectItem value="case-study">Case Study</SelectItem>
                    <SelectItem value="technical-deep-dive">Technical Deep-dive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerateCustomPost}
            disabled={isGenerating || !customPost.title || !customPost.category}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Custom Post...
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

      {/* Recent Posts Preview */}
      {posts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Latest generated blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{post.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.category} • {post.read_time_minutes} min read • {post.views} views • {post.likes} likes
                    </p>
                    <div className="flex gap-1 mt-2">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
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

export default BlogAdmin;
