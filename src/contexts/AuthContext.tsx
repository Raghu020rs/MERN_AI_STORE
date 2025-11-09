import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin' | 'moderator';
  stats?: {
    totalReviews: number;
    totalBookmarks: number;
    totalCollections: number;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext(undefined as any);

export const AuthProvider = ({
  children,
}: {
  children: any;
}) => {
  const [user, setUser] = useState(null as any);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Use saved user data immediately for faster load
          setUser(JSON.parse(savedUser));
          
          // Verify token is still valid in background
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch (error) {
          // Token invalid, clear storage
          if (import.meta.env.DEV) {
            console.error('Auth check failed:', error);
          }
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.success) {
        const { user: userData, accessToken } = response.data;
        
        // Save token to localStorage
        localStorage.setItem('accessToken', accessToken);
        
        // Save only essential user data (not sensitive info)
        const essentialUserData = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          role: userData.role
        };
        localStorage.setItem('user', JSON.stringify(essentialUserData));
        
        setUser(userData);
        toast.success('Login successful!');
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      const response = await authAPI.register({
        name,
        email,
        password,
        confirmPassword,
      });

      if (response.success) {
        const { user: userData, accessToken } = response.data;
        
        // Save token to localStorage
        localStorage.setItem('accessToken', accessToken);
        
        // Save only essential user data (not sensitive info)
        const essentialUserData = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          role: userData.role
        };
        localStorage.setItem('user', JSON.stringify(essentialUserData));
        
        setUser(userData);
        toast.success('Registration successful! Welcome to AI Marketplace!');
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      // Even if API call fails, clear local state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      toast.info('Logged out');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Save only essential user data (not sensitive info)
      const essentialUserData = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role
      };
      localStorage.setItem('user', JSON.stringify(essentialUserData));
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
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
