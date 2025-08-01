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
  Edit,
  Eye,
  AlertCircle
} from "lucide-react";
import { useBlog } from "@/hooks/useBlog";
import { regenerateSinglePost, enhancedBlogPostSeeds } from "@/scripts/generateBlogContent";
import { aiContentGenerator } from "@/services/aiContentGenerator";
import { blogService } from "@/services/blogService";
import { adminService } from '@/services/adminService';

const ContentTab = () => {
  const {
    posts,
    categories,
    loading,
    error,
    refreshData
  } = useBlog();

  const [isWorking, setIsWorking] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [customPost, setCustomPost] = useState({
    title: '',
    category: '',
    tags: '',
    targetLength: 'medium' as 'short' | 'medium' | 'long',
    style: 'tutorial' as 'tutorial' | 'opinion' | 'case-study' | 'technical-deep-dive'
  });

  const canGenerateContent = adminService.hasPermission('generate', 'content');
  const canWritePosts = adminService.hasPermission('write', 'posts');

  const handleGenerateSinglePost = async () => {
    if (!canGenerateContent) {
        setMessage('❌ You do not have permission to generate content.');
        return;
    }
    try {
      setIsWorking(true);
      setMessage(`🤖 Generating single post: ${enhancedBlogPostSeeds[selectedSeed].title}...`);

      await regenerateSinglePost(enhancedBlogPostSeeds[selectedSeed]);
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
    if (!canGenerateContent) {
        setMessage('❌ You do not have permission to generate content.');
        return;
    }
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
        views: 0,
        likes: 0,
        comments: 0
      });

      await refreshData();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">Create, edit, and manage blog posts.</p>
        </div>
        <Button onClick={refreshData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
        </Button>
      </div>

      {message && (
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-4">
            <p className="text-blue-800 dark:text-blue-200">{message}</p>
          </CardContent>
        </Card>
      )}

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

      {canGenerateContent && (
        <div className="grid lg:grid-cols-2 gap-8">
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
                    {enhancedBlogPostSeeds.map((seed, index) => (
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
      )}

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
                    {canWritePosts && (
                        <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                        </Button>
                    )}
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

export default ContentTab;
