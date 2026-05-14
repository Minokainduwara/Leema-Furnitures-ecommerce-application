import {createContext, useState, useEffect, type ReactNode, useContext} from "react";

import api from "../api/client";

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<AuthUser>;

  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore auth on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const saveAuthData = (data: AuthResponse): AuthUser => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    const authUser: AuthUser = {
      id: data.userId,
      email: data.email,
      role: data.role.toUpperCase(),
    };

    localStorage.setItem("user", JSON.stringify(authUser));

    setUser(authUser);

    return authUser;
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthUser> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api
        .post("auth/login", {
          json: { email, password },
        })
        .json<AuthResponse>();

      return saveAuthData(response);
    } catch (err: any) {
      const message =
        err?.response?.status === 401
          ? "Invalid credentials"
          : "Login failed";

      setError(message);

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthUser> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api
        .post("auth/register", {
          json: { email, password, name },
        })
        .json<AuthResponse>();

      return saveAuthData(response);
    } catch (err: any) {
      const message = "Signup failed";

      setError(message);

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        await api.post("auth/logout", {
          json: { refreshToken },
        });
      }
    } catch (err) {
      setError("Signup failed");
      throw err;
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}