
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      title: "Building Scalable React Applications",
      excerpt: "Best practices and patterns for creating maintainable React applications that can grow with your business needs.",
      date: "2024-01-15",
      readTime: "8 min read",
      tags: ["React", "Architecture", "Best Practices"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop"
    },
    {
      title: "Modern JavaScript Features Every Developer Should Know",
      excerpt: "Exploring the latest JavaScript features that can improve your code quality and developer productivity.",
      date: "2024-01-10",
      readTime: "6 min read",
      tags: ["JavaScript", "ES6+", "Development"],
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=200&fit=crop"
    },
    {
      title: "Contributing to Open Source: A Beginner's Guide",
      excerpt: "Learn how to start contributing to open source projects and make a meaningful impact in the developer community.",
      date: "2024-01-05",
      readTime: "10 min read",
      tags: ["Open Source", "Community", "Career"],
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop"
    }
  ];

  return (
    <section id="blog" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Latest Blog Posts</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sharing knowledge and insights about web development and technology
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="overflow-hidden rounded-t-lg">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-muted-foreground">{post.date}</span>
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="p-0 h-auto group-hover:text-primary">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            <Book className="w-4 h-4 mr-2" />
            View All Posts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
