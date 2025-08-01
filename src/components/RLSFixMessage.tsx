import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Copy, CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";

const rlsFixSQL = `-- Add INSERT and UPDATE policies for RLS
CREATE POLICY "Allow public inserts on blog_posts" ON blog_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts on blog_categories" ON blog_categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts on blog_statistics" ON blog_statistics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts on blog_tags" ON blog_tags
  FOR INSERT WITH CHECK (true);

-- Add UPDATE policies for counters and statistics
CREATE POLICY "Allow public updates on blog_posts" ON blog_posts
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public updates on blog_categories" ON blog_categories
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public updates on blog_statistics" ON blog_statistics
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public updates on blog_tags" ON blog_tags
  FOR UPDATE USING (true) WITH CHECK (true);`;

const RLSFixMessage = () => {
  const [copied, setCopied] = useState(false);

  const copySQL = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(rlsFixSQL);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = rlsFixSQL;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <Card className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
          <AlertTriangle className="w-5 h-5" />
          Row Level Security Fix Required
        </CardTitle>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          The database tables exist, but INSERT policies are missing. This prevents creating new blog posts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-orange-100 border border-orange-200 rounded-lg dark:bg-orange-900 dark:border-orange-700">
          <h4 className="font-semibold mb-2 text-orange-800 dark:text-orange-200">Quick Fix:</h4>
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
            Run this SQL in your Supabase SQL Editor to add the missing INSERT and UPDATE policies:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">RLS Policy Fix SQL:</span>
              <Button size="sm" variant="secondary" onClick={copySQL}>
                {copied ? (
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
              value={rlsFixSQL}
              className="w-full h-24 p-2 text-xs font-mono bg-white border rounded dark:bg-gray-800 resize-none"
              onClick={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.select();
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
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
          <div className="text-sm text-muted-foreground">
            Copy the SQL above, paste into SQL Editor, and click "Run"
          </div>
        </div>

        <div className="text-xs text-orange-600 dark:text-orange-400">
          <strong>Why this happened:</strong> Row Level Security (RLS) is enabled on the tables but only SELECT policies exist. 
          INSERT and UPDATE operations need explicit policies to be allowed.
        </div>
      </CardContent>
    </Card>
  );
};

export default RLSFixMessage;
