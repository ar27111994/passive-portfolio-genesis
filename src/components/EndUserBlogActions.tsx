import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PenTool, 
  Mail, 
  Bell, 
  MessageCircle, 
  Star,
  Users,
  BookOpen,
  Send
} from "lucide-react";
import GuestBlogSubmission from './GuestBlogSubmission';
import NewsletterSubscription from './NewsletterSubscription';

const EndUserBlogActions = () => {
  const [activeTab, setActiveTab] = useState('newsletter');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="text-xl text-muted-foreground">
          Stay connected, contribute content, and grow with fellow developers
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="newsletter" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Newsletter
          </TabsTrigger>
          <TabsTrigger value="guest-post" className="flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            Write for Us
          </TabsTrigger>
        </TabsList>

        <TabsContent value="newsletter">
          <NewsletterSubscription />
        </TabsContent>

        <TabsContent value="guest-post">
          <GuestBlogSubmission />
        </TabsContent>
      </Tabs>

      {/* Additional Community Features */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">Discussion</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Engage with posts through comments and discussions
          </p>
          <Badge variant="outline">Coming Soon</Badge>
        </Card>

        <Card className="text-center p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold mb-2">Bookmarks</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Save your favorite articles for later reading
          </p>
          <Badge variant="outline">Coming Soon</Badge>
        </Card>

        <Card className="text-center p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold mb-2">Community</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect with other developers and share knowledge
          </p>
          <Badge variant="outline">Coming Soon</Badge>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
          <h3 className="text-2xl font-bold mb-2">Ready to Get Involved?</h3>
          <p className="text-muted-foreground mb-6">
            Whether you want to stay updated or share your expertise, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setActiveTab('newsletter')} size="lg">
              <Bell className="w-4 h-4 mr-2" />
              Subscribe to Newsletter
            </Button>
            <Button onClick={() => setActiveTab('guest-post')} variant="outline" size="lg">
              <Send className="w-4 h-4 mr-2" />
              Submit Guest Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndUserBlogActions;
