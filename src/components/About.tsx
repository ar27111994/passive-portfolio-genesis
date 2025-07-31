import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Award, Users, Code2, Briefcase } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Calendar,
      title: "11+ Years Experience",
      description: "Started programming at age 13 with GW-BASIC, evolved into full-stack enterprise development"
    },
    {
      icon: Briefcase,
      title: "Enterprise Experience",
      description: "4+ years at EAGLE6 developing cybersecurity platforms for large enterprises"
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "Reached 16,000+ developers through StackOverflow contributions and open-source projects"
    },
    {
      icon: Award,
      title: "Technical Leadership",
      description: "Interviewed and hired frontend developers, drove code quality standards and architecture"
    }
  ];

  const coreCompetencies = [
    { area: "Frontend Development", level: 95, technologies: ["Angular 2+", "React", "Next.js", "TypeScript", "RxJS", "Angular Material", "Ionic"] },
    { area: "Backend Development", level: 90, technologies: ["C#", "ASP.NET MVC", "PHP", "Python", "CodeIgniter", "WordPress"] },
    { area: "E-commerce & CMS", level: 88, technologies: ["OpenCart", "WordPress", "Shopify", "WooCommerce"] },
    { area: "State Management", level: 92, technologies: ["Akita", "Redux", "Flux", "RxJS"] },
    { area: "Web Standards & SEO", level: 90, technologies: ["WCAG Compliance", "SEO Best Practices", "Web Accessibility", "Performance Optimization"] },
    { area: "Database & Tools", level: 88, technologies: ["SQL Server", "Entity Framework", "MySQL", "Jest", "SCSS"] }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A passionate Full Stack Developer from Rawalpindi, Pakistan, dedicated to creating scalable, 
            efficient solutions for enterprise-grade applications with over a decade of programming expertise.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Professional Summary */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Professional Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">From GW-BASIC to Enterprise Solutions</h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    My programming journey began at age 13 with GW-BASIC, creating programs that could calculate 
                    the day of the week for any date in the 20th or 21st century. This early passion for 
                    problem-solving evolved into expertise in modern web technologies and enterprise development.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Over 11 years, I've specialized in collaborating with Enterprise customers to gather requirements, 
                    produce plans, and improve designs for usability and functionality. My background includes 
                    implementing designs for Enterprise Web Applications in Agile environments.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">EAGLE6 Experience (2018-2022)</h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    At EAGLE6, I led frontend development for their flagship cybersecurity product, implementing:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Cloud Storage and Organization Chart Modeling modules with rich text document editing
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Complex plugin-based online editors supporting Microsoft Office files
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Network monitoring tools with d3, Highcharts, and interactive visualizations
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Scalable state management using Akita (Redux/Flux patterns)
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Freelance & Open Source</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    As a freelancer (2017-2018), I delivered solo projects efficiently while contributing to 
                    open-source libraries. I've also founded and sold a successful Shopify dropship store 
                    (Goggle Hunt) targeting U.S. and European markets, demonstrating entrepreneurial skills 
                    alongside technical expertise.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Core Competencies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  Core Competencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {coreCompetencies.map((competency, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{competency.area}</h4>
                        <span className="text-sm text-muted-foreground">{competency.level}%</span>
                      </div>
                      <Progress value={competency.level} className="h-2 mb-3" />
                      <div className="flex flex-wrap gap-2">
                        {competency.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Highlights & Personal Info */}
          <div className="space-y-6">
            {highlights.map((highlight, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <highlight.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{highlight.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span>Rawalpindi, Pakistan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Languages</span>
                  <span>English (Professional)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span>11+ Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span>Freelance Projects</span>
                </div>
              </CardContent>
            </Card>

            {/* Certifications Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-l-2 border-primary pl-3">
                    <h4 className="font-medium text-sm">Deep Neural Networks</h4>
                    <p className="text-xs text-muted-foreground">Coursera • May 2019</p>
                  </div>
                  <div className="border-l-2 border-primary pl-3">
                    <h4 className="font-medium text-sm">Neural Networks & Deep Learning</h4>
                    <p className="text-xs text-muted-foreground">Coursera • April 2019</p>
                  </div>
                  <div className="border-l-2 border-primary pl-3">
                    <h4 className="font-medium text-sm">Introduction to Big Data</h4>
                    <p className="text-xs text-muted-foreground">Coursera • October 2018</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
