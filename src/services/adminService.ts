export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'admin' | 'editor' | 'viewer';
  permissions: AdminPermission[];
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminPermission {
  action: string;
  resource: string;
  granted: boolean;
}

export interface AdminSession {
  userId: string;
  email: string;
  role: string;
  permissions: AdminPermission[];
  loginTime: number;
  expiryTime: number;
}

class AdminService {
  private static readonly SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours
  private static readonly STORAGE_KEYS = {
    SESSION: 'adminSession',
    USERS: 'adminUsers'
  };

  // Default admin users with different roles
  private readonly defaultAdminUsers: AdminUser[] = [
    {
      id: 'super-admin-1',
      email: 'ahmed.rehan@admin.com',
      name: 'Ahmed Rehan',
      role: 'super-admin',
      permissions: this.getSuperAdminPermissions(),
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'admin-1',
      email: 'admin@blog.com',
      name: 'Blog Administrator',
      role: 'admin',
      permissions: this.getAdminPermissions(),
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'editor-1',
      email: 'editor@blog.com',
      name: 'Content Editor',
      role: 'editor',
      permissions: this.getEditorPermissions(),
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'viewer-1',
      email: 'viewer@blog.com',
      name: 'Content Viewer',
      role: 'viewer',
      permissions: this.getViewerPermissions(),
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];

  private readonly credentials = {
    'ahmed.rehan@admin.com': { password: 'AdminBlog2024!', adminKey: 'AR_BLOG_ADMIN_KEY_2024' },
    'admin@blog.com': { password: 'Admin123!', adminKey: 'BLOG_ADMIN_KEY_2024' },
    'editor@blog.com': { password: 'Editor123!', adminKey: 'BLOG_EDITOR_KEY_2024' },
    'viewer@blog.com': { password: 'Viewer123!', adminKey: 'BLOG_VIEWER_KEY_2024' }
  };

  constructor() {
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers(): void {
    const existingUsers = this.getAllUsers();
    if (existingUsers.length === 0) {
      localStorage.setItem(AdminService.STORAGE_KEYS.USERS, JSON.stringify(this.defaultAdminUsers));
    }
  }

  private getSuperAdminPermissions(): AdminPermission[] {
    return [
      { action: '*', resource: '*', granted: true }, // Full access
    ];
  }

  private getAdminPermissions(): AdminPermission[] {
    return [
      { action: 'read', resource: 'posts', granted: true },
      { action: 'write', resource: 'posts', granted: true },
      { action: 'delete', resource: 'posts', granted: true },
      { action: 'read', resource: 'analytics', granted: true },
      { action: 'read', resource: 'users', granted: true },
      { action: 'write', resource: 'database', granted: true },
      { action: 'generate', resource: 'content', granted: true },
      { action: 'schedule', resource: 'posts', granted: true },
      { action: 'backup', resource: 'system', granted: true }
    ];
  }

  private getEditorPermissions(): AdminPermission[] {
    return [
      { action: 'read', resource: 'posts', granted: true },
      { action: 'write', resource: 'posts', granted: true },
      { action: 'read', resource: 'analytics', granted: true },
      { action: 'generate', resource: 'content', granted: true },
      { action: 'schedule', resource: 'posts', granted: true }
    ];
  }

  private getViewerPermissions(): AdminPermission[] {
    return [
      { action: 'read', resource: 'posts', granted: true },
      { action: 'read', resource: 'analytics', granted: true }
    ];
  }

  public async authenticate(email: string, password: string, adminKey: string): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
    try {
      const users = this.getAllUsers();
      const user = users.find(u => u.email === email && u.isActive);
      
      if (!user) {
        return { success: false, error: 'User not found or inactive' };
      }

      const credentials = this.credentials[email as keyof typeof this.credentials];
      if (!credentials || credentials.password !== password || credentials.adminKey !== adminKey) {
        return { success: false, error: 'Invalid credentials' };
      }

      const session: AdminSession = {
        userId: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        loginTime: Date.now(),
        expiryTime: Date.now() + AdminService.SESSION_DURATION
      };

      localStorage.setItem(AdminService.STORAGE_KEYS.SESSION, JSON.stringify(session));
      
      // Update last login
      user.lastLogin = new Date().toISOString();
      this.updateUser(user);

      return { success: true, session };
    } catch (error) {
      return { success: false, error: 'Authentication failed' };
    }
  }

  public getCurrentSession(): AdminSession | null {
    try {
      const sessionData = localStorage.getItem(AdminService.STORAGE_KEYS.SESSION);
      if (!sessionData) return null;

      const session: AdminSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > session.expiryTime) {
        this.logout();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  public hasPermission(action: string, resource: string): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    // Super admin has all permissions
    if (session.permissions.some(p => p.action === '*' && p.resource === '*' && p.granted)) {
      return true;
    }

    // Check specific permission
    return session.permissions.some(p => 
      (p.action === action || p.action === '*') && 
      (p.resource === resource || p.resource === '*') && 
      p.granted
    );
  }

  public logout(): void {
    localStorage.removeItem(AdminService.STORAGE_KEYS.SESSION);
  }

  public getAllUsers(): AdminUser[] {
    try {
      const usersData = localStorage.getItem(AdminService.STORAGE_KEYS.USERS);
      return usersData ? JSON.parse(usersData) : [];
    } catch {
      return [];
    }
  }

  public getUserById(id: string): AdminUser | null {
    const users = this.getAllUsers();
    return users.find(u => u.id === id) || null;
  }

  public updateUser(updatedUser: AdminUser): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(AdminService.STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }

  public createUser(userData: Omit<AdminUser, 'id' | 'createdAt'>): AdminUser {
    const newUser: AdminUser = {
      ...userData,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const users = this.getAllUsers();
    users.push(newUser);
    localStorage.setItem(AdminService.STORAGE_KEYS.USERS, JSON.stringify(users));
    
    return newUser;
  }

  public deactivateUser(userId: string): void {
    const user = this.getUserById(userId);
    if (user) {
      user.isActive = false;
      this.updateUser(user);
    }
  }

  public getCredentialsForDemo() {
    return Object.entries(this.credentials).map(([email, creds]) => ({
      email,
      password: creds.password,
      adminKey: creds.adminKey,
      role: this.getAllUsers().find(u => u.email === email)?.role || 'unknown'
    }));
  }
}

export const adminService = new AdminService();
