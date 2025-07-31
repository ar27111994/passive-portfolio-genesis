import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, Heart, MessageCircle, Star, BookOpen, Users, TrendingUp, Loader2 } from "lucide-react";
import { useState } from "react";

// Mock blog data that simulates AI-generated content
const mockBlogPosts = [
  {
    id: "1",
    title: "Building Scalable Angular Applications: My EAGLE6 Experience",
    excerpt: "Four years of developing enterprise cybersecurity platforms taught me invaluable lessons about Angular architecture, state management with Akita, and building complex data visualizations. Here's what I learned about scaling Angular applications for enterprise use.",
    content: "# Building Scalable Angular Applications\n\nDuring my four years at EAGLE6, I had the privilege of working on enterprise-scale cybersecurity platforms...",
    image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    category: "Angular",
    tags: ["Angular", "Enterprise", "TypeScript", "Akita", "Cybersecurity"],
    featured: true,
    published: true,
    publish_date: "2023-11-15T10:00:00Z",
    read_time_minutes: 12,
    views: 2840,
    likes: 156,
    comments: 23
  },
  {
    id: "2", 
    title: "From 13-Year-Old GW-BASIC Programmer to Enterprise Developer",
    excerpt: "My journey started with calculating day-of-week algorithms in GW-BASIC at age 13. This personal story covers 11+ years of evolution from hobby programming to building enterprise applications, the technologies I've mastered, and lessons learned along the way.",
    content: "# My Programming Journey\n\nIt all started when I was 13 years old, fascinated by computers and what they could do...",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    category: "Career",
    tags: ["Career", "Programming", "Personal Story", "GW-BASIC", "Web Development"],
    featured: true,
    published: true,
    publish_date: "2023-11-10T10:00:00Z",
    read_time_minutes: 8,
    views: 3200,
    likes: 187,
    comments: 34
  },
  {
    id: "3",
    title: "BlindSight: Building Accessibility-First Web Applications",
    excerpt: "How I developed a social platform for visually impaired users, focusing on screen reader compatibility, WCAG 2.1 AA compliance, and accessible Angular components. Real-world accessibility implementation insights.",
    content: "# Building for Accessibility\n\nAccessibility isn't just a compliance requirement—it's about creating inclusive experiences...",
    image_url: "https://images.unsplash.com/photo-1573164713712-03790a178651?w=800&h=400&fit=crop",
    category: "Accessibility",
    tags: ["Angular", "Accessibility", "WCAG", "Social Impact", "Screen Readers"],
    featured: false,
    published: true,
    publish_date: "2023-11-08T10:00:00Z",
    read_time_minutes: 10,
    views: 1650,
    likes: 89,
    comments: 15
  },
  {
    id: "4",
    title: "Advanced RxJS Patterns in Enterprise Angular Applications",
    excerpt: "Complex reactive programming patterns I used at EAGLE6 for handling real-time data streams, error handling, and memory management in large-scale Angular applications. Practical examples included.",
    content: "# Advanced RxJS Patterns\n\nWorking with reactive programming in enterprise applications requires sophisticated patterns...",
    image_url: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&h=400&fit=crop",
    category: "Angular",
    tags: ["RxJS", "Angular", "Reactive Programming", "Enterprise", "Memory Management"],
    featured: false,
    published: true,
    publish_date: "2023-11-05T10:00:00Z",
    read_time_minutes: 15,
    views: 2100,
    likes: 134,
    comments: 28
  },
  {
    id: "5",
    title: "PYDI: Building a Cross-Platform Distributed File System",
    excerpt: "Technical deep-dive into developing a Python-based distributed file system. Architecture decisions, challenges with cross-platform compatibility, and lessons learned from building developer tools.",
    content: "# Building PYDI\n\nCreating a distributed file system in Python presented unique challenges...",
    image_url: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800&h=400&fit=crop",
    category: "Python",
    tags: ["Python", "File Systems", "Distributed Systems", "Open Source", "Cross-Platform"],
    featured: false,
    published: true,
    publish_date: "2023-11-02T10:00:00Z",
    read_time_minutes: 12,
    views: 1850,
    likes: 98,
    comments: 19
  },
  {
    id: "6",
    title: "Freelancing Journey: From Local PHP Projects to International Clients",
    excerpt: "My transition from local web development projects to working with international clients on Upwork. Strategies for building trust, delivering quality work, and scaling freelance income from $500 to $3000+ monthly.",
    content: "# My Freelancing Journey\n\nStarting as a freelancer was both exciting and terrifying...",
    image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    category: "Freelancing",
    tags: ["Freelancing", "Upwork", "Client Management", "Business Growth", "Remote Work"],
    featured: false,
    published: true,
    publish_date: "2023-10-25T10:00:00Z",
    read_time_minutes: 7,
    views: 2650,
    likes: 178,
    comments: 41
  }
];

