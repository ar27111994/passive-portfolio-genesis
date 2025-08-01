import { useState, useEffect } from 'react';
import { Shield } from "lucide-react";
import AdminAuth from './AdminAuth';
import AdminPanel from './AdminPanel';
import { AdminSession, adminService } from '@/services/adminService';

const ProtectedAdmin = () => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check admin authentication status
    const checkAdminAuth = () => {
      const currentSession = adminService.getCurrentSession();
      setSession(currentSession);
      setIsChecking(false);
    };

    checkAdminAuth();
  }, []);

  const handleLogout = () => {
    adminService.logout();
    setSession(null);
  };

  const handleAuthenticated = (newSession: AdminSession) => {
    setSession(newSession);
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

  if (!session) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  return <AdminPanel session={session} onLogout={handleLogout} />;
};

export default ProtectedAdmin;
