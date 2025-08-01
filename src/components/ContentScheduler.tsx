import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Eye,
  Plus,
  CheckCircle,
  AlertCircle,
  Timer
} from "lucide-react";
import { useBlog } from "@/hooks/useBlog";
import { adminService } from "@/services/adminService";

export interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  scheduledDate: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  retryCount: number;
}

const ContentScheduler = () => {
  const { categories } = useBlog();
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [message, setMessage] = useState('');
  
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    imageUrl: '',
    scheduledDate: '',
    scheduledTime: ''
  });

  const session = adminService.getCurrentSession();

  useEffect(() => {
    loadScheduledPosts();
    // Set up interval to check for posts to publish
    const interval = setInterval(checkScheduledPosts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const loadScheduledPosts = () => {
    const stored = localStorage.getItem('scheduledPosts');
    if (stored) {
      setScheduledPosts(JSON.parse(stored));
    }
  };

  const saveScheduledPosts = (posts: ScheduledPost[]) => {
    localStorage.setItem('scheduledPosts', JSON.stringify(posts));
    setScheduledPosts(posts);
  };

  const checkScheduledPosts = async () => {
    const now = new Date();
    const postsToPublish = scheduledPosts.filter(post => 
      post.status === 'scheduled' && 
      new Date(post.scheduledDate) <= now
    );

    for (const post of postsToPublish) {
      try {
        await publishScheduledPost(post);
      } catch (error) {
        console.error('Failed to publish scheduled post:', error);
      }
    }
  };

  const publishScheduledPost = async (post: ScheduledPost) => {
    try {
      // Here you would integrate with your blog service
      // For demo purposes, we'll just update the status
      const updatedPosts = scheduledPosts.map(p => 
        p.id === post.id 
          ? { ...p, status: 'published' as const, publishedAt: new Date().toISOString() }
          : p
      );
      saveScheduledPosts(updatedPosts);
      setMessage(`✅ Post "${post.title}" published successfully!`);
    } catch (error) {
      const updatedPosts = scheduledPosts.map(p => 
        p.id === post.id 
          ? { ...p, status: 'failed' as const, retryCount: p.retryCount + 1 }
          : p
      );
      saveScheduledPosts(updatedPosts);
      setMessage(`❌ Failed to publish "${post.title}"`);
    }
  };

  const handleCreatePost = () => {
    if (!adminService.hasPermission('schedule', 'posts')) {
      setMessage('❌ You do not have permission to schedule posts');
      return;
    }

    if (!newPost.title || !newPost.content || !newPost.scheduledDate || !newPost.scheduledTime) {
      setMessage('❌ Please fill in all required fields');
      return;
    }

    const scheduledDateTime = new Date(`${newPost.scheduledDate}T${newPost.scheduledTime}`);
    if (scheduledDateTime <= new Date()) {
      setMessage('❌ Scheduled time must be in the future');
      return;
    }

    const scheduledPost: ScheduledPost = {
      id: `scheduled-${Date.now()}`,
      title: newPost.title,
      content: newPost.content,
      excerpt: newPost.excerpt || newPost.content.substring(0, 150) + '...',
      category: newPost.category,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      imageUrl: newPost.imageUrl,
      scheduledDate: scheduledDateTime.toISOString(),
      status: 'scheduled',
      createdBy: session?.email || 'Unknown',
      createdAt: new Date().toISOString(),
      retryCount: 0
    };

    const updatedPosts = [...scheduledPosts, scheduledPost];
    saveScheduledPosts(updatedPosts);

    // Reset form
    setNewPost({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      imageUrl: '',
      scheduledDate: '',
      scheduledTime: ''
    });

    setIsCreating(false);
    setMessage(`✅ Post "${scheduledPost.title}" scheduled for ${scheduledDateTime.toLocaleString()}`);
  };

  const handleCancelPost = (postId: string) => {
    const updatedPosts = scheduledPosts.map(p => 
      p.id === postId ? { ...p, status: 'cancelled' as const } : p
    );
    saveScheduledPosts(updatedPosts);
    setMessage('📅 Post cancelled');
  };

  const handleDeletePost = (postId: string) => {
    const updatedPosts = scheduledPosts.filter(p => p.id !== postId);
    saveScheduledPosts(updatedPosts);
    setMessage('🗑️ Scheduled post deleted');
  };

  const getStatusIcon = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'scheduled': return <Timer className="w-4 h-4 text-blue-500" />;
      case 'published': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <Pause className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'published': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'cancelled': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get current date and time for min attribute
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Scheduler</h2>
          <p className="text-muted-foreground">Schedule posts for future publication</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)} 
          disabled={!adminService.hasPermission('schedule', 'posts')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule New Post
        </Button>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Create New Scheduled Post */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Post</CardTitle>
            <CardDescription>Create a post to be published at a future date and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Post title"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={newPost.category} 
                  onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}
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
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Post content..."
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={newPost.excerpt}
                onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description (optional - will auto-generate if empty)"
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={newPost.tags}
                  onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Tag1, Tag2, Tag3"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduledDate">Publish Date *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={newPost.scheduledDate}
                  onChange={(e) => setNewPost(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  min={currentDate}
                />
              </div>
              <div>
                <Label htmlFor="scheduledTime">Publish Time *</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={newPost.scheduledTime}
                  onChange={(e) => setNewPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreatePost}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Post
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Posts List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Scheduled Posts ({scheduledPosts.length})</h3>
        
        {scheduledPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No scheduled posts yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first scheduled post to see it here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {scheduledPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{post.title}</h4>
                        <Badge className={getStatusColor(post.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(post.status)}
                            {post.status}
                          </div>
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📅 {new Date(post.scheduledDate).toLocaleString()}</span>
                        <span>📂 {post.category}</span>
                        <span>👤 {post.createdBy}</span>
                        {post.tags.length > 0 && (
                          <div className="flex gap-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {post.status === 'scheduled' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCancelPost(post.id)}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentScheduler;
