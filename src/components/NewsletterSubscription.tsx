import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, 
  Send, 
  CheckCircle, 
  Bell, 
  Gift,
  Zap,
  Users,
  Calendar,
  BookOpen,
  Star
} from "lucide-react";

import { newsletterService } from '@/services/newsletterService';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const availableInterests = [
    'Frontend Development',
    'Backend Development',
    'DevOps & Cloud',
    'Mobile Development',
    'UI/UX Design',
    'Web Performance',
    'Career Tips',
    'Industry News',
    'Tool Reviews'
  ];

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setMessage('');

    if (!email) {
      setMessage('❌ Please enter your email address');
      setIsSubscribing(false);
      return;
    }

    try {
      await newsletterService.subscribe(email, name, interests);
      setIsSubscribed(true);
      setMessage('🎉 Welcome aboard! You\'ve successfully subscribed to our newsletter.');
      
      // Reset form
      setEmail('');
      setName('');
      setInterests([]);
    } catch (error) {
        if (error instanceof Error) {
            setMessage(`❌ ${error.message}`);
        } else {
            setMessage('❌ Failed to subscribe. Please try again.');
        }
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
            Welcome to the Community!
          </h3>
          <p className="text-green-700 dark:text-green-300 mb-4">
            You've successfully subscribed to our newsletter. Get ready for exclusive content!
          </p>
          
          <div className="space-y-2 text-sm text-green-600 dark:text-green-400">
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-4 h-4" />
              <span>Weekly development insights</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Early access to new content</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Star className="w-4 h-4" />
              <span>Exclusive tips and resources</span>
            </div>
          </div>

          <Button 
            onClick={() => setIsSubscribed(false)}
            variant="outline"
            className="mt-4"
          >
            Subscribe Another Email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Stay in the Loop</CardTitle>
            <CardDescription>
              Get weekly insights, tutorials, and exclusive content delivered to your inbox
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Newsletter Benefits */}
        <div className="mb-6 p-4 bg-background/50 rounded-lg border">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4 text-purple-500" />
            What you'll get:
          </h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Weekly development insights</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Early access to new posts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Exclusive tutorials</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Industry news & trends</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No spam, unsubscribe anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Curated resources & tools</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* Interest Selection */}
          <div>
            <Label className="text-base">What interests you? (Optional)</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Help us personalize your newsletter content
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableInterests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <Label 
                    htmlFor={interest}
                    className="text-sm cursor-pointer"
                  >
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubscribing || !email}
            className="w-full"
            size="lg"
          >
            {isSubscribing ? (
              <>
                <Mail className="w-4 h-4 mr-2 animate-pulse" />
                Subscribing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Subscribe to Newsletter
              </>
            )}
          </Button>
        </form>

        {/* Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>1,200+ subscribers</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Weekly delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>5 min read</span>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </CardContent>
    </Card>
  );
};

export default NewsletterSubscription;
