import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  Star,
  Users,
  MessageCircle,
  Award,
  TrendingUp,
  Zap,
  Heart,
  ExternalLink,
  Mail,
  Phone
} from "lucide-react";

const Monetization = () => {
  const services = [
    {
      title: "Technical Consulting",
      description: "1-on-1 consulting sessions for Angular, enterprise architecture, and full-stack development challenges.",
      icon: MessageCircle,
      price: "$150",
      duration: "1 hour",
      features: [
        "Architecture review and recommendations",
        "Code audit and optimization suggestions", 
        "Technology stack consultation",
        "Team training and mentorship",
        "Project planning and roadmap",
        "Performance optimization strategies"
      ],
      popular: false,
      bookingUrl: "#book-consulting",
      testimonial: {
        text: "Ahmed's insights helped us solve critical performance issues in our Angular application.",
        author: "Tech Lead at Fortune 500 Company"
      }
    },
    {
      title: "Code Review & Audit",
      description: "Comprehensive code review sessions focusing on best practices, performance, and maintainability.",
      icon: Award,
      price: "$200",
      duration: "2-3 hours",
      features: [
        "Detailed code analysis report",
        "Best practices recommendations",
        "Security vulnerability assessment",
        "Performance bottleneck identification",
        "Refactoring suggestions",
        "Documentation improvements"
      ],
      popular: true,
      bookingUrl: "#book-audit",
      testimonial: {
        text: "The code audit revealed optimization opportunities that improved our app performance by 40%.",
        author: "Senior Developer, FinTech Startup"
      }
    },
    {
      title: "Team Training Workshop",
      description: "Custom workshops for teams on Angular, TypeScript, enterprise patterns, and modern development practices.",
      icon: Users,
      price: "$500",
      duration: "Half day",
      features: [
        "Customized training content",
        "Interactive coding sessions",
        "Real-world project examples",
        "Q&A and troubleshooting",
        "Follow-up support (1 week)",
        "Training materials included"
      ],
      popular: false,
      bookingUrl: "#book-training",
      testimonial: {
        text: "Our team's productivity increased significantly after Ahmed's Angular workshop.",
        author: "Engineering Manager, EdTech Company"
      }
    }
  ];

  const digitalProducts = [
    {
      title: "Enterprise Angular Patterns Course",
      description: "Comprehensive video course covering enterprise-grade Angular development patterns used at EAGLE6.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      price: "$199",
      originalPrice: "$299",
      modules: 12,
      duration: "8 hours",
      features: [
        "12 comprehensive modules",
        "Source code for all examples",
        "Real-world enterprise patterns",
        "State management with Akita",
        "Performance optimization techniques",
        "Lifetime access and updates"
      ],
      status: "Coming Soon",
      preOrderDiscount: "33% off",
      studentsEnrolled: 0,
      rating: 0
    },
    {
      title: "Full-Stack Developer Roadmap 2024",
      description: "Complete roadmap and resources for becoming a full-stack developer, based on 11+ years of experience.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      price: "$49",
      originalPrice: "$79",
      modules: 6,
      duration: "3 hours",
      features: [
        "Technology selection guide",
        "Learning path recommendations",
        "Career advancement strategies",
        "Freelancing tips and tricks",
        "Interview preparation guide",
        "Resource library (100+ links)"
      ],
      status: "Available",
      preOrderDiscount: null,
      studentsEnrolled: 245,
      rating: 4.8
    },
    {
      title: "Open Source Contribution Masterclass",
      description: "Learn how to contribute to open source projects effectively and build your developer reputation.",
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop",
      price: "$29",
      originalPrice: "$49",
      modules: 4,
      duration: "2 hours",
      features: [
        "Finding the right projects",
        "Making meaningful contributions",
        "Building community relationships",
        "Growing your GitHub profile",
        "From contributor to maintainer",
        "Real contribution examples"
      ],
      status: "Available",
      preOrderDiscount: null,
      studentsEnrolled: 189,
      rating: 4.9
    }
  ];

  const passiveIncomeStreams = [
    {
      title: "Patreon Support",
      description: "Support my open source work and get exclusive content, early access to tutorials, and monthly live Q&A sessions.",
      icon: Heart,
      url: "https://patreon.com/ar27111994",
      monthlyRevenue: "$280+",
      supporters: "45+ patrons",
      benefits: [
        "Exclusive technical articles",
        "Monthly live coding sessions",
        "Discord community access",
        "Code review priority",
        "Early course access"
      ]
    },
    {
      title: "Open Collective",
      description: "Support the Aesthetic Palettes project and other open source initiatives.",
      icon: ExternalLink,
      url: "https://opencollective.com/aesthetic-palettes",
      monthlyRevenue: "$120+",
      supporters: "28+ backers",
      benefits: [
        "Project sustainability",
        "Feature request priority",
        "Sponsor recognition",
        "Development transparency",
        "Community voting rights"
      ]
    },
    {
      title: "GitHub Sponsors",
      description: "Sponsor my open source development work and get featured in project READMEs.",
      icon: Star,
      url: "https://github.com/sponsors/ar27111994",
      monthlyRevenue: "$180+",
      supporters: "22+ sponsors",
      benefits: [
        "Sponsor badge on GitHub",
        "Priority issue responses",
        "Custom feature requests",
        "Exclusive repository access",
        "Direct communication channel"
      ]
    },
    {
      title: "Thanks.dev Recognition",
      description: "Acknowledge and support developers who have helped your projects.",
      icon: Award,
      url: "https://thanks.dev/d/gh/ar27111994",
      monthlyRevenue: "$90+",
      supporters: "15+ contributors",
      benefits: [
        "Contributor recognition",
        "Project impact tracking",
        "Community building",
        "Motivation boost",
        "Network expansion"
      ]
    }
  ];

  const statistics = [
    { label: "Monthly Consulting Revenue", value: "$3,200+", icon: DollarSign },
    { label: "Digital Product Sales", value: "$1,800+", icon: BookOpen },
    { label: "Passive Income Streams", value: "$670+", icon: TrendingUp },
    { label: "Total Monthly Revenue", value: "$5,670+", icon: Zap }
  ];

  const upcomingProducts = [
    {
      title: "Angular Performance Optimization Guide",
      description: "Comprehensive guide to optimizing Angular applications for enterprise-scale performance.",
      expectedLaunch: "Q2 2024",
      estimatedPrice: "$79",
      interest: 156
    },
    {
      title: "Freelancer's Technical Interview Prep",
      description: "Complete preparation package for technical interviews and client consultations.",
      expectedLaunch: "Q3 2024",
      estimatedPrice: "$129",
      interest: 203
    },
    {
      title: "Building SaaS with Angular & .NET Course",
      description: "End-to-end course on building scalable SaaS applications using Angular and .NET.",
      expectedLaunch: "Q4 2024",
      estimatedPrice: "$399",
      interest: 89
    }
  ];

  return (
    <section id="monetization" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Services & Digital Products</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Leverage my 11+ years of experience to accelerate your development projects. 
            From consulting to courses, I offer comprehensive solutions for developers and teams.
          </p>
        </div>

        {/* Revenue Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-primary/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consulting Services */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Professional Consulting Services</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get personalized guidance from an experienced enterprise developer. 
              Book a session to solve your technical challenges faster.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 ${service.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}>
                {service.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold text-primary">{service.price}</span>
                    <span className="text-muted-foreground">/ {service.duration}</span>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {service.testimonial && (
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <p className="text-sm italic mb-2">"{service.testimonial.text}"</p>
                        <p className="text-xs text-muted-foreground">— {service.testimonial.author}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Button className="w-full" size="lg" asChild>
                    <a href="#contact">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Session
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Digital Products */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Digital Courses & Products</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive courses and guides based on real-world enterprise experience. 
              Learn at your own pace with lifetime access.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {digitalProducts.map((product, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="overflow-hidden rounded-t-lg">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={product.status === 'Available' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                    {product.preOrderDiscount && (
                      <Badge variant="destructive">{product.preOrderDiscount}</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{product.title}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      {product.modules} modules
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {product.duration}
                    </div>
                  </div>
                  
                  {product.status === 'Available' && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {product.studentsEnrolled} students
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {product.rating}
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-muted-foreground line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  
                  <ul className="space-y-1">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full" variant={product.status === 'Available' ? 'default' : 'outline'}>
                    {product.status === 'Available' ? 'Enroll Now' : 'Get Notified'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Passive Income Streams */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Support My Work</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Support my open source contributions and content creation through various platforms. 
              Your support helps me continue sharing knowledge with the developer community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {passiveIncomeStreams.map((stream, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stream.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{stream.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{stream.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-lg font-bold text-primary">{stream.monthlyRevenue}</div>
                    <div className="text-xs text-muted-foreground">{stream.supporters}</div>
                  </div>
                  
                  <ul className="space-y-1 mb-4">
                    {stream.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="text-xs text-muted-foreground">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  
                  <Button size="sm" className="w-full" asChild>
                    <a href={stream.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Support
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Products */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Exciting new products in development. Be the first to know when they launch 
              and get exclusive early bird pricing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingProducts.map((product, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">{product.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-muted-foreground">Expected: {product.expectedLaunch}</span>
                    <span className="font-medium">{product.estimatedPrice}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{product.interest} interested</span>
                    <Button size="sm" variant="outline">
                      Get Notified
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact for Custom Work */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Need Something Custom?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Have a unique project or training requirement? I offer custom development, 
              training programs, and technical consultation tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="mailto:ar27111994@gmail.com?subject=Custom Development Quote Request&body=Hi Ahmed,%0A%0AI would like to discuss a custom development project. Here are the details:%0A%0AProject Type:%0ABudget Range:%0ATimeline:%0ASpecific Requirements:%0A%0APlease let me know your availability for a discussion.%0A%0AThank you!">
                  <Mail className="w-4 h-4 mr-2" />
                  Email for Custom Quote
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#contact">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Discovery Call
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Monetization;
