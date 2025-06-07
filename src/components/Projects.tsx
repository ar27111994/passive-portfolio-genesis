
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "Aesthetic Palettes",
      description: "A curated collection of beautiful color palettes for designers and developers. Open source project with community contributions.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=400&fit=crop",
      tags: ["React", "Design", "Open Source"],
      github: "https://github.com/ar27111994",
      demo: "https://opencollective.com/aesthetic-palettes",
      featured: true
    },
    {
      title: "React Components Library",
      description: "A comprehensive library of reusable React components with modern styling and accessibility features.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
      tags: ["React", "TypeScript", "Components"],
      github: "https://github.com/ar27111994",
      demo: "#"
    },
    {
      title: "Full Stack Web Application",
      description: "A modern web application showcasing full-stack development skills with React frontend and Node.js backend.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
      tags: ["React", "Node.js", "MongoDB"],
      github: "https://github.com/ar27111994",
      demo: "#"
    },
    {
      title: "Open Source Contributions",
      description: "Various contributions to popular open source projects, helping improve the developer ecosystem.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=400&fit=crop",
      tags: ["Open Source", "JavaScript", "Community"],
      github: "https://github.com/ar27111994",
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
