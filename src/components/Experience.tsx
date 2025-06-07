
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Experience = () => {
  const experiences = [
    {
      title: "Full Stack Developer",
      company: "Freelance",
      period: "2020 - Present",
      description: "Developing custom web applications for clients using modern technologies. Specializing in React frontends with Node.js backends.",
      achievements: [
        "Built 20+ custom web applications",
        "Maintained 98% client satisfaction rate",
        "Delivered projects 15% faster than industry average"
      ],
      technologies: ["React", "Node.js", "MongoDB", "AWS"]
    },
    {
      title: "Open Source Contributor",
      company: "Various Projects",
      period: "2019 - Present",
      description: "Contributing to open source projects and maintaining personal projects that benefit the developer community.",
      achievements: [
        "Created Aesthetic Palettes project",
        "Active contributor on GitHub",
        "Helped 1000+ developers through Stack Overflow"
      ],
      technologies: ["JavaScript", "React", "Open Source"]
    },
    {
      title: "Software Developer",
      company: "Tech Company",
      period: "2018 - 2020",
      description: "Developed and maintained web applications using modern JavaScript frameworks and backend technologies.",
      achievements: [
        "Improved application performance by 40%",
        "Led team of 3 junior developers",
        "Implemented CI/CD pipelines"
      ],
      technologies: ["JavaScript", "React", "Python", "Docker"]
    }
  ];

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Experience</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My professional journey and contributions to the tech community
          </p>
        </div>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <CardTitle className="text-xl">{exp.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-primary">
                      {exp.company}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {exp.period}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{exp.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Key Achievements:</h4>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
