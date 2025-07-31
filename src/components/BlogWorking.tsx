import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Star, AlertCircle, Database } from "lucide-react";
import { useState } from "react";

const BlogWorking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTestSupabase = async () => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('Testing Supabase connection...');
      
      // Import dynamically to avoid potential module loading issues
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Test connection
      const { data, error: connectionError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);
      
      if (connectionError) {
        throw new Error(`Connection failed: ${connectionError.message}`);
      }
      
      setMessage('✅ Supabase connection successful!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`❌ Connection failed: ${errorMsg}`);
      console.error('Supabase test error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeDatabase = async () => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('Initializing database...');
      
      const { simpleInitializeDatabase } = await import('@/scripts/initializeDatabase');
      await simpleInitializeDatabase();
      
      setMessage('✅ Database initialized successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`�� Database initialization failed: ${errorMsg}`);
      console.error('Database initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('Generating blog content...');
      
      // Initialize database first
      const { simpleInitializeDatabase } = await import('@/scripts/initializeDatabase');
      await simpleInitializeDatabase();
      setMessage('Database ready. Generating content...');
      
      // Generate content
      const { generateAndPopulateBlogContent } = await import('@/scripts/generateBlogContent');
      await generateAndPopulateBlogContent();
      
      setMessage('🎉 Blog content generated successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`❌ Content generation failed: ${errorMsg}`);
      console.error('Content generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Technical Blog & Insights</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI-powered blog system with Supabase backend. Test the connection and generate content below.
          </p>
        </div>

        {/* Status Messages */}
        {message && (
          <Card className="mb-8 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <CardContent className="p-4">
              <p className="text-green-800 dark:text-green-200">{message}</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-8 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
            <CardContent className="p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="text-center space-y-4 mb-16">
          <div className="space-x-4">
            <Button 
              onClick={handleTestSupabase} 
              disabled={isLoading}
              size="lg"
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Test Supabase
                </>
              )}
            </Button>
            <Button 
              onClick={handleInitializeDatabase} 
              disabled={isLoading}
              size="lg"
              variant="secondary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Working...
                </>
              ) : (
                'Initialize Database'
              )}
            </Button>
            <Button 
              onClick={handleGenerateContent} 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Working...
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 mr-2" />
                  Generate AI Content
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Environment Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Environment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </div>
              <div>
                <strong>Supabase Key:</strong> {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Building Scalable Angular Applications",
              category: "Angular",
              description: "Lessons from 4+ years at EAGLE6 developing enterprise cybersecurity platforms with Angular, TypeScript, and Akita state management."
            },
            {
              title: "From GW-BASIC to Enterprise Developer",
              category: "Career",
              description: "My programming journey from writing day-of-week calculations at age 13 to building enterprise applications."
            },
            {
              title: "Accessibility-First Development",
              category: "Accessibility",
              description: "Insights from building BlindSight, a social platform for visually impaired users with WCAG 2.1 AA compliance."
            }
          ].map((post, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription>
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Click "Generate AI Content" above to create real blog posts with authentic content based on Ahmed's experience.
                </p>
                <Button size="sm" disabled variant="outline">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Information */}
        <Card className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-center">AI Blog System Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🤖 Intelligent Content Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Creates authentic blog posts based on Ahmed's real experience with Angular, enterprise development, accessibility projects, and career insights.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🗄️ Supabase Integration</h4>
                <p className="text-sm text-muted-foreground">
                  PostgreSQL database with real-time capabilities, RLS security, and automated functions for view counting and statistics.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Analytics & Engagement</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time tracking of views, likes, read times, and engagement metrics with automated statistics updates.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 Professional Quality</h4>
                <p className="text-sm text-muted-foreground">
                  Technical articles that provide real value to developers, covering enterprise patterns, accessibility, and career development.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BlogWorking;
