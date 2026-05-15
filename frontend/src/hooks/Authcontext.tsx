import React, { createContext, useContext, useState, useEffect } from "react";
import { authFetch } from "../utils/api";

// ✅ API Response type
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  role: string;
}

// ✅ Frontend User type
export interface User {
  id: number;
  email: string;
  role: string;
  name?: string;
  avatar?: string;
}

// ✅ Context type
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  signup: (data: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => Promise<AuthResponse>;

  login: (email: string, password: string) => Promise<AuthResponse>;

  logout: () => void;

  isLoading: boolean;
  error: string | null;
}

// ✅ Create context
export const AuthContext = createContext<AuthContextType | null>(null);

// ✅ Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ FIX: use User type here
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // ✅ SIGNUP
  const signup = async (data: any): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await authFetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Signup failed");

      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGIN
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data: AuthResponse = await res.json();

      // ✅ Save token
      localStorage.setItem("token", data.accessToken);

      // ✅ Convert API → User
      const userData: User = {
        id: data.userId,
        email: data.email,
        role: data.role,
        name: data.email.split("@")[0],
        avatar: data.email.charAt(0).toUpperCase(),
      };

      // ✅ Save user
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, signup, login, logout, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};