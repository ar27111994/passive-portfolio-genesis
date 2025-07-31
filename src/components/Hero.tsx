import { ArrowRight, Github, Linkedin, Mail, Code, Award, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="animate-fade-in text-center lg:text-left">
            <div className="mb-6">
              <Badge variant="outline" className="mb-4">
                Available for Freelance Projects
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Ahmed Rehan
              </h1>
              <h2 className="text-2xl md:text-3xl text-primary font-semibold mb-4">
                Frontend Developer & Enterprise Solutions Expert
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
                Frontend Angular Developer from Pakistan with 11+ years of experience creating successful web and mobile applications.
                Specialized in enterprise applications, collaborating with clients to gather requirements and improve designs for usability and functionality.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">11+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4+</div>
                <div className="text-sm text-muted-foreground">Years at EAGLE6</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">556</div>
                <div className="text-sm text-muted-foreground">StackOverflow Rep</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
              <Button size="lg" className="group w-full sm:w-auto" asChild>
                <a href="#projects">
                  View My Work
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <a href="#contact">
                  Start a Project
                  <Mail className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
            
            {/* Social Links */}
            <div className="flex justify-center lg:justify-start space-x-6">
              <a 
                href="https://github.com/ar27111994" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:scale-110 transform"
                title="GitHub Profile"
              >
                <Github className="w-6 h-6" />
              </a>
              <a 
                href="https://linkedin.com/in/ar27111994" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:scale-110 transform"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a 
                href="https://stackoverflow.com/users/3841610/ar27111994" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:scale-110 transform"
                title="StackOverflow Profile - 556 Reputation"
              >
                <Code className="w-6 h-6" />
              </a>
              <a 
                href="https://patreon.com/ar27111994" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:scale-110 transform"
                title="Support on Patreon"
              >
                <Award className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Right Column - Achievement Cards */}
          <div className="space-y-4 lg:ml-8">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">EAGLE6 Frontend Engineer</h3>
                    <p className="text-sm text-muted-foreground">Feb 2018 - Mar 2022</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Led frontend development for cybersecurity enterprise products, implementing complex 
                  cloud storage, organization charts, and document editing systems with Angular & TypeScript.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">StackOverflow Contributor</h3>
                    <p className="text-sm text-muted-foreground">556 Reputation • 11 Years</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Active community member helping developers with C#, ASP.NET MVC, and Entity Framework. 
                  Reached 16,000+ people with quality contributions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Github className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Open Source Projects</h3>
                    <p className="text-sm text-muted-foreground">24 Repositories • 39 Stars</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Diverse portfolio spanning AI, accessibility tools, e-commerce, and enterprise applications. 
                  Notable projects include BlindSight and distributed file systems.
                </p>
              </CardContent>
            </Card>

            {/* Technology Stack Preview */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Primary Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {["Angular", "TypeScript", "C#", "ASP.NET", "PHP", "Python", "React"].map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
