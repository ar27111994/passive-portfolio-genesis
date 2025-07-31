
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: [
        { name: "JavaScript", level: 92, color: "bg-yellow-500" },
        { name: "HTML/CSS", level: 95, color: "bg-orange-500" },
        { name: "jQuery", level: 88, color: "bg-blue-600" },
        { name: "Knockout.js", level: 85, color: "bg-red-500" }
      ]
    },
    {
      title: "Backend Development",
      skills: [
        { name: "C#", level: 95, color: "bg-purple-600" },
        { name: "ASP.NET MVC", level: 90, color: "bg-blue-500" },
        { name: "PHP", level: 88, color: "bg-purple-500" },
        { name: "CodeIgniter", level: 85, color: "bg-red-600" }
      ]
    },
    {
      title: "Database & Tools",
      skills: [
        { name: "SQL Server", level: 88, color: "bg-blue-400" },
        { name: "Entity Framework", level: 85, color: "bg-green-500" },
        { name: "Git", level: 90, color: "bg-red-500" },
        { name: "Adobe Photoshop", level: 82, color: "bg-blue-600" }
      ]
    }
  ];

  const technologies = [
    "C#", "ASP.NET MVC", "ASP.NET Core", "Entity Framework", "PHP", "CodeIgniter", 
    "JavaScript", "jQuery", "HTML5", "CSS3", "SQL Server", "MySQL", "Git", 
    "Xamarin", "Adobe Photoshop", "Adobe Illustrator", "WordPress", "Ion Auth", 
    "Knockout.js", "Node.js", "TypeScript", "Email Marketing", "WYSIWYG Editors"
  ];

  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((category, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Technologies I Work With</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Skills;
