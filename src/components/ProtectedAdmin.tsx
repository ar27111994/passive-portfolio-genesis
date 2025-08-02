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

  if (!session || !user) {
    return <AdminAuth />;
  }

  return <AdminPanel user={user} onLogout={() => {}} />;
};

export default ProtectedAdmin;
