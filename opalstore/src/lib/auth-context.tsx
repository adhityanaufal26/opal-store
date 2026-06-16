"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "./types";

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
    // Priority 1: NextAuth session (Google OAuth or credentials)
    if (status === "authenticated" && session?.user) {
      const sessionUser: User = {
        id: (session.user as any).id || "google-user",
        name: session.user.name || "User",
        email: session.user.email || "",
        phone: "",
        role: (session.user as any).role || "user",
        created_at: new Date().toISOString(),
      };
      setUser(sessionUser);
      setIsLoading(false);
      return;
    }

    // Priority 2: localStorage (credentials login)
    if (status === "unauthenticated") {
      const savedUser = localStorage.getItem("opalstore_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("opalstore_user");
        }
      } else {
        setUser(null);
      }
    }

    setIsLoading(status === "loading");
  }, [session, status]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("opalstore_user", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("opalstore_user", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    // Clear local state
    setUser(null);
    localStorage.removeItem("opalstore_user");

    // Also sign out from NextAuth (Google OAuth session)
    signOut({ callbackUrl: "/", redirect: false });
  };

  const isAdmin = user?.role === "admin" || !!(user?.email && user.email.includes("admin"));

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