const mockCategories = [
  { id: "1", name: "Angular", post_count: 12, color_class: "bg-red-100 text-red-800" },
  { id: "2", name: "Career", post_count: 8, color_class: "bg-green-100 text-green-800" },
  { id: "3", name: "TypeScript", post_count: 10, color_class: "bg-blue-100 text-blue-800" },
  { id: "4", name: "Python", post_count: 6, color_class: "bg-yellow-100 text-yellow-800" },
  { id: "5", name: "Enterprise", post_count: 9, color_class: "bg-purple-100 text-purple-800" },
  { id: "6", name: "Accessibility", post_count: 4, color_class: "bg-teal-100 text-teal-800" },
  { id: "7", name: "Freelancing", post_count: 5, color_class: "bg-pink-100 text-pink-800" },
  { id: "8", name: "E-commerce", post_count: 6, color_class: "bg-orange-100 text-orange-800" }
];

const mockStatistics = [
  { label: "Technical Articles", value: "48+", icon: BookOpen },
  { label: "Monthly Readers", value: "3.2K+", icon: Users },
  { label: "Developer Engagement", value: "12.8%", icon: Heart },
  { label: "Community Reach", value: "16K+", icon: TrendingUp }
];

const BlogDemo = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [posts, setPosts] = useState(mockBlogPosts);
  const [message, setMessage] = useState<string>('');

  const featuredPosts = posts.filter(post => post.featured);
  const recentPosts = posts.filter(post => !post.featured);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setMessage('🤖 Generating new AI-powered blog content...');
    
    // Simulate AI content generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add a new mock post
    const newPost = {
      id: Date.now().toString(),
      title: "State Management Evolution: From Redux to Akita in Angular",
      excerpt: "Why we migrated from Redux to Akita at EAGLE6 for managing complex application state. Performance benefits, developer experience improvements, and migration strategies for large codebases.",
      content: "# State Management Evolution\n\nAt EAGLE6, we faced the challenge of managing increasingly complex application state...",
      image_url: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&h=400&fit=crop",
      category: "State Management",
      tags: ["Akita", "Angular", "State Management", "Redux", "Migration"],
      featured: Math.random() > 0.5,
      published: true,
      publish_date: new Date().toISOString(),
      read_time_minutes: 9,
      views: Math.floor(Math.random() * 1000) + 500,
      likes: Math.floor(Math.random() * 100) + 20,
      comments: Math.floor(Math.random() * 20) + 5
    };
    
    setPosts(prev => [newPost, ...prev]);
    setMessage('✅ New blog post generated successfully!');
    setIsGenerating(false);
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleView = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, views: post.views + 1 }
        : post
    ));
  };

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Technical Blog & Insights</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sharing practical insights from 11+ years of development experience, from enterprise Angular applications 
            to accessibility-focused projects and freelancing strategies.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <Card className="mb-8 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <CardContent className="p-4">
              <p className="text-green-800 dark:text-green-200 text-center">{message}</p>
            </CardContent>
          </Card>
        )}

        {/* Blog Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {mockStatistics.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generate Content Button */}
        <div className="text-center mb-16">
          <Button 
            onClick={handleGenerateContent}
            disabled={isGenerating}
            size="lg"
            className="mb-4"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating AI Content...
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Generate New AI Blog Post
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            Demo: Click to generate a new AI-powered blog post with realistic content
          </p>
        </div>

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
                  onClick={() => handleView(post.id)}
                >
                  <div className="overflow-hidden rounded-t-lg">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id);
                          }}
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
                  onClick={() => handleView(post.id)}
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
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8">Content Categories</h3>
          <div className="flex flex-wrap gap-3">
            {mockCategories.map((category) => (
              <div 
                key={category.id} 
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:shadow-md transition-shadow ${category.color_class}`}
              >
                {category.name} ({category.post_count})
              </div>
            ))}
          </div>
        </div>

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

        {/* Demo Notice */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🚀 Demo Blog System</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This is a fully functional demo of the AI-powered blog system. All content is generated based on Ahmed's real experience and expertise. 
              The system includes features like view tracking, like functionality, and realistic engagement metrics.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2">✨ AI Content Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Intelligent content creation based on real project experience, technical expertise, and career insights.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Real-time Engagement</h4>
                <p className="text-sm text-muted-foreground">
                  Interactive features including view counting, like buttons, and engagement metrics tracking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BlogDemo;
