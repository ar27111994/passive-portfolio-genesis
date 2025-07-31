import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye, Heart, MessageCircle, Share2, BookOpen, TrendingUp, Star, Users } from "lucide-react";

const Blog = () => {
  const featuredPosts = [
    {
      title: "Building Enterprise Angular Applications: Lessons from EAGLE6",
      excerpt: "Deep dive into architecting scalable Angular applications for enterprise cybersecurity platforms. Learn about state management, performance optimization, and team collaboration strategies.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
      category: "Angular",
      publishDate: "2024-01-15",
      readTime: "12 min read",
      views: 2840,
      likes: 156,
      comments: 23,
      featured: true,
      slug: "enterprise-angular-applications-eagle6-lessons",
      tags: ["Angular", "Enterprise", "TypeScript", "State Management", "Performance"]
    },
    {
      title: "From GW-BASIC to Modern Web Development: A 11-Year Journey",
      excerpt: "My programming evolution from a 13-year-old writing GW-BASIC programs to developing enterprise applications. Key lessons, technologies learned, and career insights.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
      category: "Career",
      publishDate: "2024-01-10",
      readTime: "8 min read",
      views: 3200,
      likes: 187,
      comments: 34,
      featured: true,
      slug: "gwbasic-to-modern-web-development-journey",
      tags: ["Career", "Programming", "Journey", "Learning", "Web Development"]
    }
  ];

  const recentPosts = [
    {
      title: "Implementing Accessibility in Angular Applications: BlindSight Project Insights",
      excerpt: "Technical deep-dive into building accessibility-first applications, drawing from my BlindSight project experience.",
      category: "Accessibility",
      publishDate: "2024-01-08",
      readTime: "10 min read",
      views: 1650,
      slug: "accessibility-angular-blindsight-insights",
      tags: ["Angular", "Accessibility", "Social Impact", "UX"]
    },
    {
      title: "Mastering RxJS in Enterprise Applications",
      excerpt: "Advanced RxJS patterns and operators used in real-world enterprise applications at EAGLE6.",
      category: "RxJS",
      publishDate: "2024-01-05",
      readTime: "15 min read",
      views: 2100,
      slug: "mastering-rxjs-enterprise-applications",
      tags: ["RxJS", "Angular", "Reactive Programming", "Enterprise"]
    },
    {
      title: "Building a Multi-Platform File System with Python",
      excerpt: "Architecture decisions and implementation details for the PYDI distributed file system project.",
      category: "Python",
      publishDate: "2024-01-02",
      readTime: "12 min read",
      views: 1850,
      slug: "multiplatform-file-system-python-pydi",
      tags: ["Python", "File Systems", "Architecture", "Open Source"]
    },
    {
      title: "State Management with Akita: Redux Alternative for Angular",
      excerpt: "Why we chose Akita over traditional Redux for large-scale Angular applications and implementation strategies.",
      category: "State Management",
      publishDate: "2023-12-28",
      readTime: "9 min read",
      views: 1920,
      slug: "akita-state-management-angular-redux-alternative",
      tags: ["Akita", "Angular", "State Management", "Redux", "Architecture"]
    },
    {
      title: "Freelancing Success: From Local Projects to International Clients",
      excerpt: "Strategies and lessons learned during my Upwork freelancing journey, including project management and client communication.",
      category: "Freelancing",
      publishDate: "2023-12-25",
      readTime: "7 min read",
      views: 2650,
      slug: "freelancing-success-local-to-international-clients",
      tags: ["Freelancing", "Business", "Career", "Upwork", "Client Management"]
    },
    {
      title: "Building E-commerce Solutions: From OpenCart to Modern Stacks",
      excerpt: "Evolution of e-commerce development approaches, from traditional PHP/OpenCart to modern JAMstack solutions.",
      category: "E-commerce",
      publishDate: "2023-12-20",
      readTime: "11 min read",
      views: 1750,
      slug: "ecommerce-solutions-opencart-modern-stacks",
      tags: ["E-commerce", "OpenCart", "PHP", "JAMstack", "Modern Web"]
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
    { name: "Web Development", count: 15, color: "bg-pink-100 text-pink-800" }
  ];

  const blogStats = [
    { label: "Total Posts", value: "48+", icon: BookOpen },
    { label: "Monthly Readers", value: "12K+", icon: Users },
    { label: "Average Engagement", value: "8.5%", icon: Heart },
    { label: "Newsletter Subscribers", value: "1.2K+", icon: TrendingUp }
  ];

  const monetizationFeatures = [
    {
      title: "Technical Consulting",
      description: "1-on-1 consulting sessions for Angular, enterprise architecture, and full-stack development challenges.",
      price: "From $150/hour",
      features: ["Architecture Review", "Code Audits", "Team Training", "Technical Strategy"]
    },
    {
      title: "Premium Content",
      description: "In-depth tutorials, advanced patterns, and exclusive case studies from enterprise projects.",
      price: "From $29/month",
      features: ["Advanced Tutorials", "Source Code Access", "Monthly Live Sessions", "Private Discord"]
    },
    {
      title: "Course Development",
      description: "Comprehensive video courses on Angular, TypeScript, and enterprise development best practices.",
      price: "Coming Soon",
      features: ["Video Content", "Hands-on Projects", "Certification", "Community Access"]
    }
  ];

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Technical Blog & Content</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sharing insights from 11+ years of development experience, enterprise projects, 
            and open-source contributions. Practical tutorials, career advice, and technical deep-dives.
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
                      Read More
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

        {/* Monetization Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Premium Services & Content</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take your development skills to the next level with personalized consulting, 
              premium content, and comprehensive courses.
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
                    {feature.price === "Coming Soon" ? "Get Notified" : "Learn More"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get the latest articles, tutorials, and insights delivered to your inbox. 
              Join 1,200+ developers who trust my content for their growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              No spam. Unsubscribe anytime. Read our privacy policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Blog;
