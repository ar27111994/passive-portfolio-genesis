
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dedicated to creating exceptional digital experiences through clean code and innovative solutions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-6">My Journey</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              As a passionate full-stack developer, I specialize in creating modern web applications using 
              React, JavaScript, and cutting-edge technologies. With a strong background in both frontend 
              and backend development, I bring ideas to life through clean, efficient code.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              I'm actively contributing to open source projects and constantly learning new technologies 
              to stay at the forefront of web development. My experience spans from building responsive 
              user interfaces to architecting scalable backend systems.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">JavaScript</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Node.js</Badge>
              <Badge variant="secondary">Python</Badge>
              <Badge variant="secondary">Full Stack</Badge>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Problem Solver</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  I thrive on tackling complex challenges and finding elegant solutions that make a difference.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Open Source Contributor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Actively contributing to the developer community through open source projects and knowledge sharing.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Continuous Learner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Always exploring new technologies and methodologies to deliver cutting-edge solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
