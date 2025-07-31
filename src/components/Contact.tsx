import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Linkedin, 
  Github, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  AlertCircle,
  Globe,
  Calendar
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      // Focus on first error field
      const firstError = Object.keys(formErrors)[0];
      const errorElement = document.querySelector(`[name="${firstError}"]`) as HTMLElement;
      errorElement?.focus();
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form submission - replace with actual submission logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast.success("Message sent successfully! I'll get back to you soon.");
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Track form submission
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submit', {
          event_category: 'engagement',
          event_label: 'contact_form'
        });
      }
      
    } catch (error) {
      toast.error("Failed to send message. Please try again or contact me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "+923315887235";
    const message = "Hi Ahmed! I found your portfolio and would like to discuss a project opportunity.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const getCurrentTime = () => {
    const now = new Date();
    const pakistanTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Karachi"}));
    return pakistanTime.toLocaleTimeString('en-PK', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const isBusinessHours = () => {
    const now = new Date();
    const pakistanTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Karachi"}));
    const hour = pakistanTime.getHours();
    const day = pakistanTime.getDay();
    
    if (day === 0) return false; // Sunday
    if (day === 6) return hour >= 9 && hour < 14; // Saturday 9AM-2PM
    return hour >= 9 && hour < 18; // Weekdays 9AM-6PM
  };

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "ar27111994@gmail.com",
      href: "mailto:ar27111994@gmail.com",
      description: "Best for detailed project discussions",
      responseTime: "Within 6 hours"
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+92 331 588 7235",
      onClick: handleWhatsAppClick,
      description: "Quick responses and urgent matters",
      responseTime: "Within 2 hours"
    },
    {
      icon: Phone,
      label: "Phone Call",
      value: "+92 331 588 7235",
      href: "tel:+923315887235",
      description: "For complex project discussions",
      responseTime: "Schedule in advance"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Connect professionally",
      href: "https://linkedin.com/in/ar27111994",
      description: "Professional networking",
      responseTime: "Within 24 hours"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-muted/30" aria-labelledby="contact-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 id="contact-heading" className="text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to start your next project? Let's discuss how my 11+ years of experience 
            in Angular, TypeScript, and enterprise development can help bring your ideas to life.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send Me a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and I'll get back to you within 6 hours during business hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground mb-4">
                      Thank you for reaching out. I'll review your message and respond within 6 hours.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="required">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter your first name"
                          aria-invalid={!!formErrors.firstName}
                          aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                          required
                        />
                        {formErrors.firstName && (
                          <div id="firstName-error" className="flex items-center gap-1 text-sm text-destructive mt-1">
                            <AlertCircle className="w-4 h-4" />
                            {formErrors.firstName}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="required">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        aria-invalid={!!formErrors.email}
                        aria-describedby={formErrors.email ? 'email-error' : undefined}
                        required
                      />
                      {formErrors.email && (
                        <div id="email-error" className="flex items-center gap-1 text-sm text-destructive mt-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="subject" className="required">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="What's this about?"
                        aria-invalid={!!formErrors.subject}
                        aria-describedby={formErrors.subject ? 'subject-error' : undefined}
                        required
                      />
                      {formErrors.subject && (
                        <div id="subject-error" className="flex items-center gap-1 text-sm text-destructive mt-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.subject}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message" className="required">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell me about your project, timeline, budget, and any specific requirements..."
                        className="min-h-[120px]"
                        aria-invalid={!!formErrors.message}
                        aria-describedby={formErrors.message ? 'message-error' : 'message-help'}
                        required
                      />
                      {formErrors.message ? (
                        <div id="message-error" className="flex items-center gap-1 text-sm text-destructive mt-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.message}
                        </div>
                      ) : (
                        <div id="message-help" className="text-sm text-muted-foreground mt-1">
                          Minimum 10 characters. Include project details, timeline, and budget if applicable.
                        </div>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                      aria-describedby="submit-help"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                    <div id="submit-help" className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to be contacted regarding your inquiry.
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Availability Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isBusinessHours() ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  {isBusinessHours() ? 'Available Now' : 'Available Soon'}
                </CardTitle>
                <CardDescription>
                  {isBusinessHours() 
                    ? 'Currently online and ready to discuss your project'
                    : 'Outside business hours, but will respond to messages soon'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Current time: {getCurrentTime()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Rawalpindi, Punjab, Pakistan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Available worldwide (Remote)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Methods</CardTitle>
                <CardDescription>
                  Choose the best way to reach me based on your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="group">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-4 hover:bg-muted/50"
                      asChild={!!method.href}
                      onClick={method.onClick}
                    >
                      {method.href ? (
                        <a href={method.href} target={method.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                          <div className="flex items-start gap-3 text-left">
                            <method.icon className="w-5 h-5 mt-0.5 text-primary" />
                            <div className="flex-1">
                              <div className="font-medium">{method.label}</div>
                              <div className="text-sm text-muted-foreground">{method.value}</div>
                              <div className="text-xs text-muted-foreground mt-1">{method.description}</div>
                              <Badge variant="secondary" className="text-xs mt-2">
                                {method.responseTime}
                              </Badge>
                            </div>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-start gap-3 text-left w-full">
                          <method.icon className="w-5 h-5 mt-0.5 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium">{method.label}</div>
                            <div className="text-sm text-muted-foreground">{method.value}</div>
                            <div className="text-xs text-muted-foreground mt-1">{method.description}</div>
                            <Badge variant="secondary" className="text-xs mt-2">
                              {method.responseTime}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Business Hours (PKT)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    Emergency projects may be accommodated outside business hours
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
