
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Experience = () => {
  const experiences = [
    {
      title: "Full Stack Web Developer",
      company: "Freelance",
      period: "2015 - Present",
      description: "Providing comprehensive web development services including custom applications, email marketing solutions, and e-commerce platforms. Specializing in PHP, ASP.NET, and modern web technologies.",
      achievements: [
        "Developed Mosaico Email Template Editor integration with CodeIgniter",
        "Built multiple e-commerce solutions with shopping cart functionality",
        "Created scalable repository patterns for Entity Framework applications",
        "Maintained 556 reputation on Stack Overflow helping developers worldwide"
      ],
      technologies: ["PHP", "ASP.NET MVC", "C#", "CodeIgniter", "JavaScript", "SQL Server"]
    },
    {
      title: "Software Developer",
      company: "Various Projects",
      period: "2013 - 2015",
      description: "Focused on .NET ecosystem development including ASP.NET MVC, Entity Framework, and Xamarin mobile applications. Also provided graphics design services using Adobe Creative Suite.",
      achievements: [
        "Developed cross-platform mobile applications using Xamarin",
        "Created custom WordPress solutions for local market needs",
        "Designed logos and graphics for 50+ clients",
        "Contributed to open-source projects with Arctic Code Vault recognition"
      ],
      technologies: ["ASP.NET", "Xamarin", "WordPress", "Adobe Photoshop", "Adobe Illustrator"]
    },
    {
      title: "Junior Developer",
      company: "Self-taught & University Projects",
      period: "2010 - 2013",
      description: "Started programming journey with GW-BASIC and progressively learned modern web technologies. Developed foundational skills in frontend development and database design.",
      achievements: [
        "Created day-of-week calculator program in GW-BASIC at age 13",
        "Mastered jQuery, CSS3, and HTML5 for frontend development",
        "Built first commercial projects using simple PHP",
        "Established strong foundation in programming principles"
      ],
      technologies: ["GW-BASIC", "HTML5", "CSS3", "jQuery", "PHP", "MySQL"]
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
