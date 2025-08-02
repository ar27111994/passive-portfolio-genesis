import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  BarChart3,
  FileText,
  Settings,
  Eye,
  Heart,
  TrendingUp
} from "lucide-react";
import { useBlog } from "@/hooks/useBlog";

const AnalyticsTab = () => {
  const {
    posts,
    featuredPosts,
    categories,
    loading,
  } = useBlog();

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
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default AnalyticsTab;
