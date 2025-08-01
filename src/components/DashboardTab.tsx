import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Database,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Settings,
  Eye,
  Heart,
  TrendingUp
} from "lucide-react";
import { useBlog } from "@/hooks/useBlog";
import { generateAndPopulateBlogContent } from "@/scripts/generateBlogContent";
import { simpleInitializeDatabase } from "@/scripts/initializeDatabase";
import { adminService } from '@/services/adminService';
import { blogService } from '@/services/blogService';

const DashboardTab = () => {
  const {
    posts,
    featuredPosts,
    categories,
    loading,
    error,
    refreshData
  } = useBlog();

  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error' | null>(null);

  const canInitializeDb = adminService.hasPermission('write', 'database');
  const canGenerateContent = adminService.hasPermission('generate', 'content');

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
    if (!canInitializeDb) {
      setMessage('❌ You do not have permission to initialize the database.');
      return;
    }
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
    if (!canGenerateContent) {
        setMessage('❌ You do not have permission to generate content.');
        return;
    }
    try {
      setIsWorking(true);
      setMessage(`🤖 Generating all enhanced AI-powered blog posts...`);

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
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
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
                {canInitializeDb && (
                    <Button
                    onClick={handleInitializeDatabase}
                    disabled={isWorking}
                    variant="secondary"
                    >
                    {isWorking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
                    Initialize Database
                    </Button>
                )}
                {canGenerateContent && (
                    <Button
                    onClick={handleGenerateAllContent}
                    disabled={isWorking}
                    >
                    {isWorking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Generate All Content
                    </Button>
                )}
                <Button
                    onClick={testConnection}
                    disabled={isWorking}
                    variant="outline"
                >
                    <Database className="w-4 h-4 mr-2" />
                    Test Connection
                </Button>
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
            </div>
            </CardContent>
        </Card>

        {/* Analytics Dashboard */}
        <Card>
            <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>A high-level overview of your blog's performance.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
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
            </CardContent>
        </Card>
    </div>
  );
};

export default DashboardTab;
