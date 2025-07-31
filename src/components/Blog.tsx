import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye, Heart, MessageCircle, Share2, BookOpen, TrendingUp, Star, Users } from "lucide-react";

const Blog = () => {
  const featuredPosts = [
    {
      title: "Building Scalable Angular Applications: My EAGLE6 Experience",
      excerpt: "Four years of developing enterprise cybersecurity platforms taught me invaluable lessons about Angular architecture, state management with Akita, and building complex data visualizations. Here's what I learned about scaling Angular applications for enterprise use.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
      category: "Angular",
      publishDate: "2023-11-15",
      readTime: "12 min read",
      views: 2840,
      likes: 156,
      comments: 23,
      featured: true,
      slug: "scalable-angular-applications-eagle6-experience",
      tags: ["Angular", "Enterprise", "TypeScript", "Akita", "Cybersecurity"]
    },
    {
      title: "From 13-Year-Old GW-BASIC Programmer to Enterprise Developer",
      excerpt: "My journey started with calculating day-of-week algorithms in GW-BASIC at age 13. This personal story covers 11+ years of evolution from hobby programming to building enterprise applications, the technologies I've mastered, and lessons learned along the way.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
      category: "Career",
      publishDate: "2023-11-10",
      readTime: "8 min read",
      views: 3200,
      likes: 187,
      comments: 34,
      featured: true,
      slug: "gwbasic-programmer-to-enterprise-developer",
      tags: ["Career", "Programming", "Personal Story", "GW-BASIC", "Web Development"]
    }
  ];

  const recentPosts = [
    {
      title: "BlindSight: Building Accessibility-First Web Applications",
      excerpt: "How I developed a social platform for visually impaired users, focusing on screen reader compatibility, WCAG 2.1 AA compliance, and accessible Angular components. Real-world accessibility implementation insights.",
      category: "Accessibility",
      publishDate: "2023-11-08",
      readTime: "10 min read",
      views: 1650,
      slug: "blindsight-accessibility-first-web-applications",
      tags: ["Angular", "Accessibility", "WCAG", "Social Impact", "Screen Readers"]
    },
    {
      title: "Advanced RxJS Patterns in Enterprise Angular Applications",
      excerpt: "Complex reactive programming patterns I used at EAGLE6 for handling real-time data streams, error handling, and memory management in large-scale Angular applications. Practical examples included.",
      category: "RxJS",
      publishDate: "2023-11-05",
      readTime: "15 min read",
      views: 2100,
      slug: "advanced-rxjs-patterns-enterprise-angular",
      tags: ["RxJS", "Angular", "Reactive Programming", "Enterprise", "Memory Management"]
    },
    {
      title: "PYDI: Building a Cross-Platform Distributed File System",
      excerpt: "Technical deep-dive into developing a Python-based distributed file system. Architecture decisions, challenges with cross-platform compatibility, and lessons learned from building developer tools.",
      category: "Python",
      publishDate: "2023-11-02",
      readTime: "12 min read",
      views: 1850,
      slug: "pydi-cross-platform-distributed-file-system",
      tags: ["Python", "File Systems", "Distributed Systems", "Open Source", "Cross-Platform"]
    },
    {
      title: "State Management Evolution: From Redux to Akita in Angular",
      excerpt: "Why we migrated from Redux to Akita at EAGLE6 for managing complex application state. Performance benefits, developer experience improvements, and migration strategies for large codebases.",
      category: "State Management",
      publishDate: "2023-10-28",
      readTime: "9 min read",
      views: 1920,
      slug: "state-management-evolution-redux-to-akita",
      tags: ["Akita", "Angular", "State Management", "Redux", "Migration"]
    },
    {
      title: "Freelancing Journey: From Local PHP Projects to International Clients",
      excerpt: "My transition from local web development projects to working with international clients on Upwork. Strategies for building trust, delivering quality work, and scaling freelance income from $500 to $3000+ monthly.",
      category: "Freelancing",
      publishDate: "2023-10-25",
      readTime: "7 min read",
      views: 2650,
      slug: "freelancing-journey-local-to-international",
      tags: ["Freelancing", "Upwork", "Client Management", "Business Growth", "Remote Work"]
    },
    {
      title: "E-commerce Evolution: OpenCart Extensions to Modern JAMstack",
      excerpt: "From building custom OpenCart modules to developing modern e-commerce solutions. My experience with Goggle Hunt (Shopify dropshipping store) and transitioning to headless commerce architectures.",
      category: "E-commerce",
      publishDate: "2023-10-20",
      readTime: "11 min read",
      views: 1750,
      slug: "ecommerce-evolution-opencart-to-jamstack",
      tags: ["E-commerce", "OpenCart", "Shopify", "JAMstack", "Headless Commerce"]
    }
  ];

  const categories = [
    { name: "Angular", count: 12, color: "bg-red-100 text-red-800" },
    { name: "Career", count: 8, color: "bg-blue-100 text-blue-800" },
    { name: "TypeScript", count: 10, color: "bg-blue-100 text-blue-800" },
    { name: "Python", count: 6, color: "bg-green-100 text-green-800" },
    { name: "Enterprise", count: 9, color: "bg-purple-100 text-purple-800" },
    { name: "Open Source", count: 7, color: "bg-yellow-100 text-yellow-800" },
    { name: "Freelancing", count: 5, color: "bg-indigo-100 text-indigo-800" },
    { name: "Accessibility", count: 4, color: "bg-green-100 text-green-800" },
    { name: "E-commerce", count: 6, color: "bg-pink-100 text-pink-800" },
    { name: "State Management", count: 8, color: "bg-purple-100 text-purple-800" }
  ];

  const blogStats = [
    { label: "Technical Articles", value: "48+", icon: BookOpen },
    { label: "Monthly Readers", value: "3.2K+", icon: Users },
    { label: "Developer Engagement", value: "12.8%", icon: Heart },
    { label: "Community Reach", value: "16K+", icon: TrendingUp }
  ];

  const monetizationFeatures = [
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
  ];

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

        {/* Blog Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {blogStats.map((stat, index) => (
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

        {/* Featured Posts */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Star className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Featured Articles</h3>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredPosts.map((post, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-primary/20">
                <div className="overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">{post.category}</Badge>
                    <Badge variant="outline">Featured</Badge>
                  </div>
                  <CardTitle className="text-xl leading-tight hover:text-primary transition-colors cursor-pointer">
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
                        {new Date(post.publishDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views.toLocaleString()}
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
                    <Button size="sm">
                      Read Article
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Posts Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8">Recent Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
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

        {/* Categories */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8">Content Categories</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <div key={index} className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:shadow-md transition-shadow ${category.color}`}>
                {category.name} ({category.count})
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
            {monetizationFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{feature.price}</div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {item}
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

        {/* Community Engagement */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join the Developer Community</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Connect with fellow developers, get answers to technical questions, and stay updated 
              with the latest in Angular, accessibility, and enterprise development practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Discord Community
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Follow on LinkedIn
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Blog;
