
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
              I'm Ahmed Rehan, a professional Web Developer from Rawalpindi, Pakistan with over 11 years 
              of programming experience. My journey began at age 13 with GW-BASIC, creating programs 
              that could calculate the day of the week for any date in the 20th or 21st century.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              From front-end development with jQuery, CSS3, and HTML5 to WordPress development for 
              local markets, I've expanded into PHP, CodeIgniter, and the .NET ecosystem including 
              ASP.NET MVC and Xamarin. I'm also skilled in graphics and logo design using Adobe 
              Photoshop and Illustrator, working as a freelancer.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">C#</Badge>
              <Badge variant="secondary">ASP.NET MVC</Badge>
              <Badge variant="secondary">PHP</Badge>
              <Badge variant="secondary">CodeIgniter</Badge>
              <Badge variant="secondary">JavaScript</Badge>
              <Badge variant="secondary">Xamarin</Badge>
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
