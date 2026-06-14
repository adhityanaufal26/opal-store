"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User } from './types';
import { mockUsers } from './data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Priority 1: NextAuth session (Google OAuth)
    if (status === 'authenticated' && session?.user) {
      const sessionUser: User = {
        id: (session.user as any).id || 'google-user',
        name: session.user.name || 'User',
        email: session.user.email || '',
        phone: '',
        role: (session.user as any).role || 'user',
        created_at: new Date().toISOString(),
      };
      setUser(sessionUser);
      setIsLoading(false);
      return;
    }

    // Priority 2: localStorage (credentials login)
    if (status === 'unauthenticated') {
      const savedUser = localStorage.getItem('opalstore_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('opalstore_user');
        }
      } else {
        setUser(null);
      }
    }

    setIsLoading(status === 'loading');
  }, [session, status]);

  const login = async (email: string, _password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('opalstore_user', JSON.stringify(foundUser));
      return true;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '',
      role: email.includes('admin') ? 'admin' : 'user',
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('opalstore_user', JSON.stringify(newUser));
    return true;
  };

  const register = async (name: string, email: string, phone: string, _password: string): Promise<boolean> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'user',
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('opalstore_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    // Clear local state
    setUser(null);
    localStorage.removeItem('opalstore_user');
    
    // Also sign out from NextAuth (Google OAuth session)
    signOut({ callbackUrl: '/', redirect: false });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAdmin: user?.role === 'admin',
    }}>
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
