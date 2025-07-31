
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "Aesthetic Palettes",
      description: "Open-source color palette generator with zero-cost infrastructure. Built with TypeScript and deployed on Vercel, featuring modern UI and responsive design.",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=400&fit=crop",
      tags: ["TypeScript", "React", "Vercel", "UI/UX"],
      github: "https://github.com/ar27111994/Aesthetic-Palettes",
      demo: "https://aesthetic-palettes.vercel.app",
      featured: true
    },
    {
      title: "Mosaico Email Template Editor",
      description: "CodeIgniter integration for Mosaico, an open source WYSIWYG Email Template Editor with Ion Auth 2 and Email Queue System for bulk email marketing.",
      image: "https://images.unsplash.com/photo-1596526131839-a13c8a6beb2b?w=800&h=400&fit=crop",
      tags: ["PHP", "CodeIgniter", "JavaScript", "Email Marketing"],
      github: "https://github.com/ar27111994/Mosaico-CodeIgniter-Ion-Auth",
      demo: "http://mosaicoci.ar27111994.com/"
    },
    {
      title: "PHP Bookstore Application",
      description: "A comprehensive web-based bookstore application featuring user authentication, shopping cart functionality, and admin panel for managing books and users.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      tags: ["PHP", "MySQL", "Authentication", "E-commerce"],
      github: "https://github.com/ar27111994/bookstore",
      demo: "#"
    },
    {
      title: "Generic Repository Pattern",
      description: "A completely generic C.R.U.D. Repository built on top of Entity Framework that can be used with dependency injection containers for clean architecture.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
      tags: ["C#", "Entity Framework", "Design Patterns", ".NET"],
      github: "https://github.com/ar27111994/Generic-Repository-Pattern",
      demo: "#"
    }
  ];

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and contributions to the developer community
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className={`group hover:shadow-lg transition-all duration-300 ${project.featured ? 'md:col-span-2' : ''}`}>
              <div className="overflow-hidden rounded-t-lg">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                    <CardDescription className="text-base">{project.description}</CardDescription>
                  </div>
                  {project.featured && (
                    <Badge variant="default" className="ml-2">Featured</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/ar27111994" target="_blank" rel="noopener noreferrer">
              View All Projects on GitHub
              <Github className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
