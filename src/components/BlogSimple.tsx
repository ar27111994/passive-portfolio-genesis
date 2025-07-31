import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Star, AlertCircle } from "lucide-react";
import { useState } from "react";
import { simpleInitializeDatabase } from "@/scripts/initializeDatabase";
import { generateAndPopulateBlogContent } from "@/scripts/generateBlogContent";

const BlogSimple = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInitializeDatabase = async () => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('Initializing database...');
      
      await simpleInitializeDatabase();
      setMessage('Database initialized successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to initialize database: ${errorMsg}`);
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
      
      // First try to initialize database
      await simpleInitializeDatabase();
      setMessage('Database initialized. Generating content...');
      
      await generateAndPopulateBlogContent();
      setMessage('Blog content generated successfully!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to generate content: ${errorMsg}`);
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
            AI-powered blog system with Supabase backend. Initialize the database and generate content below.
          </p>
        </div>

        {/* Status Messages */}
        {message && (
          <Card className="mb-8 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <p className="text-green-800">{message}</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-8 bg-red-50 border-red-200">
            <CardContent className="p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="text-center space-y-4 mb-16">
          <div className="space-x-4">
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
                  Generate AI Blog Content
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Sample Blog Post {i}</CardTitle>
                <CardDescription>
                  This is a placeholder for AI-generated blog content. Use the buttons above to initialize the database and generate real content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you generate content, this will be replaced with real blog posts about Angular, TypeScript, career development, and more.
                </p>
                <Button size="sm" disabled>
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Information */}
        <Card className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-center">How It Works</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🤖 AI Content Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Uses AI to generate authentic blog posts based on Ahmed's real experience with Angular, TypeScript, enterprise development, and more.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🗄️ Supabase Backend</h4>
                <p className="text-sm text-muted-foreground">
                  Stores blog posts, categories, tags, and statistics in a PostgreSQL database with real-time updates and analytics.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Real Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Tracks views, likes, read times, and engagement metrics to provide insights into content performance.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 Content Quality</h4>
                <p className="text-sm text-muted-foreground">
                  Generates high-quality, technical content that reflects real-world experience and provides value to developers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BlogSimple;
