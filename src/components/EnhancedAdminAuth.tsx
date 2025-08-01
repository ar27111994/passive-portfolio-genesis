import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Shield, Eye, EyeOff, Key, Users, Crown, Edit, Search } from "lucide-react";
import { AdminSession, adminService } from '@/services/adminService';

interface EnhancedAdminAuthProps {
  onAuthenticated: (session: AdminSession) => void;
}

const EnhancedAdminAuth = ({ onAuthenticated }: EnhancedAdminAuthProps) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    adminKey: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const demoCredentials = adminService.getCredentialsForDemo();

  useEffect(() => {
    // Check if user is already authenticated
    const session = adminService.getCurrentSession();
    if (session) {
      onAuthenticated(session);
    }
  }, [onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await adminService.authenticate(
        credentials.email,
        credentials.password,
        credentials.adminKey
      );

      if (result.success && result.session) {
        onAuthenticated(result.session);
      } else {
        setError(result.error || 'Authentication failed');
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

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    const selectedCreds = demoCredentials.find(cred => cred.role === role);
    if (selectedCreds) {
      setCredentials({
        email: selectedCreds.email,
        password: selectedCreds.password,
        adminKey: selectedCreds.adminKey
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin': return <Crown className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'editor': return <Edit className="w-4 h-4" />;
      case 'viewer': return <Search className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super-admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'admin': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'editor': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'viewer': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Enhanced Admin Authentication</CardTitle>
          <CardDescription>
            Multi-role access control for blog administration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Role Selection */}
          <div className="space-y-3">
            <Label>Quick Role Selection (Demo)</Label>
            <Select value={selectedRole} onValueChange={handleRoleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a demo role to auto-fill credentials" />
              </SelectTrigger>
              <SelectContent>
                {demoCredentials.map((cred) => (
                  <SelectItem key={cred.email} value={cred.role}>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(cred.role)}
                      <span className="capitalize">{cred.role.replace('-', ' ')}</span>
                      <Badge variant="outline" className={getRoleColor(cred.role)}>
                        {cred.email}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
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
                  {showAdminKey ? <EyeOff className="h-4 w-4" /> : <Key className="h-4 w-4" />}
                </Button>
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

          {/* Demo Credentials Display */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-3">Demo Credentials by Role:</p>
            <div className="grid gap-3">
              {demoCredentials.map((cred) => (
                <div key={cred.email} className="p-3 bg-background rounded border">
                  <div className="flex items-center gap-2 mb-2">
                    {getRoleIcon(cred.role)}
                    <Badge className={getRoleColor(cred.role)}>
                      {cred.role.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p><strong>Email:</strong> {cred.email}</p>
                    <p><strong>Password:</strong> {cred.password}</p>
                    <p><strong>Admin Key:</strong> {cred.adminKey}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Descriptions */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-sm font-medium mb-2">Role Permissions:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Super Admin:</strong> Full system access, user management, all operations</p>
              <p><strong>Admin:</strong> Content management, analytics, database operations</p>
              <p><strong>Editor:</strong> Content creation, editing, scheduling</p>
              <p><strong>Viewer:</strong> Read-only access to content and analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdminAuth;
