import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Calendar, MapPin, Award, TrendingUp, Users, Code, ExternalLink } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "Frontend Developer",
      company: "EAGLE6",
      period: "February 2018 - March 2022",
      duration: "4 years 2 months",
      location: "Remote",
      type: "Full-time",
      description: "Led frontend development for EAGLE6's flagship cybersecurity product that secures large enterprises by detecting unknown vulnerabilities. Implemented complex enterprise modules in an Agile-driven environment.",
      achievements: [
        "Implemented Frontend for Cloud Storage and Organization Chart Modeling Modules with rich text document editing tools and angular-ized plugins",
        "Developed role-based file and folder management system with permissions, preview capabilities, and content editing based on file types",
        "Built complex plugin-based online editors supporting Microsoft Office files with comments, concurrent editing, and PDF export",
        "Implemented chunked file upload using TUS protocol for scalability and large file support",
        "Architected Organization Chart Modeling tool in GOJS with Akita (Redux/Flux) state management for scalability",
        "Developed network monitoring tools with interactive graphs and maps using d3, Highcharts, leaflet, and OSM Tiles",
        "Interviewed and facilitated hiring of multiple Frontend developers",
        "Drove code quality and scalability through Redux/Flux implementation and code reviews",
        "Standardized responsive & accessible UI using Google Material Design standards",
        "Assessed UX/UI designs for technical feasibility and provided implementation estimates"
      ],
      technologies: ["Angular 7+", "Angular Material", "TypeScript", "RxJS", "Akita", "Redux", "GOJS", "D3", "Highcharts", "Leaflet", "OSM", "TUS", "SCSS", "Jest", "BEM"],
      highlights: [
        "Enterprise Product Development",
        "Team Leadership",
        "Architecture Design",
        "Performance Optimization"
      ]
    },
    {
      title: "Freelance Full Stack Engineer",
      company: "Upwork",
      period: "May 2017 - February 2018",
      duration: "10 months",
      location: "Remote",
      type: "Freelance",
      description: "Managed and delivered diverse solo projects for international clients, contributing to open-source projects and developing innovative solutions across multiple technologies.",
      achievements: [
        "Delivered solo projects as freelance contractor in timely and efficient manner",
        "Created multiple free and open-source projects based on client work (with consent)",
        "Contributed bugfixes to open-source libraries to solve client project issues",
        "Converted mockups into responsive HTML, JavaScript, AJAX, and JSON implementations",
        "Developed Microsoft Remote Desktop Services project with Citrix App Layering on Azure",
        "Fixed, maintained, and extended existing projects from other developers",
        "Created fully-featured mobile apps with REST APIs and databases using Ionic 3, Angular 5+, PHP, MySQL",
        "Integrated mobile-specific features like camera access and payment gateways using Apache Cordova",
        "Deployed and managed web and mobile backends using UNIX and Apache servers"
      ],
      technologies: ["Angular", "Ionic", "TypeScript", "PHP", "WordPress", "OpenCart", "C#", "SQL", "jQuery", "JavaScript", "Azure", "Apache Cordova", "MySQL"],
      highlights: [
        "Client Project Management",
        "Full Stack Development",
        "Open Source Contributions",
        "Cross-Platform Development"
      ]
    },
    {
      title: "Solo Owner/Founder",
      company: "Goggle Hunt",
      period: "May 2017 - September 2017",
      duration: "5 months",
      location: "Remote",
      type: "Entrepreneurship",
      description: "Founded and successfully operated a Shopify dropship store selling fashion and sports goggles, targeting U.S. and European markets with 600k monthly searches and low competition.",
      achievements: [
        "Created, maintained, and marketed Shopify store from concept to sale",
        "Ran day-to-day operations for 4 months while working as freelance developer",
        "Conducted Instagram influencer interviews and giveaway competitions for marketing",
        "Built and managed four different social media accounts reaching hundreds of followers each",
        "Collected approximately 150 emails and subscribers through Gleam competitions",
        "Created Facebook Merchant Account with integrated shop products for direct purchasing",
        "Successfully sold the complete business on Flippa to focus on software development career"
      ],
      technologies: ["Shopify", "E-commerce", "Digital Marketing", "Social Media", "Facebook Merchant", "Gleam", "Instagram Marketing"],
      highlights: [
        "Business Development",
        "E-commerce Management",
        "Digital Marketing",
        "Successful Exit"
      ],
      businessMetrics: [
        "600k monthly searches in target keywords",
        "Low competition market positioning",
        "150+ email subscribers",
        "Multiple social media accounts",
        "Successful business sale on Flippa"
      ]
    },
    {
      title: "Web Developer",
      company: "Genius Marketing INNovationS (GMINNS)",
      period: "July 2015 - April 2016",
      duration: "10 months",
      location: "On-site",
      type: "Full-time",
      description: "Worked on customization of School Management System and sports federation portals, developing tailored solutions based on specific customer requirements.",
      achievements: [
        "Customized School Management System based on customer demands",
        "Developed Saudi football federation club management portal",
        "Implemented customer-specific features and functionality",
        "Maintained and enhanced existing system architecture"
      ],
      technologies: ["PHP", "MySQL", "JavaScript", "HTML5", "CSS3", "Custom CMS"],
      highlights: [
        "Custom Development",
        "Educational Software",
        "Sports Management Systems"
      ]
    },
    {
      title: "Web Developer (WordPress & OpenCart)",
      company: "COMITS",
      period: "July 2014 - March 2015",
      duration: "9 months",
      location: "On-site",
      type: "Full-time",
      description: "Specialized in WordPress development for local businesses and e-commerce solutions using OpenCart platform.",
      achievements: [
        "Built WordPress sites for local newspaper and printing shop",
        "Developed comprehensive e-commerce website (wecanwear.com) using OpenCart",
        "Customized themes and plugins for specific client requirements",
        "Implemented responsive designs and user-friendly interfaces"
      ],
      technologies: ["WordPress", "OpenCart", "PHP", "MySQL", "JavaScript", "CSS3", "HTML5"],
      highlights: [
        "WordPress Development",
        "E-commerce Solutions",
        "Local Business Focus"
      ]
    }
  ];

  const skillEvolution = [
    { period: "2014-2015", focus: "WordPress & OpenCart", level: "Junior" },
    { period: "2015-2016", focus: "PHP & Custom CMS", level: "Mid-level" },
    { period: "2017", focus: "Full Stack & Entrepreneurship", level: "Senior" },
    { period: "2018-2022", focus: "Enterprise Angular & TypeScript", level: "Senior" },
    { period: "2022-Present", focus: "Modern Web & Open Source", level: "Expert" }
  ];

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Professional Experience</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Over 11 years of professional journey from WordPress development to enterprise-grade 
            cybersecurity applications, showcasing continuous growth and diverse expertise.
          </p>
        </div>

        {/* Career Timeline */}
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-5 h-5 text-primary" />
                      <CardTitle className="text-2xl">{exp.title}</CardTitle>
                    </div>
                    <CardDescription className="text-lg font-medium text-primary mb-2">
                      {exp.company}
                    </CardDescription>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.period} ({exp.duration})
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </div>
                      <Badge variant="outline">{exp.type}</Badge>
                    </div>
                  </div>
                  
                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {exp.highlights.map((highlight, hIndex) => (
                      <Badge key={hIndex} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed text-base">
                  {exp.description}
                </p>
                
                {/* Key Achievements */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Key Achievements & Responsibilities
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {exp.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {achievement}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Metrics (for Goggle Hunt) */}
                {exp.businessMetrics && (
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Business Metrics & Results
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {exp.businessMetrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {metric}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Technologies Used */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Technologies & Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Career Evolution Timeline */}
        <Card className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Career Evolution & Skill Development</CardTitle>
            <CardDescription className="text-center">
              Journey from junior developer to enterprise solutions architect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillEvolution.map((evolution, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{evolution.period}</Badge>
                    <span className="font-medium">{evolution.focus}</span>
                  </div>
                  <Badge variant={evolution.level === 'Expert' ? 'default' : evolution.level === 'Senior' ? 'secondary' : 'outline'}>
                    {evolution.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Recognition */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Community Recognition & Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">556</div>
                <div className="text-sm text-muted-foreground">StackOverflow Reputation</div>
                <div className="text-xs text-muted-foreground mt-1">11 years member</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">16K+</div>
                <div className="text-sm text-muted-foreground">Developers Reached</div>
                <div className="text-xs text-muted-foreground mt-1">Through contributions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24</div>
                <div className="text-sm text-muted-foreground">Open Source Projects</div>
                <div className="text-xs text-muted-foreground mt-1">Public repositories</div>
              </div>
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <a href="https://stackoverflow.com/users/3841610/ar27111994" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View StackOverflow Profile
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Experience;
