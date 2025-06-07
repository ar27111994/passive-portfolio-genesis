
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

const Monetization = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Support My Work</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help me continue creating valuable content and open source projects
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Patreon Support */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Monthly Support</CardTitle>
              <CardDescription>
                Support my ongoing work with a monthly contribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Badge variant="default" className="mb-4">Popular Choice</Badge>
                <p className="text-sm text-muted-foreground mb-4">
                  Get exclusive content, early access to projects, and direct support
                </p>
              </div>
              <Button className="w-full" asChild>
                <a href="https://patreon.com/ar27111994" target="_blank" rel="noopener noreferrer">
                  Become a Patron
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* GitHub Sponsors */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">GitHub Sponsors</CardTitle>
              <CardDescription>
                Sponsor my open source contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Direct support for open source development and community projects
                </p>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://github.com/sponsors/ar27111994" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  Sponsor on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* One-time Donation */}
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">One-time Support</CardTitle>
              <CardDescription>
                Show appreciation with a one-time contribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Perfect for showing appreciation for specific projects or tutorials
                </p>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://thanks.dev/d/gh/ar27111994" target="_blank" rel="noopener noreferrer">
                  Send Thanks
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Freelance Services */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Hire Me for Your Project</CardTitle>
              <CardDescription className="text-lg">
                Available for freelance web development projects
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Looking for a skilled developer for your next project? I offer custom web development 
                services specializing in React, full-stack applications, and modern web technologies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="https://www.upwork.com/freelancers/~0188baee67e8f543e7" target="_blank" rel="noopener noreferrer">
                    View Upwork Profile
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#contact">
                    Get in Touch
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Monetization;
