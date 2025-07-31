import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Education = () => {
  const education = [
    {
      institution: "University of Arid Agriculture, Rawalpindi",
      degree: "Master's Degree, Computer Science",
      period: "2014 - 2016",
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
      ]
    },
    {
      institution: "University of the Punjab",
      degree: "Bachelor of Science (Computer, Statistics and Mathematics)",
      period: "2012 - 2014",
      subjects: [
        "Computer Science",
        "Software Engineering",
        "Databases", 
        "Operating Systems",
        "Statistics and Probability",
        "Calculus",
        "Mathematical Methods"
      ]
    }
  ];

  const certifications = [
    {
      title: "Improving Deep Neural Networks: Hyperparameter tuning, Regularization and Optimization",
      provider: "Coursera",
      completed: "December 2019",
      skills: [
        "Understand how to diagnose errors in a machine learning system",
        "Be able to prioritize the most promising directions for reducing error",
        "Understand complex ML settings, such as mismatched training/test sets",
        "Know how to apply end-to-end learning, transfer learning, and multi-task learning"
      ]
    },
    {
      title: "Neural Networks and Deep Learning", 
      provider: "Coursera",
      completed: "July 2019",
      skills: [
        "Understand industry best-practices for building deep learning applications",
        "Be able to effectively use common neural network tricks",
        "Be able to implement and apply a variety of optimization algorithms",
        "Understand new best-practices for the deep learning era"
      ]
    },
    {
      title: "Structuring Machine Learning Projects",
      provider: "Coursera", 
      completed: "August 2018",
      skills: [
        "Understand the major technology trends driving Deep Learning",
        "Be able to build, train and apply fully connected deep neural networks",
        "Know how to implement efficient (vectorized) neural networks",
        "Understand the key parameters in a neural network's architecture"
      ]
    },
    {
      title: "Introduction to Big Data",
      provider: "Coursera",
      completed: "October 2018", 
      skills: [
        "Describe the Big Data landscape including examples of real-world big data problems",
        "Explain the V's of Big Data and why each impacts data collection, monitoring, storage, analysis and reporting",
        "Get value out of Big Data by using a 5-step process to structure your analysis",
        "Identify what are and what are not big data problems and be able to recast big data problems as data science questions"
      ]
    }
  ];

  return (
    <section id="education" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Education & Certifications</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My academic background and professional development in computer science and emerging technologies
          </p>
        </div>
        
        <div className="grid md:grid-cols-1 gap-8 mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-6">Education</h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <CardTitle className="text-xl">{edu.degree}</CardTitle>
                        <CardDescription className="text-lg font-medium text-primary">
                          {edu.institution}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {edu.period}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {edu.subjects.map((subject, subIndex) => (
                        <Badge key={subIndex} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-6">Professional Certifications</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                      Completed {cert.completed}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{cert.title}</CardTitle>
                  <CardDescription className="text-base font-medium text-primary">
                    {cert.provider}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Learning Outcomes:</h4>
                    <ul className="space-y-1">
                      {cert.skills.map((skill, skillIndex) => (
                        <li key={skillIndex} className="flex items-start text-sm">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span className="text-muted-foreground">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;