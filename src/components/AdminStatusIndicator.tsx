import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const AdminStatusIndicator = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
      const adminAuthTime = localStorage.getItem('adminAuthTime');
      
      if (isAdminAuthenticated && adminAuthTime) {
        const authTime = parseInt(adminAuthTime);
        const currentTime = Date.now();
        const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours
        
        if (currentTime - authTime < sessionDuration) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
    
    // Check every minute for session expiry
    const interval = setInterval(checkAdminStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isAdmin) return null;

  return (
    <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300">
      <Shield className="w-3 h-3" />
      Admin
    </Badge>
  );
};

export default AdminStatusIndicator;
