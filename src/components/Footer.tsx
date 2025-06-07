
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">AR Portfolio</h3>
            <p className="text-muted-foreground mb-4">
              Full Stack Developer specializing in React and modern web technologies.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/ar27111994" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/in/ar27111994" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:your.email@example.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">Projects</a></li>
              <li><a href="#skills" className="text-muted-foreground hover:text-foreground transition-colors">Skills</a></li>
              <li><a href="#experience" className="text-muted-foreground hover:text-foreground transition-colors">Experience</a></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><span className="text-muted-foreground">Web Development</span></li>
              <li><span className="text-muted-foreground">React Applications</span></li>
              <li><span className="text-muted-foreground">Full Stack Solutions</span></li>
              <li><span className="text-muted-foreground">Open Source</span></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support My Work</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://patreon.com/ar27111994" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Patreon
                </a>
              </li>
              <li>
                <a 
                  href="https://opencollective.com/aesthetic-palettes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Open Collective
                </a>
              </li>
              <li>
                <a 
                  href="https://thanks.dev/d/gh/ar27111994" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Thanks.dev
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 AR Portfolio. Built with React and Tailwind CSS. Open source on GitHub.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
