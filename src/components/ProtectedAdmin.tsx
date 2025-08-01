import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Shield, AlertTriangle } from "lucide-react";
import AdminAuth from './AdminAuth';
import BlogAdminPanel from './BlogAdminPanel';

const ProtectedAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check admin authentication status
    const checkAdminAuth = () => {
      const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
      const adminAuthTime = localStorage.getItem('adminAuthTime');
      
      if (isAdminAuthenticated && adminAuthTime) {
        const authTime = parseInt(adminAuthTime);
        const currentTime = Date.now();
        const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours
        
        if (currentTime - authTime < sessionDuration) {
          setIsAdmin(true);
        } else {
          // Session expired
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('adminAuthTime');
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setIsChecking(false);
    };

    checkAdminAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminAuthTime');
    setIsAdmin(false);
  };

  const handleAuthenticated = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Blog Management System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 dark:text-green-300">Admin Session Active</span>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Security Notice */}
        <Card className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-amber-800 dark:text-amber-200 font-medium">
                  Admin Access Active
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  You have full access to blog management functions. Session expires in 2 hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Panel */}
        <BlogAdminPanel />
      </main>
    </div>
  );
};

export default ProtectedAdmin;
