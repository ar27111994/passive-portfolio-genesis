import { Shield } from "lucide-react";
import AdminAuth from './AdminAuth';
import AdminPanel from './AdminPanel';
import { useAuth } from '@/hooks/useAuth';

const ProtectedAdmin = () => {
  const { session, loading, user } = useAuth();

  if (loading) {
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
    return <AdminAuth />;
  }

  // This is a temporary solution to pass the session to the AdminPanel.
  // A better solution would be to use a context provider for the admin session.
  const adminSession = {
    userId: user?.id || '',
    email: user?.email || '',
    role: 'super-admin', // This should be replaced with a proper role management system
    permissions: [],
    loginTime: session.created_at ? new Date(session.created_at).getTime() : 0,
    expiryTime: session.expires_at ? session.expires_at * 1000 : 0,
  };

  return <AdminPanel user={user!} onLogout={() => {}} />;
};

export default ProtectedAdmin;
