import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, Heart, MessageCircle, Star, BookOpen, Users, TrendingUp, Loader2, AlertCircle, CheckCircle, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { useBlog } from "@/hooks/useBlog";
import { blogService } from "@/services/blogService";
import BlogSetup from "@/components/BlogSetup";
import AdminAccessButton from "@/components/AdminAccessButton";

const BlogReal = () => {
  const { 
    featuredPosts, 
    recentPosts, 
    categories, 
    statistics, 
    loading, 
    error, 
    refreshData,
    incrementViews,
    incrementLikes
  } = useBlog();
  
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error' | null>(null);
  const [healthInfo, setHealthInfo] = useState<any>(null);

  // Test Supabase connection on component mount
  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      setConnectionStatus('testing');

      // Run health check for detailed diagnostics
      const health = await blogService.healthCheck();
      setHealthInfo(health);

      if (health.status === 'healthy') {
        setConnectionStatus('connected');
      } else if (health.status === 'degraded') {
        setConnectionStatus('connected'); // Connected but with issues
      } else {
        setConnectionStatus('error');
      }
    } catch (err) {
      console.error('Supabase connection test failed:', err);
      setConnectionStatus('error');
      setHealthInfo({
        status: 'unhealthy',
        details: [],
        errors: [err instanceof Error ? err.message : 'Unknown error']
      });
    }
  };



  const handlePostClick = async (postId: string) => {
    await incrementViews(postId);
  };

  const handleLikeClick = async (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await incrementLikes(postId);
  };

  if (loading) {
    return (
      <section id="blog" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading blog content...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show setup component if tables don't exist
  if (error && error.includes('does not exist')) {
    return <BlogSetup />;
  }

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Technical Blog & Insights</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI-powered blog system with real Supabase backend. Authentic content based on 11+ years of development experience.
          </p>
        </div>





        {/* Simplified Error State for End Users */}
        {error && (
          <Card className="mb-8 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
                Blog Content Loading
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                The blog system is being initialized. Please use the admin panel below to set up and generate content.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Admin Access Section */}
        <div className="mb-16">
          <div className="max-w-2xl mx-auto">
            <AdminAccessButton />
          </div>
        </div>

        {/* Blog Statistics */}
        {statistics.length > 0 && (
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {statistics.map((stat, index) => {
              const IconComponent = {
                BookOpen,
                Users,
                Heart,
                TrendingUp
              }[stat.icon_name] || BookOpen;

              return (
                <Card key={stat.id} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Star className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold">Featured Articles</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="group hover:shadow-xl transition-all duration-300 border-primary/20 cursor-pointer"
                  onClick={() => handlePostClick(post.id)}
                >
                  {post.image_url && (
                    <div className="overflow-hidden rounded-t-lg">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">{post.category}</Badge>
                      <Badge variant="outline">Featured</Badge>
                    </div>
                    <CardTitle className="text-xl leading-tight hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.publish_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.read_time_minutes} min read
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views.toLocaleString()}
                        </div>
                        <button 
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                          onClick={(e) => handleLikeClick(post.id, e)}
                        >
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </button>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </div>
                      </div>
                      <Button size="sm">
                        Read Article
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Posts Grid */}
        {recentPosts.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8">Recent Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="group hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePostClick(post.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publish_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {post.read_time_minutes} min read
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        {post.views.toLocaleString()}
                      </div>
                      <Button size="sm" variant="outline">
                        Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8">Content Categories</h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:shadow-md transition-shadow ${category.color_class}`}
                >
                  {category.name} ({category.post_count})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Show when no content exists */}
        {!loading && !error && featuredPosts.length === 0 && recentPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-8">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-4">No Blog Content Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Initialize the database and generate AI-powered blog content to get started.
              </p>
            </div>
          </div>
        )}

        {/* Professional Services */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Professional Development Services</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leverage my enterprise development experience through personalized consulting, 
              code reviews, and training sessions tailored to your specific needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Technical Consulting",
                description: "Get personalized guidance on Angular architecture, enterprise development challenges, and code optimization from my 11+ years of experience.",
                price: "$150/hour",
                features: ["Angular Architecture Review", "Code Quality Audits", "Performance Optimization", "Team Training & Mentorship"]
              },
              {
                title: "Code Review Services",
                description: "Comprehensive code reviews focusing on Angular best practices, accessibility compliance, and enterprise-grade patterns I've used in production.",
                price: "$200/session",
                features: ["Detailed Code Analysis", "Security Assessment", "Performance Recommendations", "WCAG Compliance Check"]
              },
              {
                title: "Development Workshops",
                description: "Custom training sessions on Angular, TypeScript, accessibility, and enterprise development practices based on real-world project experience.",
                price: "$500/day",
                features: ["Customized Content", "Hands-on Coding", "Enterprise Patterns", "Q&A Sessions"]
              }
            ].map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{service.price}</div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={index === 1 ? "default" : "outline"}>
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Information */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🚀 Real AI Blog Management System</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This is a fully functional AI-powered blog management system with real Supabase backend integration.
              All content is generated based on authentic experience and stored in a PostgreSQL database.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2">🤖 AI Content Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Generates authentic blog posts based on 11+ years of real development experience, enterprise projects, and technical expertise.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🗄️ Supabase Backend</h4>
                <p className="text-sm text-muted-foreground">
                  PostgreSQL database with real-time capabilities, RLS security, automated functions, and comprehensive analytics.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Real-time Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Live tracking of views, likes, comments, and engagement metrics with automated statistics updates.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚡ Interactive Features</h4>
                <p className="text-sm text-muted-foreground">
                  Full CRUD operations, search functionality, category management, and admin controls for content generation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BlogReal;
