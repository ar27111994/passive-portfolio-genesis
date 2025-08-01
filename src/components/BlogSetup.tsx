import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Loader2,
  FileText,
  Settings,
  Play
} from "lucide-react";
import { useState, useEffect } from "react";
import { blogService } from "@/services/blogService";
import { generateAndPopulateBlogContent } from "@/scripts/generateBlogContent";

const setupSQL = `-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_time_minutes INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  author_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_categories table
CREATE TABLE blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color_class TEXT DEFAULT 'bg-blue-100 text-blue-800',
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_statistics table
CREATE TABLE blog_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_tags table
CREATE TABLE blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Public can read blog categories" ON blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can read blog statistics" ON blog_statistics
  FOR SELECT USING (true);

CREATE POLICY "Public can read blog tags" ON blog_tags
  FOR SELECT USING (true);

-- Insert initial data
INSERT INTO blog_categories (name, description, color_class) VALUES
('Angular', 'Angular framework tutorials and best practices', 'bg-red-100 text-red-800'),
('TypeScript', 'TypeScript language features and advanced patterns', 'bg-blue-100 text-blue-800'),
('Career', 'Career development and professional growth', 'bg-green-100 text-green-800'),
('Python', 'Python programming and development', 'bg-yellow-100 text-yellow-800'),
('Enterprise', 'Enterprise development and architecture', 'bg-purple-100 text-purple-800'),
('Accessibility', 'Web accessibility and inclusive design', 'bg-teal-100 text-teal-800'),
('E-commerce', 'E-commerce development and solutions', 'bg-orange-100 text-orange-800'),
('State Management', 'State management patterns and libraries', 'bg-cyan-100 text-cyan-800');

INSERT INTO blog_statistics (label, value, icon_name, sort_order) VALUES
('Technical Articles', '0+', 'BookOpen', 1),
('Monthly Readers', '0+', 'Users', 2),
('Developer Engagement', '0%', 'Heart', 3),
('Community Reach', '0+', 'TrendingUp', 4);`;

interface ConnectionStatus {
  connected: boolean;
  tablesExist: boolean;
  error?: string;
}

