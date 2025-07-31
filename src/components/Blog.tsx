
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      title: "Entity Framework Core Alternate Key Updates",
      excerpt: "Deep dive into solving alternate key update issues in Entity Framework Core 1.0, including practical solutions and workarounds for common database update scenarios.",
      date: "2016-04-05",
      readTime: "8 min read",
      tags: ["Entity Framework", "C#", ".NET Core"],
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop"
    },
    {
      title: "ASP.NET Core MVC Scaffolding in Multi-Project Solutions",
      excerpt: "Complete guide to setting up and troubleshooting scaffolding in .NET Core projects with multiple project structures and complex architectures.",
      date: "2016-06-14",
      readTime: "6 min read",
      tags: ["ASP.NET Core", "MVC", "Scaffolding"],
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop"
    },
    {
      title: "Building Email Template Editors with Mosaico",
      excerpt: "Learn how to integrate Mosaico WYSIWYG email editor with CodeIgniter backend for professional email marketing solutions and bulk email campaigns.",
      date: "2017-03-15",
      readTime: "12 min read",
      tags: ["PHP", "CodeIgniter", "Email Marketing", "JavaScript"],
      image: "https://images.unsplash.com/photo-1596526131839-a13c8a6beb2b?w=400&h=200&fit=crop"
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
