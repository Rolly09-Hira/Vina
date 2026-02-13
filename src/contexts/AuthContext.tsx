import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { ReactNode, FC } from 'react';
import authService from '../services/authService';
import type { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      console.log('Checking authentication...');
      const data = await authService.checkSession();
      console.log('Auth check result:', data);
      
      if (data?.success && data.authenticated && data.user) {
        setUser(data.user);
        authService.setAuthenticated(true);
      } else {
        setUser(null);
        authService.setAuthenticated(false);
      }
    } catch (error) {
      console.error('Erreur de vérification utilisateur:', error);
      setUser(null);
      authService.setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing authentication...');
      await checkAuth();
      setLoading(false);
    };
    
    initAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      console.log('Logging in with:', email);
      const response = await authService.login({ email, motDePasse: password });
      
      console.log('Login response in context:', response);
      
      if (response.success && response.user) {
        setUser(response.user);
        authService.setAuthenticated(true);
        return { success: true };
      }
      
      return { 
        success: false, 
        message: response.message || 'Échec de la connexion' 
      };
    } catch (error: any) {
      console.error('Login error in context:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Échec de la connexion';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error in context:', error);
    } finally {
      setUser(null);
      authService.setAuthenticated(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};