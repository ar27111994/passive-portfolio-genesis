
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: [
        { name: "React", level: 95, color: "bg-blue-500" },
        { name: "JavaScript", level: 92, color: "bg-yellow-500" },
        { name: "TypeScript", level: 88, color: "bg-blue-600" },
        { name: "HTML/CSS", level: 90, color: "bg-orange-500" }
      ]
    },
    {
      title: "Backend Development",
      skills: [
        { name: "Node.js", level: 85, color: "bg-green-500" },
        { name: "Python", level: 80, color: "bg-green-600" },
        { name: "API Development", level: 88, color: "bg-purple-500" },
        { name: "Database Design", level: 82, color: "bg-indigo-500" }
      ]
    },
    {
      title: "Tools & Technologies",
      skills: [
        { name: "Git", level: 90, color: "bg-red-500" },
        { name: "Docker", level: 75, color: "bg-blue-400" },
        { name: "AWS", level: 70, color: "bg-orange-400" },
        { name: "CI/CD", level: 78, color: "bg-green-400" }
      ]
    }
  ];

  const technologies = [
    "React", "JavaScript", "TypeScript", "Node.js", "Python", "HTML", "CSS", 
    "Tailwind CSS", "Git", "Docker", "MongoDB", "PostgreSQL", "Redis", "AWS", 
    "Vercel", "Next.js", "Express.js", "REST APIs", "GraphQL", "Jest", "Cypress"
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
