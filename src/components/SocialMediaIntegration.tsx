import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram,
  Share2,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Image,
  Link,
  Hash,
  Users,
  TrendingUp,
  Calendar
} from "lucide-react";
import { integrationService } from "@/services/integrationService";

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  connected: boolean;
  username?: string;
  followers?: number;
  lastPost?: string;
  autoPost: boolean;
  postTemplate: string;
}

interface SocialPost {
  id: string;
  blogPostId: string;
  blogTitle: string;
  platforms: string[];
  content: string;
  scheduledTime?: string;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
  createdAt: string;
  postedAt?: string;
}

const SocialMediaIntegration = () => {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      connected: false,
      autoPost: false,
      postTemplate: '🚀 New blog post: {title}\n\n{excerpt}\n\n{url}\n\n{hashtags}'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      connected: false,
      autoPost: false,
      postTemplate: '📖 Check out my latest blog post: {title}\n\n{excerpt}\n\n{url}'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      connected: false,
      autoPost: false,
      postTemplate: '💡 New article published: {title}\n\n{excerpt}\n\n{url}\n\n{hashtags}'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      connected: false,
      autoPost: false,
      postTemplate: '✨ New blog post is live!\n\n{title}\n\n{excerpt}\n\nLink in bio 👆\n\n{hashtags}'
    }
  ]);

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [selectedPost, setSelectedPost] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [message, setMessage] = useState('');

  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    loadSocialPosts();
    loadBlogPosts();
    // Load platform connections from localStorage
    const savedPlatforms = localStorage.getItem('socialPlatforms');
    if (savedPlatforms) {
      setPlatforms(JSON.parse(savedPlatforms));
    }
  }, []);

  const loadBlogPosts = async () => {
    try {
      const posts = await integrationService.getPublishedBlogPosts();
      setBlogPosts(posts);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      // Keep empty array as fallback
    }
  };

  const loadSocialPosts = () => {
    const saved = localStorage.getItem('socialPosts');
    if (saved) {
      setSocialPosts(JSON.parse(saved));
    }
  };

  const saveSocialPosts = (posts: SocialPost[]) => {
    localStorage.setItem('socialPosts', JSON.stringify(posts));
    setSocialPosts(posts);
  };

  const savePlatforms = (newPlatforms: SocialPlatform[]) => {
    localStorage.setItem('socialPlatforms', JSON.stringify(newPlatforms));
    setPlatforms(newPlatforms);
  };

  const handleConnectPlatform = (platformId: string) => {
    // In a real implementation, this would initiate OAuth flow
    const updatedPlatforms = platforms.map(platform => {
      if (platform.id === platformId) {
        return {
          ...platform,
          connected: !platform.connected,
          username: platform.connected ? undefined : `@user_${platformId}`,
          followers: platform.connected ? undefined : Math.floor(Math.random() * 10000) + 1000,
          lastPost: platform.connected ? undefined : new Date().toISOString()
        };
      }
      return platform;
    });
    savePlatforms(updatedPlatforms);
    setMessage(`${platforms.find(p => p.id === platformId)?.name} ${platforms.find(p => p.id === platformId)?.connected ? 'disconnected' : 'connected'} successfully!`);
  };

  const handleAutoPostToggle = (platformId: string) => {
    const updatedPlatforms = platforms.map(platform => 
      platform.id === platformId 
        ? { ...platform, autoPost: !platform.autoPost }
        : platform
    );
    savePlatforms(updatedPlatforms);
  };

  const handleTemplateUpdate = (platformId: string, template: string) => {
    const updatedPlatforms = platforms.map(platform => 
      platform.id === platformId 
        ? { ...platform, postTemplate: template }
        : platform
    );
    savePlatforms(updatedPlatforms);
  };

  const generatePostContent = (blogPost: any, template: string) => {
    const hashtags = `#${blogPost.category} #WebDevelopment #Programming #Tech #Blog`;
    
    return template
      .replace('{title}', blogPost.title)
      .replace('{excerpt}', blogPost.excerpt)
      .replace('{url}', blogPost.url)
      .replace('{hashtags}', hashtags);
  };

  const handleCreateSocialPost = () => {
    if (!selectedPost || selectedPlatforms.length === 0) {
      setMessage('❌ Please select a blog post and at least one platform');
      return;
    }

    const blogPost = blogPosts.find(post => post.id === selectedPost);
    if (!blogPost) return;

    const content = customContent || generatePostContent(
      blogPost, 
      platforms.find(p => p.id === selectedPlatforms[0])?.postTemplate || ''
    );

    const newSocialPost: SocialPost = {
      id: `social-${Date.now()}`,
      blogPostId: selectedPost,
      blogTitle: blogPost.title,
      platforms: selectedPlatforms,
      content,
      scheduledTime: scheduledTime || undefined,
      status: scheduledTime ? 'scheduled' : 'draft',
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0,
        reach: 0
      },
      createdAt: new Date().toISOString()
    };

    const updatedPosts = [...socialPosts, newSocialPost];
    saveSocialPosts(updatedPosts);

    // Reset form
    setSelectedPost('');
    setCustomContent('');
    setSelectedPlatforms([]);
    setScheduledTime('');
    
    setMessage(`✅ Social post ${scheduledTime ? 'scheduled' : 'created'} successfully!`);
  };

  const handlePostNow = (postId: string) => {
    const updatedPosts = socialPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          status: 'posted' as const,
          postedAt: new Date().toISOString(),
          engagement: {
            likes: Math.floor(Math.random() * 50) + 10,
            shares: Math.floor(Math.random() * 20) + 5,
            comments: Math.floor(Math.random() * 15) + 2,
            reach: Math.floor(Math.random() * 1000) + 200
          }
        };
      }
      return post;
    });
    saveSocialPosts(updatedPosts);
    setMessage('✅ Post published successfully!');
  };

  const getStatusIcon = (status: SocialPost['status']) => {
    switch (status) {
      case 'draft': return <Settings className="w-4 h-4 text-gray-500" />;
      case 'scheduled': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'posted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: SocialPost['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'posted': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Integration</h2>
          <p className="text-muted-foreground">Automate and manage social media posts for your blog content</p>
        </div>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Platform Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Platforms</CardTitle>
          <CardDescription>Connect your social media accounts to enable automatic posting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <div key={platform.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-6 h-6" />
                      <div>
                        <h4 className="font-medium">{platform.name}</h4>
                        {platform.connected && platform.username && (
                          <p className="text-sm text-muted-foreground">{platform.username}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={platform.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {platform.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>

                  {platform.connected && (
                    <div className="space-y-2 text-sm text-muted-foreground mb-3">
                      <div className="flex justify-between">
                        <span>Followers:</span>
                        <span>{platform.followers?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Auto-post:</span>
                        <Switch 
                          checked={platform.autoPost}
                          onCheckedChange={() => handleAutoPostToggle(platform.id)}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleConnectPlatform(platform.id)}
                    variant={platform.connected ? "outline" : "default"}
                    className="w-full"
                  >
                    {platform.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create Social Post */}
      <Card>
        <CardHeader>
          <CardTitle>Create Social Post</CardTitle>
          <CardDescription>Share your blog posts across social media platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="blogPost">Select Blog Post</Label>
              <Select value={selectedPost} onValueChange={setSelectedPost}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a blog post to share" />
                </SelectTrigger>
                <SelectContent>
                  {mockBlogPosts.map((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Platforms</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {platforms
                  .filter(platform => platform.connected)
                  .map((platform) => {
                    const IconComponent = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    
                    return (
                      <Button
                        key={platform.id}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedPlatforms(prev => prev.filter(id => id !== platform.id));
                          } else {
                            setSelectedPlatforms(prev => [...prev, platform.id]);
                          }
                        }}
                      >
                        <IconComponent className="w-4 h-4 mr-1" />
                        {platform.name}
                      </Button>
                    );
                  })}
              </div>
              {platforms.every(p => !p.connected) && (
                <p className="text-sm text-muted-foreground mt-2">
                  Connect at least one platform to create posts
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="content">Custom Content (Optional)</Label>
            <Textarea
              id="content"
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              placeholder="Leave empty to use platform template, or write custom content..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use templates: {'{title}'}, {'{excerpt}'}, {'{url}'}, {'{hashtags}'}
            </p>
          </div>

          <div>
            <Label htmlFor="schedule">Schedule for Later (Optional)</Label>
            <Input
              id="schedule"
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleCreateSocialPost}
              disabled={!selectedPost || selectedPlatforms.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              {scheduledTime ? 'Schedule Post' : 'Create Post'}
            </Button>
            <Button variant="outline" onClick={() => {
              setSelectedPost('');
              setCustomContent('');
              setSelectedPlatforms([]);
              setScheduledTime('');
            }}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Social Posts ({socialPosts.length})</CardTitle>
          <CardDescription>Manage your social media posts and track engagement</CardDescription>
        </CardHeader>
        <CardContent>
          {socialPosts.length === 0 ? (
            <div className="text-center py-8">
              <Share2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No social posts created yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first social media post to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {socialPosts.map((post) => (
                <div key={post.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{post.blogTitle}</h4>
                        <Badge className={getStatusColor(post.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(post.status)}
                            {post.status}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {post.platforms.map(platformId => {
                          const platform = platforms.find(p => p.id === platformId);
                          if (!platform) return null;
                          const IconComponent = platform.icon;
                          return (
                            <Badge key={platformId} variant="outline" className="text-xs">
                              <IconComponent className="w-3 h-3 mr-1" />
                              {platform.name}
                            </Badge>
                          );
                        })}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📅 {new Date(post.createdAt).toLocaleString()}</span>
                        {post.scheduledTime && (
                          <span>⏰ Scheduled: {new Date(post.scheduledTime).toLocaleString()}</span>
                        )}
                        {post.postedAt && (
                          <span>✅ Posted: {new Date(post.postedAt).toLocaleString()}</span>
                        )}
                      </div>

                      {post.status === 'posted' && (
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.engagement.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            {post.engagement.shares}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {post.engagement.reach}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-1 ml-4">
                      {post.status === 'draft' && (
                        <Button 
                          size="sm" 
                          onClick={() => handlePostNow(post.id)}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Post Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Post Templates</CardTitle>
          <CardDescription>Customize templates for each platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platforms
              .filter(platform => platform.connected)
              .map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <div key={platform.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <IconComponent className="w-5 h-5" />
                      <h4 className="font-medium">{platform.name} Template</h4>
                    </div>
                    <Textarea
                      value={platform.postTemplate}
                      onChange={(e) => handleTemplateUpdate(platform.id, e.target.value)}
                      rows={3}
                      placeholder="Enter template for this platform..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Available variables: {'{title}'}, {'{excerpt}'}, {'{url}'}, {'{hashtags}'}
                    </p>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaIntegration;
