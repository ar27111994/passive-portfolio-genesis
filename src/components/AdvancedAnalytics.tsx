import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  MessageCircle,
  Share2,
  Users,
  Clock,
  Calendar,
  Target,
  Activity,
  Download,
  RefreshCw
} from "lucide-react";
import { useBlog } from "@/hooks/useBlog";

interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    category: string;
    publishDate: string;
  }>;
  categoryPerformance: Array<{
    category: string;
    posts: number;
    views: number;
    engagement: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    views: number;
    likes: number;
    comments: number;
  }>;
  engagementMetrics: {
    likesPerView: number;
    commentsPerView: number;
    sharesPerView: number;
    avgEngagementScore: number;
  };
  audienceInsights: {
    returningVisitors: number;
    newVisitors: number;
    avgSessionDuration: number;
    pagesPerSession: number;
  };
}

const AdvancedAnalytics = () => {
  const { posts, categories, statistics } = useBlog();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateAnalyticsData();
  }, [posts, timeRange, selectedCategory]);

  const generateAnalyticsData = () => {
    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      const filteredPosts = selectedCategory === 'all' 
        ? posts 
        : posts.filter(post => post.category === selectedCategory);

      const totalViews = filteredPosts.reduce((sum, post) => sum + post.views, 0);
      const totalLikes = filteredPosts.reduce((sum, post) => sum + post.likes, 0);
      const totalComments = filteredPosts.reduce((sum, post) => sum + post.comments, 0);

      // Generate mock time series data
      const timeSeriesData = generateTimeSeriesData(parseInt(timeRange), filteredPosts);

      // Calculate top performing posts
      const topPosts = [...filteredPosts]
        .sort((a, b) => b.views - a.views)
        .slice(0, 10)
        .map(post => ({
          id: post.id,
          title: post.title,
          views: post.views,
          likes: post.likes,
          comments: post.comments,
          category: post.category,
          publishDate: post.publish_date
        }));

      // Calculate category performance
      const categoryPerformance = categories.map(category => {
        const categoryPosts = filteredPosts.filter(post => post.category === category.name);
        const views = categoryPosts.reduce((sum, post) => sum + post.views, 0);
        const engagement = categoryPosts.reduce((sum, post) => sum + post.likes + post.comments, 0);
        
        return {
          category: category.name,
          posts: categoryPosts.length,
          views,
          engagement
        };
      }).filter(cat => cat.posts > 0);

      // Generate mock traffic sources
      const trafficSources = [
        { source: 'Direct', visitors: Math.floor(totalViews * 0.4), percentage: 40 },
        { source: 'Search', visitors: Math.floor(totalViews * 0.35), percentage: 35 },
        { source: 'Social Media', visitors: Math.floor(totalViews * 0.15), percentage: 15 },
        { source: 'Referral', visitors: Math.floor(totalViews * 0.1), percentage: 10 }
      ];

      const analytics: AnalyticsData = {
        totalViews,
        totalLikes,
        totalComments,
        totalShares: Math.floor(totalViews * 0.1), // Mock shares
        uniqueVisitors: Math.floor(totalViews * 0.7),
        avgTimeOnPage: 3.5 + Math.random() * 2, // 3.5-5.5 minutes
        bounceRate: 35 + Math.random() * 20, // 35-55%
        conversionRate: 2 + Math.random() * 3, // 2-5%
        topPosts,
        categoryPerformance,
        trafficSources,
        timeSeriesData,
        engagementMetrics: {
          likesPerView: totalViews > 0 ? (totalLikes / totalViews) * 100 : 0,
          commentsPerView: totalViews > 0 ? (totalComments / totalViews) * 100 : 0,
          sharesPerView: totalViews > 0 ? (Math.floor(totalViews * 0.1) / totalViews) * 100 : 0,
          avgEngagementScore: totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0
        },
        audienceInsights: {
          returningVisitors: 65 + Math.random() * 10, // 65-75%
          newVisitors: 25 + Math.random() * 10, // 25-35%
          avgSessionDuration: 4 + Math.random() * 3, // 4-7 minutes
          pagesPerSession: 2.5 + Math.random() * 1.5 // 2.5-4 pages
        }
      };

      setAnalyticsData(analytics);
      setIsLoading(false);
    }, 1000);
  };

  const generateTimeSeriesData = (days: number, posts: any[]) => {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate mock daily data based on existing posts
      const dailyViews = Math.floor(Math.random() * 100) + 50;
      const dailyLikes = Math.floor(dailyViews * 0.1);
      const dailyComments = Math.floor(dailyViews * 0.05);
      
      data.push({
        date: date.toISOString().split('T')[0],
        views: dailyViews,
        likes: dailyLikes,
        comments: dailyComments
      });
    }
    
    return data;
  };

  const exportAnalytics = () => {
    if (!analyticsData) return;
    
    const dataToExport = {
      generated: new Date().toISOString(),
      timeRange,
      category: selectedCategory,
      summary: {
        totalViews: analyticsData.totalViews,
        totalLikes: analyticsData.totalLikes,
        totalComments: analyticsData.totalComments,
        engagementRate: analyticsData.engagementMetrics.avgEngagementScore
      },
      topPosts: analyticsData.topPosts,
      categoryPerformance: analyticsData.categoryPerformance,
      trafficSources: analyticsData.trafficSources
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!analyticsData && !isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">Detailed traffic and engagement analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="365d">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={generateAnalyticsData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button onClick={exportAnalytics} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
            <p className="text-muted-foreground">Generating analytics...</p>
          </CardContent>
        </Card>
      ) : analyticsData && (
        <>
          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">+12.5%</span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    <p className="text-2xl font-bold">{analyticsData.engagementMetrics.avgEngagementScore.toFixed(1)}%</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">+8.3%</span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Unique Visitors</p>
                    <p className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-500">-2.1%</span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Time on Page</p>
                    <p className="text-2xl font-bold">{analyticsData.avgTimeOnPage.toFixed(1)}m</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">+15.7%</span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Posts with highest engagement in selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPosts.slice(0, 5).map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <h4 className="font-medium">{post.title}</h4>
                        <p className="text-sm text-muted-foreground">{post.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Performance & Traffic Sources */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Performance metrics by content category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.categoryPerformance.map((category) => (
                    <div key={category.category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{category.category}</h4>
                        <p className="text-sm text-muted-foreground">{category.posts} posts</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{category.views.toLocaleString()} views</p>
                        <p className="text-sm text-muted-foreground">{category.engagement} engagements</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.trafficSources.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{source.visitors.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{source.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Insights</CardTitle>
              <CardDescription>Detailed engagement and audience behavior metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{analyticsData.bounceRate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Bounce Rate</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{analyticsData.audienceInsights.returningVisitors.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Returning Visitors</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">{analyticsData.audienceInsights.avgSessionDuration.toFixed(1)}m</p>
                  <p className="text-sm text-muted-foreground">Session Duration</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Share2 className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">{analyticsData.audienceInsights.pagesPerSession.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Pages/Session</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
