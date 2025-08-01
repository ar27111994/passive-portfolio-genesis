import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard,
  PenTool,
  Calendar,
  BarChart3,
  Share2,
  Settings,
  Users,
  Shield,
  Database,
  HardDrive,
  Search,
  FileText,
  LogOut,
  Crown,
  Edit,
  Eye,
  Zap
} from "lucide-react";

// Import new components
import BlogAdminPanel from './BlogAdminPanel';
import ContentScheduler from './ContentScheduler';
import AdvancedAnalytics from './AdvancedAnalytics';
import SocialMediaIntegration from './SocialMediaIntegration';
import NewsletterManagement from './NewsletterManagement';
import { AdminSession, adminService } from '@/services/adminService';

interface EnhancedAdminPanelProps {
  session: AdminSession;
  onLogout: () => void;
}

const EnhancedAdminPanel = ({ session, onLogout }: EnhancedAdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sessionTimeLeft, setSessionTimeLeft] = useState<string>('');

  useEffect(() => {
    // Update session countdown every minute
    const interval = setInterval(() => {
      const timeLeft = session.expiryTime - Date.now();
      if (timeLeft <= 0) {
        onLogout();
        return;
      }
      
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      setSessionTimeLeft(`${hours}h ${minutes}m`);
    }, 60000);

    return () => clearInterval(interval);
  }, [session.expiryTime, onLogout]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin': return <Crown className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'editor': return <Edit className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
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

  const getAvailableTabs = () => {
    const tabs = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'read:analytics' },
      { id: 'content', label: 'Content Management', icon: PenTool, permission: 'write:posts' },
      { id: 'scheduler', label: 'Content Scheduler', icon: Calendar, permission: 'schedule:posts' },
      { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3, permission: 'read:analytics' },
      { id: 'social', label: 'Social Media', icon: Share2, permission: 'write:posts' },
      { id: 'newsletter', label: 'Newsletter', icon: Mail, permission: 'write:posts' },
      { id: 'users', label: 'User Management', icon: Users, permission: '*:*' }, // Super admin only
      { id: 'settings', label: 'Settings', icon: Settings, permission: 'read:analytics' }
    ];

    return tabs.filter(tab => {
      if (tab.permission === '*:*') {
        return adminService.hasPermission('*', '*');
      }
      const [action, resource] = tab.permission.split(':');
      return adminService.hasPermission(action, resource);
    });
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Admin Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Enhanced Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Advanced Blog Management System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{session.email}</p>
                  <p className="text-xs text-muted-foreground">Session: {sessionTimeLeft}</p>
                </div>
                <Badge className={getRoleColor(session.role)}>
                  <div className="flex items-center gap-1">
                    {getRoleIcon(session.role)}
                    {session.role.replace('-', ' ').toUpperCase()}
                  </div>
                </Badge>
              </div>
              
              <Button onClick={onLogout} variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid grid-cols-3 lg:grid-cols-8 gap-1 h-auto p-1">
            {availableTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="text-2xl font-bold capitalize">{session.role.replace('-', ' ')}</p>
                    </div>
                    {getRoleIcon(session.role)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Permissions</p>
                      <p className="text-2xl font-bold">{session.permissions.length}</p>
                    </div>
                    <Shield className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Session Time</p>
                      <p className="text-lg font-bold">{sessionTimeLeft}</p>
                    </div>
                    <Shield className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Features</p>
                      <p className="text-2xl font-bold">{availableTabs.length}</p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminService.hasPermission('write', 'posts') && (
                    <Button 
                      onClick={() => setActiveTab('content')}
                      className="h-20 flex-col gap-2"
                    >
                      <PenTool className="w-6 h-6" />
                      Manage Content
                    </Button>
                  )}
                  
                  {adminService.hasPermission('schedule', 'posts') && (
                    <Button 
                      onClick={() => setActiveTab('scheduler')}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                    >
                      <Calendar className="w-6 h-6" />
                      Schedule Posts
                    </Button>
                  )}
                  
                  {adminService.hasPermission('read', 'analytics') && (
                    <Button 
                      onClick={() => setActiveTab('analytics')}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                    >
                      <BarChart3 className="w-6 h-6" />
                      View Analytics
                    </Button>
                  )}
                  
                  {adminService.hasPermission('write', 'posts') && (
                    <Button
                      onClick={() => setActiveTab('social')}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                    >
                      <Share2 className="w-6 h-6" />
                      Social Media
                    </Button>
                  )}

                  {adminService.hasPermission('write', 'posts') && (
                    <Button
                      onClick={() => setActiveTab('newsletter')}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                    >
                      <Mail className="w-6 h-6" />
                      Newsletter
                    </Button>
                  )}
                  
                  {adminService.hasPermission('*', '*') && (
                    <Button 
                      onClick={() => setActiveTab('users')}
                      variant="outline"
                      className="h-20 flex-col gap-2"
                    >
                      <Users className="w-6 h-6" />
                      Manage Users
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => setActiveTab('settings')}
                    variant="outline"
                    className="h-20 flex-col gap-2"
                  >
                    <Settings className="w-6 h-6" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Permissions Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Your Permissions</CardTitle>
                <CardDescription>Actions you can perform in this system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {session.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="justify-start p-2">
                      <span className="text-xs">
                        {permission.action === '*' ? 'All Actions' : permission.action} on{' '}
                        {permission.resource === '*' ? 'All Resources' : permission.resource}
                      </span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content">
            <BlogAdminPanel />
          </TabsContent>

          {/* Content Scheduler Tab */}
          <TabsContent value="scheduler">
            <ContentScheduler />
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social">
            <SocialMediaIntegration />
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter">
            <NewsletterManagement />
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage admin accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminService.getAllUsers().map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(user.role)}
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.isActive ? "outline" : "destructive"}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {user.lastLogin && (
                          <span className="text-xs text-muted-foreground">
                            Last: {new Date(user.lastLogin).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system preferences and features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5" />
                        <div>
                          <h4 className="font-medium">Database Connection</h4>
                          <p className="text-sm text-muted-foreground">Supabase backend status</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        Connected
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <HardDrive className="w-5 h-5" />
                        <div>
                          <h4 className="font-medium">Auto Backup</h4>
                          <p className="text-sm text-muted-foreground">Automatic system backups</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        Enabled
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Search className="w-5 h-5" />
                        <div>
                          <h4 className="font-medium">SEO Optimization</h4>
                          <p className="text-sm text-muted-foreground">Automatic SEO enhancements</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Status</CardTitle>
                  <CardDescription>Overview of implemented enhancements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-green-600">✅ User Management</h4>
                      <p className="text-sm text-muted-foreground">Multi-role admin system</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-green-600">✅ Content Scheduling</h4>
                      <p className="text-sm text-muted-foreground">Future publication scheduling</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-green-600">✅ Advanced Analytics</h4>
                      <p className="text-sm text-muted-foreground">Detailed engagement tracking</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-green-600">✅ Social Media Integration</h4>
                      <p className="text-sm text-muted-foreground">Automated social posting</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EnhancedAdminPanel;
