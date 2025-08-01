import { ArrowRight, Github, Linkedin, Mail, Code, Book, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import BlogReal from "@/components/BlogReal";
import Contact from "@/components/Contact";
import Monetization from "@/components/Monetization";
import Footer from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthDialog } from "@/components/AuthDialog";
import { UserMenu } from "@/components/UserMenu";
import { MobileMenu } from "@/components/MobileMenu";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import AdminStatusIndicator from "@/components/AdminStatusIndicator";
import { useAuth } from "@/hooks/useAuth";
import SEO, { seoConfigs } from "@/components/SEO";
import { useState, useEffect } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events for active section and navbar styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);

      // Determine active section
      const sections = ['home', 'about', 'projects', 'skills', 'experience', 'education', 'blog', 'monetization', 'contact'];
      const currentSection = sections.find(section => {
        const element = section === 'home' ? document.querySelector('#hero') : document.querySelector(`#${section}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update SEO based on active section
  useEffect(() => {
    const seoConfig = seoConfigs[activeSection as keyof typeof seoConfigs] || seoConfigs.home;
    // The SEO component would handle this, but we can trigger updates here if needed
  }, [activeSection]);

  const navItems = [
    { id: 'about', label: 'About', href: '#about' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'skills', label: 'Skills', href: '#skills' },
    { id: 'experience', label: 'Experience', href: '#experience' },
    { id: 'education', label: 'Education', href: '#education' },
    { id: 'blog', label: 'Blog', href: '#blog' },
    { id: 'contact', label: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (href: string, id: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <>
      {/* Dynamic SEO */}
      <SEO {...seoConfigs.home} />
      
      <div className="min-h-screen bg-background">
        {/* Enhanced Navigation */}
        <nav 
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled 
              ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' 
              : 'bg-background/80 backdrop-blur-sm border-b border-transparent'
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex justify-between items-center h-16 lg:h-20">
              {/* Logo */}
              <div className="flex items-center">
                <button
                  onClick={() => handleNavClick('#hero', 'home')}
                  className="text-xl lg:text-2xl font-bold hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                  aria-label="Go to top of page"
                >
                  AR Portfolio
                </button>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.href, item.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:text-primary hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      activeSection === item.id 
                        ? 'text-primary bg-muted/50' 
                        : 'text-muted-foreground'
                    }`}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-2 lg:space-x-3">
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Social Links - Hidden on mobile */}
                <div className="hidden sm:flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="hover:scale-105 transition-transform"
                  >
                    <a 
                      href="https://github.com/ar27111994" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="View GitHub profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="hover:scale-105 transition-transform"
                  >
                    <a 
                      href="https://linkedin.com/in/ar27111994" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="View LinkedIn profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                </div>

                {/* Auth */}
                {!loading && (user ? <UserMenu /> : <AuthDialog />)}
                
                {/* Mobile Menu */}
                <MobileMenu />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main id="main-content" className="pt-16 lg:pt-20">
          {/* Hero Section */}
          <section id="hero">
            <Hero />
          </section>

          {/* About Section */}
          <About />

          {/* Projects Section */}
          <Projects />

          {/* Skills Section */}
          <Skills />

          {/* Experience Section */}
          <Experience />

          {/* Education Section */}
          <Education />

          {/* Blog Section */}
          <BlogReal />

          {/* Monetization/Services Section */}
          <Monetization />

          {/* Contact Section */}
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* WhatsApp Button */}
        <WhatsAppButton />

        {/* Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ 
              width: `${Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%` 
            }}
          />
        </div>

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-24 left-6 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
            isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          aria-label="Back to top"
          style={{ display: isScrolled ? 'flex' : 'none' }}
        >
          <ArrowRight className="w-5 h-5 m-auto rotate-[-90deg]" />
        </button>
      </div>
    </>
  );
};

export default Index;