const BlogSetup = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [sqlCopied, setSqlCopied] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connectionStatus = await blogService.getConnectionStatus();
      setStatus(connectionStatus);

      // If tables exist, clear any previous error messages
      if (connectionStatus.tablesExist) {
        setMessage('✅ Database tables are ready! You can now generate content.');
      }
    } catch (err) {
      setStatus({
        connected: false,
        tablesExist: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setIsChecking(false);
    }
  };

  const copySQL = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(setupSQL);
        setSqlCopied(true);
        setTimeout(() => setSqlCopied(false), 2000);
        return;
      }

      // Fallback method for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = setupSQL;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        setSqlCopied(true);
        setTimeout(() => setSqlCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        // Show the SQL in a modal or alert as last resort
        alert('Copy failed. Please manually copy the SQL from the text area below.');
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy SQL:', err);
      // Show the SQL in a modal or alert as last resort
      alert('Copy failed. Please manually copy the SQL from the text area below.');
    }
  };

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setMessage('🤖 Generating AI-powered blog content...');
    
    try {
      await generateAndPopulateBlogContent();
      setMessage('🎉 Blog content generated successfully!');
      await checkConnection(); // Refresh status
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setMessage(`❌ Content generation failed: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsertBasicData = async () => {
    setIsGenerating(true);
    setMessage('📋 Inserting basic categories and statistics...');
    
    try {
      await blogService.insertBasicData();
      setMessage('✅ Basic data inserted successfully!');
      await checkConnection(); // Refresh status
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setMessage(`❌ Basic data insertion failed: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">AI Blog System Setup</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Set up your Supabase database tables to enable the AI-powered blog management system.
          </p>
        </div>

        {/* Connection Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Supabase Connection:</span>
                    {isChecking ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Checking...</span>
                      </div>
                    ) : status?.connected ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>Connection Error</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button onClick={checkConnection} size="sm" variant="outline" disabled={isChecking}>
                  {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Recheck'}
                </Button>
              </div>

              {status?.connected && (
                <div className="flex items-center gap-4">
                  <span className="font-medium">Database Tables:</span>
                  {status.tablesExist ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Tables Exist</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>Tables Missing</span>
                    </div>
                  )}
                </div>
              )}

              {status?.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{status.error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Message */}
        {message && (
          <Card className="mb-8 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="p-4">
              <p className="text-blue-800 dark:text-blue-200 text-center">{message}</p>
            </CardContent>
          </Card>
        )}

        {/* Setup Steps */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Manual Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Manual Database Setup
              </CardTitle>
              <CardDescription>
                Create tables manually in Supabase dashboard (Recommended)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Step 1: Access Supabase Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  Go to your Supabase project dashboard and open the SQL Editor
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://supabase.com/dashboard/project/mrhdiilrbvrwwwhdocnr/sql" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open SQL Editor
                  </a>
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Step 2: Run Setup SQL</h4>
                <p className="text-sm text-muted-foreground">
                  Copy the SQL below and paste it into the SQL Editor, then click "Run"
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Complete SQL Script:</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={copySQL}
                    >
                      {sqlCopied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy SQL
                        </>
                      )}
                    </Button>
                  </div>
                  <textarea
                    readOnly
                    value={setupSQL}
                    className="w-full h-32 p-3 text-xs font-mono bg-muted border rounded-lg resize-none"
                    onClick={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.select();
                    }}
                    title="Click to select all text, then Ctrl+C to copy"
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Click the text area above to select all, then press Ctrl+C (or Cmd+C on Mac) to copy
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Step 3: Verify Setup</h4>
                <p className="text-sm text-muted-foreground">
                  Return here and click "Recheck" to verify the tables were created
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Automatic Setup (if tables exist) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Content Generation
              </CardTitle>
              <CardDescription>
                Generate AI-powered blog content (requires tables to exist first)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {status?.tablesExist ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">✅ Database tables are ready!</p>
                  </div>
                  
                  <Button 
                    onClick={handleInsertBasicData} 
                    disabled={isGenerating}
                    className="w-full"
                    variant="secondary"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Working...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Insert Basic Data
                      </>
                    )}
                  </Button>

                  <Button 
                    onClick={handleGenerateContent} 
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate AI Blog Content
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ Database tables must be created first before generating content.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Why manual setup?</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                      <li>Supabase doesn't allow DDL operations from client code</li>
                      <li>Tables must be created through the dashboard</li>
                      <li>This ensures proper security and permissions</li>
                      <li>One-time setup required per project</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Environment Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <strong>Supabase URL:</strong>
                <Badge variant={import.meta.env.VITE_SUPABASE_URL ? "default" : "destructive"}>
                  {import.meta.env.VITE_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <strong>Supabase Key:</strong>
                <Badge variant={import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "default" : "destructive"}>
                  {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✅ Configured' : '❌ Missing'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <strong>Project ID:</strong>
                <span className="font-mono text-xs">mrhdiilrbvrwwwhdocnr</span>
              </div>
              <div className="flex items-center justify-between">
                <strong>Connection Status:</strong>
                <Badge variant={status?.connected ? "default" : "destructive"}>
                  {status?.connected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🚀 Complete Blog Management System</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Once the database is set up, you'll have access to a full-featured AI-powered blog management system 
              with real-time analytics, content generation, and professional-grade functionality.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2">🤖 AI Content Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Generates authentic blog posts based on 11+ years of real development experience and expertise.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Real-time Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Live tracking of views, likes, engagement metrics with automated statistics updates.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚡ Full CRUD Operations</h4>
                <p className="text-sm text-muted-foreground">
                  Complete blog management with search, categories, tags, and admin controls.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BlogSetup;
