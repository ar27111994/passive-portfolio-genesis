import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Star, GitFork, Eye, Award } from "lucide-react";

const Projects = () => {
  const featuredProjects = [
    {
      title: "OpenCart 3.x Extensions",
      description: "Collection of OpenCart extensions including a 3-level menu system and SMS order alert system with customized admin emails specifically designed for Indian merchants.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
      tags: ["PHP", "OpenCart", "E-commerce", "Extensions", "SMS Integration"],
      github: "https://github.com/ar27111994",
      demo: "#",
      featured: true,
      category: "E-commerce"
    },
    {
      title: "National Criminals Database",
      description: "A WCF project demonstrating ASP.NET MVC and WCF best practices using N-Layered Architecture. Includes web client contracts, services, unit tests, and hosted WCF services.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop",
      tags: ["ASP.NET MVC", "WCF", "C#", "N-Layered Architecture", "Entity Framework"],
      github: "https://github.com/ar27111994",
      demo: "#",
      category: "Enterprise Systems"
    },
    {
      title: "OpenBiz Supply Chain Management",
      description: "An open source and intelligently-built supply chain management system featuring complete business workflow management with modern UI and robust backend architecture.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=400&fit=crop",
      tags: ["ASP.NET MVC", "Entity Framework", "C#", "jQuery", "Bootstrap", "CKEditor"],
      github: "https://github.com/ar27111994",
      demo: "#",
      category: "Enterprise Systems"
    }
  ];

  const enterpriseProjects = [
    {
      title: "Aesthetic Palettes",
      description: "Open-source color palette generator with zero-cost infrastructure. Built with TypeScript and deployed on Vercel, featuring modern UI and responsive design.",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=400&fit=crop",
      tags: ["TypeScript", "React", "Vercel", "UI/UX", "Open Source"],
      github: "https://github.com/ar27111994/Aesthetic-Palettes",
      demo: "https://aesthetic-palettes.vercel.app",
      category: "Web Development"
    },
    {
      title: "Mosaico Email Template Editor",
      description: "CodeIgniter integration for Mosaico WYSIWYG Email Template Editor with Ion Auth 2 and Email Queue System for enterprise bulk email marketing solutions.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop",
      tags: ["PHP", "CodeIgniter", "JavaScript", "Email Marketing", "Enterprise"],
      github: "https://github.com/ar27111994/Mosaico-CodeIgniter-Ion-Auth",
      demo: "http://mosaicoci.ar27111994.com/",
      category: "Enterprise Solutions"
    },
    {
      title: "Generic Repository Pattern",
      description: "A completely generic C.R.U.D. Repository built on top of Entity Framework that can be used with dependency injection containers for clean architecture.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
      tags: ["C#", "Entity Framework", "Design Patterns", ".NET", "Architecture"],
      github: "https://github.com/ar27111994/Generic-Repository-Pattern",
      demo: "#",
      category: "Architecture"
    },
    {
      title: "CRUD Scaffolding Templates",
      description: "Complete C.R.U.D. scaffolding templates with AJAXified searching, sorting, paging, and import/export functionality for Excel & CSV files. Built with Generic Repository Pattern on Entity Framework 6.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      tags: ["ASP.NET MVC", "Entity Framework", "AJAX", "Generic Repository", "Excel Export"],
      github: "https://github.com/ar27111994",
      demo: "#",
      category: "Development Tools"
    },
    {
      title: "Bookstore Application",
      description: "A full-featured & SEO-friendly bookstore with admin panel built with vanilla PHP. Features modern design implemented from PSD template with complete e-commerce functionality.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
      tags: ["PHP", "MySQL", "JavaScript", "Bootstrap", "SEO", "E-commerce"],
      github: "https://github.com/ar27111994/bookstore",
      demo: "#",
      category: "E-commerce"
    },
    {
      title: "Shopping Cart Library",
      description: "A PHP class for creating shopping carts with complete CRUD operations. Used by hundreds of developers on phpclasses.org community for e-commerce implementations.",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop",
      tags: ["PHP", "Library", "E-commerce", "CRUD", "Session Management"],
      github: "https://github.com/ar27111994/shopping-cart",
      demo: "#",
      category: "Libraries"
    }
  ];

  const openSourceContributions = [
    {
      title: "PHP Bookstore Application",
      description: "Full-featured SEO-friendly bookstore with admin panel built with vanilla PHP. Demonstrates e-commerce development skills and clean PHP architecture.",
      tags: ["PHP", "MySQL", "E-commerce", "SEO"],
      github: "https://github.com/ar27111994/bookstore"
    },
    {
      title: "Shopping Cart Library",
      description: "PHP class for creating shopping carts with complete CRUD operations. Used by hundreds of developers on phpclasses.org community.",
      tags: ["PHP", "Library", "E-commerce", "Community"],
      github: "https://github.com/ar27111994/shopping-cart"
    },
    {
      title: "OpenCart Extensions",
      description: "Multiple OpenCart extensions including 3-level menu system and SMS order alerts with customized admin emails for Indian merchants.",
      tags: ["PHP", "OpenCart", "E-commerce", "Extensions"],
      github: "https://github.com/ar27111994"
    }
  ];

  const projectCategories = [
    "All", "Social Impact", "Enterprise Solutions", "AI & Data Science", 
    "System Development", "Web Development", "Browser Extensions"
  ];

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive showcase of my work spanning enterprise applications, open-source contributions, 
            AI projects, and social impact solutions. Each project reflects my commitment to quality, 
            innovation, and community benefit.
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-8">
            <Award className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Highlighted Projects</h3>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-primary/20">
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
                      <Badge variant="outline" className="mb-3">{project.category}</Badge>
                      <CardDescription className="text-base leading-relaxed">
                        {project.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    {project.demo !== "#" && (
                      <Button size="sm" asChild>
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enterprise & Professional Projects */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-8">Enterprise & Professional Projects</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {enterpriseProjects.map((project, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
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
                      <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                      <Badge variant="outline" className="mb-3 text-xs">{project.category}</Badge>
                      <CardDescription className="text-sm leading-relaxed">
                        {project.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    {project.demo !== "#" && (
                      <Button size="sm" asChild>
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Source Contributions */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-8">Open Source Contributions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {openSourceContributions.map((project, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View Source
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* GitHub Stats */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">GitHub Statistics</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24</div>
                  <div className="text-sm text-muted-foreground">Public Repositories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">39</div>
                  <div className="text-sm text-muted-foreground">Total Stars</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">6+</div>
                  <div className="text-sm text-muted-foreground">Programming Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Active</div>
                  <div className="text-sm text-muted-foreground">Contributing Since 2014</div>
                </div>
              </div>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <a href="https://github.com/ar27111994" target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 mr-2" />
                    View All Projects on GitHub
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Projects;
