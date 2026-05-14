import React, { createContext, useContext, useState, useEffect } from "react";

// ✅ Response type
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  role: string;
}

// User shape exposed to consumers
export interface AuthUser {
  userId: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;

  signup: (
    email: string,
    password: string,
    name: string,
  ) => Promise<AuthUser>;

  login: (email: string, password: string) => Promise<AuthUser>;

  logout: () => void;

  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "leema_user";

const readUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

const persist = (data: AuthResponse): AuthUser => {
  // Write both token keys so legacy pages (using "token") and the new uiparts
  // pages (using "accessToken") both work without per-page changes.
  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("accessToken", data.accessToken);
  if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("role", data.role);
  localStorage.setItem("userId", String(data.userId));
  localStorage.setItem("email", data.email);

  const user: AuthUser = {
    userId: data.userId,
    email: data.email,
    role: data.role,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("leema:auth-changed"));
  return user;
};

const clear = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("leema:auth-changed"));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(readUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync across tabs and manual localStorage changes
  useEffect(() => {
    const sync = () => setUser(readUser());
    window.addEventListener("storage", sync);
    window.addEventListener("leema:auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("leema:auth-changed", sync);
    };
  }, []);

  const signup = async (
    email: string,
    password: string,
    name: string,
  ): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Signup failed");
      }
      const data: AuthResponse = await res.json();
      const u = persist(data);
      setUser(u);
      return u;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
      }
      const data: AuthResponse = await res.json();
      const u = persist(data);
      setUser(u);
      return u;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
