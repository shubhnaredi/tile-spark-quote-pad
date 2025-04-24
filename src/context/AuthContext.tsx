
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user roles
export type UserRole = 'sales' | 'admin';

// Define user type
export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo (in production this would come from Supabase)
const MOCK_USERS: User[] = [
  { id: '1', name: 'Shubh', role: 'sales', phone: '9876543210' },
  { id: '2', name: 'Admin', role: 'admin', phone: '9876543211' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tileapp_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }
    setLoading(false);
  }, []);

  // Simple login function (in production, this would validate against Supabase)
  const login = async (userId: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication
      // In production, this would call Supabase auth
      const user = MOCK_USERS.find(u => u.id === userId);
      
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      setCurrentUser(user);
      // Save to local storage
      localStorage.setItem('tileapp_user', JSON.stringify(user));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tileapp_user');
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
