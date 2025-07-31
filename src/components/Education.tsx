import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, Calendar, MapPin, ExternalLink, BookOpen, Star, TrendingUp } from "lucide-react";

const Education = () => {
  const education = [
    {
      degree: "Master's Degree in Computer Science (M.C.S.)",
      institution: "University of Arid Agriculture, Rawalpindi",
      period: "2014 - 2016",
      location: "Rawalpindi, Pakistan",
      description: "Advanced studies in computer science with focus on software engineering, algorithms, and system design.",
      subjects: [
        "Digital Design",
        "Web and Desktop Development", 
        "Operating Systems",
        "System Programming",
        "Networking",
        "Software Engineering",
        "Database Systems",
        "Artificial Intelligence",
        "Data Structures"
      ],
      grade: "Completed",
      type: "Masters"
    },
    {
      degree: "Bachelor of Science (B.Sc.) - Computer, Statistics and Mathematics",
      institution: "University of the Punjab",
      period: "2012 - 2014",
      location: "Lahore, Pakistan", 
      description: "Comprehensive undergraduate program combining computer science fundamentals with statistical analysis and mathematical foundations.",
      subjects: [
        "Computer Science",
        "Software Engineering", 
        "Databases",
        "Operating Systems",
        "Statistics and Probability",
        "Calculus",
        "Mathematical Methods"
      ],
      grade: "Completed",
      type: "Bachelors"
    }
  ];

  const certifications = [
    {
      title: "Improving Deep Neural Networks: Hyperparameter tuning, Regularization and Optimization",
      issuer: "Coursera",
      issueDate: "May 12, 2019",
      credentialId: "coursera-dnn-2019",
      skills: ["Deep Learning", "Neural Networks", "Hyperparameter Tuning", "Regularization", "Optimization"],
      description: "Advanced deep learning course covering optimization algorithms, regularization techniques, and hyperparameter tuning strategies.",
      level: "Advanced",
      category: "AI/ML"
    },
    {
      title: "Neural Networks and Deep Learning", 
      issuer: "Coursera",
      issueDate: "April 7, 2019",
      credentialId: "coursera-nndl-2019",
      skills: ["Neural Networks", "Deep Learning", "TensorFlow", "Python", "Machine Learning"],
      description: "Comprehensive introduction to neural networks and deep learning fundamentals, including practical implementation with TensorFlow.",
      level: "Intermediate",
      category: "AI/ML"
    },
    {
      title: "Structuring Machine Learning Projects",
      issuer: "Coursera", 
      issueDate: "August 20, 2018",
      credentialId: "coursera-smlp-2018",
      skills: ["Machine Learning Strategy", "Error Analysis", "Transfer Learning", "Multi-task Learning"],
      description: "Strategic approaches to machine learning project development, error analysis, and optimization techniques.",
      level: "Intermediate", 
      category: "AI/ML"
    },
    {
      title: "Introduction to Big Data",
      issuer: "Coursera",
      issueDate: "October 29, 2018", 
      credentialId: "coursera-bd-2018",
      skills: ["Big Data", "Hadoop", "HDFS", "MapReduce", "Data Analytics"],
      description: "Foundational concepts in big data processing, Hadoop ecosystem, and distributed computing frameworks.",
      level: "Beginner",
      category: "Data Science"
    }
  ];

  const learningJourney = [
    {
      year: "2013",
      milestone: "Started Programming",
      description: "Began at age 13 with GW-BASIC, creating day-of-week calculation programs",
      icon: "🚀"
    },
    {
      year: "2014-2016",
      milestone: "Formal Education",
      description: "Completed Master's in Computer Science while building first commercial projects",
      icon: "🎓"
    },
    {
      year: "2018-2019",
      milestone: "AI/ML Specialization",
      description: "Pursued deep learning and machine learning certifications during EAGLE6 tenure",
      icon: "🤖"
    },
    {
      year: "2019-Present",
      milestone: "Continuous Learning",
      description: "Ongoing skill development in modern frameworks and emerging technologies",
      icon: "📈"
    }
  ];

  const skills = [
    { category: "Programming Languages", count: 8, items: ["C#", "JavaScript", "TypeScript", "PHP", "Python", "GW-BASIC", "SQL"] },
    { category: "Frameworks & Libraries", count: 12, items: ["Angular", "ASP.NET", "React", "CodeIgniter", "WordPress", "jQuery"] },
    { category: "Databases & Tools", count: 6, items: ["SQL Server", "MySQL", "Entity Framework", "Git", "Azure", "Docker"] },
    { category: "Design & UI/UX", count: 4, items: ["Adobe Photoshop", "Adobe Illustrator", "Material Design", "Responsive Design"] }
  ];

  const getLevelColor = (level: string) => {
    switch(level) {
      case "Advanced": return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Beginner": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "AI/ML": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Data Science": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <section id="education" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Education & Certifications</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Academic foundation in Computer Science combined with continuous professional development 
            in cutting-edge technologies and methodologies.
          </p>
        </div>

        {/* Academic Education */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Academic Background</h3>
          </div>
          
          <div className="space-y-8">
            {education.map((edu, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{edu.degree}</CardTitle>
                      <CardDescription className="text-lg font-medium text-primary mb-2">
                        {edu.institution}
                      </CardDescription>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {edu.period}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {edu.location}
                        </div>
                        <Badge variant="outline">{edu.type}</Badge>
                      </div>
                    </div>
                    <Badge variant="secondary" className="w-fit">{edu.grade}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {edu.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Key Subjects & Areas of Study</h4>
                    <div className="flex flex-wrap gap-2">
                      {edu.subjects.map((subject, subIndex) => (
                        <Badge key={subIndex} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Professional Certifications */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Award className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Professional Certifications</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg leading-tight">{cert.title}</CardTitle>
                    <div className="flex flex-col gap-2 ml-4">
                      <Badge className={getLevelColor(cert.level)} variant="outline">
                        {cert.level}
                      </Badge>
                      <Badge className={getCategoryColor(cert.category)} variant="outline">
                        {cert.category}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-primary font-medium">
                    {cert.issuer}
                  </CardDescription>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Completed: {cert.issueDate}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {cert.description}
                  </p>
                  
                  <div className="mb-4">
                    <h5 className="font-medium mb-2 text-sm">Skills Acquired:</h5>
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Journey Timeline */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Learning Journey</h3>
          </div>
          
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                {learningJourney.map((journey, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-background rounded-lg border">
                    <div className="text-2xl">{journey.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{journey.year}</Badge>
                        <h4 className="font-semibold">{journey.milestone}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{journey.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Summary */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Technical Skills Summary</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{skillGroup.count}+</div>
                  <h4 className="font-semibold mb-3">{skillGroup.category}</h4>
                  <div className="space-y-1">
                    {skillGroup.items.slice(0, 4).map((item, itemIndex) => (
                      <div key={itemIndex} className="text-xs text-muted-foreground">
                        {item}
                      </div>
                    ))}
                    {skillGroup.items.length > 4 && (
                      <div className="text-xs text-muted-foreground font-medium">
                        +{skillGroup.items.length - 4} more
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Philosophy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-primary" />
              Continuous Learning Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Knowledge Seeker</h4>
                <p className="text-sm text-muted-foreground">
                  Continuously exploring new technologies and frameworks to stay current with industry trends.
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Skill Builder</h4>
                <p className="text-sm text-muted-foreground">
                  Regular participation in professional development courses and certification programs.
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Growth Focused</h4>
                <p className="text-sm text-muted-foreground">
                  Applying learned concepts to real-world projects and sharing knowledge with the community.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Education;
