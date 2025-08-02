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
  Mail,
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
import ContentTab from './ContentTab';
import ContentScheduler from './ContentScheduler';
import AnalyticsTab from './AnalyticsTab';
import SocialMediaIntegration from './SocialMediaIntegration';
import NewsletterManagement from './NewsletterManagement';
import AIServiceSetup from './AIServiceSetup';
import DashboardTab from './DashboardTab';
import UserManagement from './UserManagement';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@supabase/supabase-js';

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
}

const AdminPanel = ({ user, onLogout }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { signOut } = useAuth();

  // Safety check for user prop
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading user information...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const tabs = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'content', label: 'Content Management', icon: PenTool },
      { id: 'scheduler', label: 'Content Scheduler', icon: Calendar },
      { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3 },
      { id: 'social', label: 'Social Media', icon: Share2 },
      { id: 'newsletter', label: 'Newsletter', icon: Mail },
      { id: 'ai-setup', label: 'AI Setup', icon: Zap },
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings }
  ];

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
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
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
          <TabsList className="grid grid-cols-3 lg:grid-cols-9 gap-1 h-auto p-1">
            {tabs.map((tab) => {
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
            <DashboardTab />
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content">
            <ContentTab />
          </TabsContent>

          {/* Content Scheduler Tab */}
          <TabsContent value="scheduler">
            <ContentScheduler />
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social">
            <SocialMediaIntegration />
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter">
            <NewsletterManagement />
          </TabsContent>

          {/* AI Setup Tab */}
          <TabsContent value="ai-setup">
            <AIServiceSetup />
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <UserManagement />
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

export default AdminPanel;
