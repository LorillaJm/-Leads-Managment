import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@lead-management/shared';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    try {
      const response: any = await apiClient.login(email, password);
      const { user, accessToken } = response.data;
      
      setUser(user);
      apiClient.setAccessToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      apiClient.setAccessToken(null);
      localStorage.removeItem('accessToken');
    }
  };

  const refreshAuth = async () => {
    try {
      const response: any = await apiClient.refreshToken();
      const { user, accessToken } = response.data;
      
      setUser(user);
      apiClient.setAccessToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
    } catch (error) {
      // Refresh failed, clear auth state
      setUser(null);
      apiClient.setAccessToken(null);
      localStorage.removeItem('accessToken');
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      
      if (storedToken) {
        apiClient.setAccessToken(storedToken);
        
        try {
          const response: any = await apiClient.getProfile();
          setUser(response.data.user);
        } catch (error) {
          // Token might be expired, try refresh
          await refreshAuth();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      refreshAuth();
    }, 14 * 60 * 1000); // Refresh every 14 minutes (token expires in 15)

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}