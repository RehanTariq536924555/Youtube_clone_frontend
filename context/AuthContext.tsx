import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null
  });

  // Check for persisted session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored auth data
        const storedAuth = authService.getStoredAuth();
        
        if (storedAuth) {
          // Validate token with backend and get fresh user data
          const validUser = await authService.validateToken(storedAuth.token);
          
          if (validUser) {
            // Verify this is the same account (prevent account switching)
            const isCorrectAccount = authService.verifyAccountMatch(validUser);
            
            if (isCorrectAccount) {
              // Update localStorage with fresh user data (including role)
              authService.storeAuth(validUser, storedAuth.token);
              
              setState({
                user: validUser,
                isAuthenticated: true,
                isLoading: false,
                token: storedAuth.token
              });
            } else {
              // Account mismatch - force logout
              console.error('Account mismatch detected - logging out');
              authService.logout();
              setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                token: null
              });
            }
          } else {
            // Token is invalid, clear storage
            authService.logout();
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              token: null
            });
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          token: null
        });
      }
    };

    initializeAuth();

    // Set up periodic token validation (every 5 minutes)
    const tokenCheckInterval = setInterval(async () => {
      const storedAuth = authService.getStoredAuth();
      if (storedAuth) {
        const validUser = await authService.validateToken(storedAuth.token);
        if (!validUser) {
          // Token expired, logout
          logout();
        } else {
          // Verify account hasn't changed
          const isCorrectAccount = authService.verifyAccountMatch(validUser);
          if (!isCorrectAccount) {
            console.error('Account switched detected - logging out');
            logout();
          }
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(tokenCheckInterval);
  }, []);

  const login = (user: User, token: string) => {
    // Verify account match before login
    const locked = authService.isAccountLocked();
    if (locked) {
      const isCorrectAccount = authService.verifyAccountMatch(user);
      if (!isCorrectAccount) {
        console.error('Attempting to login with different account - blocked');
        alert('You are trying to login with a different account. Please logout first.');
        return;
      }
    }
    
    authService.storeAuth(user, token);
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
      token
    });
  };

  const logout = () => {
    authService.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null
    });
  };

  const updateUser = (updatedUser: User) => {
    if (state.token) {
      authService.storeAuth(updatedUser, state.token);
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};