import { Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdminAccessButton = () => {
  const handleAdminAccess = () => {
    window.open('/admin', '_blank');
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Admin Panel Access</CardTitle>
              <CardDescription>
                Manage blog content and AI generation
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            Protected
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-3">
              Access the protected admin panel to:
            </p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Generate AI-powered blog content
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Manage database initialization
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                View analytics and statistics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Create custom blog posts
              </li>
            </ul>
          </div>
          
          <Button 
            onClick={handleAdminAccess}
            className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Shield className="w-4 h-4" />
            Access Admin Panel
            <ExternalLink className="w-4 h-4" />
          </Button>
          
          <div className="text-xs text-muted-foreground text-center p-3 bg-muted/50 rounded-lg">
            <p className="font-medium mb-1">Demo Admin Credentials</p>
            <p>Email: ahmed.rehan@admin.com</p>
            <p>Password: AdminBlog2024!</p>
            <p>Admin Key: AR_BLOG_ADMIN_KEY_2024</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminAccessButton;
