import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Database, Cloud, Palette, Award, TrendingUp } from "lucide-react";

const Skills = () => {
  const frontendSkills = [
    { name: "Angular 2+", level: 95, years: "5+", description: "Enterprise applications, EAGLE6 projects" },
    { name: "TypeScript", level: 92, years: "5+", description: "Type-safe development, large codebases" },
    { name: "JavaScript", level: 90, years: "11+", description: "ES6+, modern frameworks, browser APIs" },
    { name: "RxJS", level: 88, years: "4+", description: "Reactive programming, async operations" },
    { name: "Angular Material", level: 90, years: "4+", description: "UI component library, design systems" },
    { name: "HTML5/CSS3", level: 95, years: "11+", description: "Semantic markup, responsive design" },
    { name: "SCSS/Sass", level: 88, years: "6+", description: "Advanced styling, BEM methodology" },
    { name: "jQuery", level: 85, years: "8+", description: "DOM manipulation, legacy support" },
    { name: "React", level: 80, years: "2+", description: "Modern component development" },
    { name: "D3.js", level: 75, years: "3+", description: "Data visualization, interactive charts" }
  ];

  const backendSkills = [
    { name: "C#", level: 95, years: "8+", description: "Enterprise applications, clean architecture" },
    { name: "ASP.NET MVC", level: 92, years: "7+", description: "Web applications, RESTful APIs" },
    { name: "ASP.NET Core", level: 88, years: "4+", description: "Cross-platform, microservices" },
    { name: "Entity Framework", level: 90, years: "6+", description: "ORM, database-first and code-first" },
    { name: "PHP", level: 88, years: "9+", description: "Web development, CMS solutions" },
    { name: "CodeIgniter", level: 85, years: "6+", description: "MVC framework, rapid development" },
    { name: "WordPress", level: 82, years: "8+", description: "CMS development, custom themes/plugins" },
    { name: "Python", level: 75, years: "3+", description: "AI/ML projects, automation, Flask" },
    { name: "Node.js", level: 70, years: "2+", description: "JavaScript runtime, API development" }
  ];

  const databaseSkills = [
    { name: "SQL Server", level: 90, years: "7+", description: "Enterprise databases, performance tuning" },
    { name: "MySQL", level: 85, years: "9+", description: "Web applications, optimization" },
    { name: "Entity Framework", level: 88, years: "6+", description: "Code-first, migrations, LINQ" },
    { name: "Database Design", level: 82, years: "8+", description: "Normalization, indexing, relationships" }
  ];

  const devopsTools = [
    { name: "Git", level: 90, years: "8+", description: "Version control, branching strategies" },
    { name: "Azure", level: 75, years: "3+", description: "Cloud services, deployment" },
    { name: "Docker", level: 70, years: "2+", description: "Containerization, microservices" },
    { name: "Webpack", level: 75, years: "4+", description: "Module bundling, optimization" },
    { name: "Jest", level: 80, years: "3+", description: "Unit testing, TDD practices" },
    { name: "Apache", level: 75, years: "6+", description: "Web server configuration" }
  ];

  const designTools = [
    { name: "Adobe Photoshop", level: 82, years: "8+", description: "UI design, image editing" },
    { name: "Adobe Illustrator", level: 78, years: "6+", description: "Logo design, vector graphics" },
    { name: "Figma", level: 70, years: "2+", description: "UI/UX design, prototyping" },
    { name: "Material Design", level: 85, years: "4+", description: "Design systems, accessibility" }
  ];

  const specializations = [
    {
      title: "Enterprise Applications",
      icon: Code,
      skills: ["Angular", "TypeScript", "C#", "ASP.NET", "Enterprise Architecture"],
      description: "4+ years at EAGLE6 developing cybersecurity platforms for large enterprises"
    },
    {
      title: "State Management",
      icon: TrendingUp,
      skills: ["Akita", "Redux", "RxJS", "Flux Architecture"],
      description: "Implemented scalable state management for complex enterprise applications"
    },
    {
      title: "Data Visualization",
      icon: Database,
      skills: ["D3.js", "Highcharts", "Charts.js", "Leaflet", "OSM"],
      description: "Interactive charts, graphs, and maps for network monitoring tools"
    },
    {
      title: "Cloud & DevOps",
      icon: Cloud,
      skills: ["Azure", "Docker", "CI/CD", "Git", "Webpack"],
      description: "Cloud deployment, containerization, and modern development workflows"
    }
  ];

  const certifications = [
    {
      title: "Improving Deep Neural Networks",
      issuer: "Coursera",
      date: "May 2019",
      topics: ["Hyperparameter tuning", "Regularization", "Optimization"]
    },
    {
      title: "Neural Networks and Deep Learning",
      issuer: "Coursera", 
      date: "April 2019",
      topics: ["Deep Learning", "Neural Networks", "TensorFlow"]
    },
    {
      title: "Structuring Machine Learning Projects",
      issuer: "Coursera",
      date: "August 2018",
      topics: ["ML Strategy", "Error Analysis", "Transfer Learning"]
    },
    {
      title: "Introduction to Big Data",
      issuer: "Coursera",
      date: "October 2018",
      topics: ["Hadoop", "HDFS", "MapReduce", "Big Data Analytics"]
    }
  ];

  const getRatingColor = (level: number) => {
    if (level >= 90) return "text-green-600";
    if (level >= 80) return "text-blue-600";
    if (level >= 70) return "text-yellow-600";
    return "text-gray-600";
  };

  const getRatingText = (level: number) => {
    if (level >= 90) return "Expert";
    if (level >= 80) return "Advanced";
    if (level >= 70) return "Intermediate";
    return "Beginner";
  };

  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            11+ years of programming experience across frontend, backend, databases, and design. 
            Specialized in enterprise-grade applications and modern web technologies.
          </p>
        </div>

        {/* Skills Categories */}
        <Tabs defaultValue="frontend" className="mb-16">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="backend">Backend</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="devops">DevOps</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
          </TabsList>

          <TabsContent value="frontend" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {frontendSkills.map((skill, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{skill.name}</h4>
                        <Badge variant="outline" className="text-xs">{skill.years}</Badge>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getRatingColor(skill.level)}`}>
                          {getRatingText(skill.level)}
                        </span>
                        <div className="text-xs text-muted-foreground">{skill.level}%</div>
                      </div>
                    </div>
                    <Progress value={skill.level} className="h-2 mb-3" />
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="backend" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {backendSkills.map((skill, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{skill.name}</h4>
                        <Badge variant="outline" className="text-xs">{skill.years}</Badge>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getRatingColor(skill.level)}`}>
                          {getRatingText(skill.level)}
                        </span>
                        <div className="text-xs text-muted-foreground">{skill.level}%</div>
                      </div>
                    </div>
                    <Progress value={skill.level} className="h-2 mb-3" />
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {databaseSkills.map((skill, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{skill.name}</h4>
                        <Badge variant="outline" className="text-xs">{skill.years}</Badge>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getRatingColor(skill.level)}`}>
                          {getRatingText(skill.level)}
                        </span>
                        <div className="text-xs text-muted-foreground">{skill.level}%</div>
                      </div>
                    </div>
                    <Progress value={skill.level} className="h-2 mb-3" />
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="devops" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {devopsTools.map((skill, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{skill.name}</h4>
                        <Badge variant="outline" className="text-xs">{skill.years}</Badge>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getRatingColor(skill.level)}`}>
                          {getRatingText(skill.level)}
                        </span>
                        <div className="text-xs text-muted-foreground">{skill.level}%</div>
                      </div>
                    </div>
                    <Progress value={skill.level} className="h-2 mb-3" />
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {designTools.map((skill, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{skill.name}</h4>
                        <Badge variant="outline" className="text-xs">{skill.years}</Badge>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${getRatingColor(skill.level)}`}>
                          {getRatingText(skill.level)}
                        </span>
                        <div className="text-xs text-muted-foreground">{skill.level}%</div>
                      </div>
                    </div>
                    <Progress value={skill.level} className="h-2 mb-3" />
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Specializations */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Technical Specializations</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specializations.map((spec, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <spec.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-3">{spec.title}</h4>
                  <div className="flex flex-wrap gap-1 justify-center mb-3">
                    {spec.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{spec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Professional Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{cert.title}</h4>
                    <Badge variant="outline" className="text-xs">{cert.date}</Badge>
                  </div>
                  <div className="text-sm text-primary mb-2">{cert.issuer}</div>
                  <div className="flex flex-wrap gap-1">
                    {cert.topics.map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technology Timeline */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">Technology Evolution Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background rounded border">
                <span className="font-medium">2013-2015: Foundation</span>
                <div className="flex gap-2">
                  <Badge variant="outline">GW-BASIC</Badge>
                  <Badge variant="outline">HTML/CSS</Badge>
                  <Badge variant="outline">jQuery</Badge>
                  <Badge variant="outline">PHP</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded border">
                <span className="font-medium">2015-2017: Web Development</span>
                <div className="flex gap-2">
                  <Badge variant="outline">WordPress</Badge>
                  <Badge variant="outline">CodeIgniter</Badge>
                  <Badge variant="outline">C#</Badge>
                  <Badge variant="outline">ASP.NET</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded border">
                <span className="font-medium">2018-2022: Enterprise Focus</span>
                <div className="flex gap-2">
                  <Badge variant="outline">Angular</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">RxJS</Badge>
                  <Badge variant="outline">Azure</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded border">
                <span className="font-medium">2022-Present: Modern Stack</span>
                <div className="flex gap-2">
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">Python/AI</Badge>
                  <Badge variant="outline">Docker</Badge>
                  <Badge variant="outline">Cloud Native</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Skills;
