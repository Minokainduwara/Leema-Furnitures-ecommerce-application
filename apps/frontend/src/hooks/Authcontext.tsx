import { createContext, useState, useEffect, type ReactNode } from "react";
import api from "../api/client";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await api.get("auth/me").json<AuthUser>();
          setUser(userData);
        }
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api
        .post("auth/login", {
          json: { email, password },
        })
        .json<{ token: string; user: AuthUser }>();

      localStorage.setItem("token", response.token);
      setUser(response.user);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Login failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api
        .post("auth/signup", {
          json: { email, password, name },
        })
        .json<{ token: string; user: AuthUser }>();

      localStorage.setItem("token", response.token);
      setUser(response.user);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Signup failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await api.post("auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    error,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}