import React, { createContext, useState } from "react";

// ✅ Response type
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  role: string;
}

// ✅ Context type
interface AuthContextType {
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => Promise<AuthResponse>;

  login: (email: string, password: string) => Promise<AuthResponse>;

  isLoading: boolean;
  error: string | null;
}

// ✅ Create context
export const AuthContext = createContext<AuthContextType | null>(null);

// ✅ Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: any): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ signup, login, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};