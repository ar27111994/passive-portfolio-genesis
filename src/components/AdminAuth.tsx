import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Shield, Eye, EyeOff, Key } from "lucide-react";

interface AdminAuthProps {
  onAuthenticated: (isAdmin: boolean) => void;
}

const AdminAuth = ({ onAuthenticated }: AdminAuthProps) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    adminKey: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  // Admin authentication configuration
  const ADMIN_CONFIG = {
    email: 'ahmed.rehan@admin.com',
    password: 'AdminBlog2024!',
    adminKey: 'AR_BLOG_ADMIN_KEY_2024'
  };

  useEffect(() => {
    // Check if user is already authenticated as admin
    const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    const adminAuthTime = localStorage.getItem('adminAuthTime');
    
    if (isAdminAuthenticated && adminAuthTime) {
      const authTime = parseInt(adminAuthTime);
      const currentTime = Date.now();
      const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours
      
      if (currentTime - authTime < sessionDuration) {
        onAuthenticated(true);
        return;
      } else {
        // Session expired
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTime');
      }
    }
  }, [onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate admin credentials
      if (
        credentials.email === ADMIN_CONFIG.email &&
        credentials.password === ADMIN_CONFIG.password &&
        credentials.adminKey === ADMIN_CONFIG.adminKey
      ) {
        // Set admin authentication
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminAuthTime', Date.now().toString());
        
        onAuthenticated(true);
      } else {
        setError('Invalid admin credentials. Please check your email, password, and admin key.');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Authentication</CardTitle>
          <CardDescription>
            Access the blog administration panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter admin email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter admin password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="adminKey">Admin Key</Label>
                <div className="relative">
                  <Input
                    id="adminKey"
                    type={showAdminKey ? 'text' : 'password'}
                    value={credentials.adminKey}
                    onChange={(e) => handleInputChange('adminKey', e.target.value)}
                    placeholder="Enter admin key"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowAdminKey(!showAdminKey)}
                  >
                    {showAdminKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Key className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Lock className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Access Admin Panel
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Email:</strong> ahmed.rehan@admin.com</p>
              <p><strong>Password:</strong> AdminBlog2024!</p>
              <p><strong>Admin Key:</strong> AR_BLOG_ADMIN_KEY_2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
