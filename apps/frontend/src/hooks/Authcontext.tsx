import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
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

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ attach token helper
  const getToken = () => localStorage.getItem("token");

  // ✅ Load user on refresh
  useEffect(() => {
    const init = async () => {
      try {
        const token = getToken();
        if (!token) {
          setIsLoading(false);
          return;
        }

        const me = await api
          .get("auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .json<AuthUser>();

        setUser(me);
        localStorage.setItem("user", JSON.stringify(me));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // ✅ LOGIN FIXED
  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await api
        .post("auth/login", {
          json: { email, password },
        })
        .json<{ token: string; user: AuthUser }>();

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);
    } catch (err) {
      setError("Invalid email or password");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ SIGNUP FIXED
  const signup = async (email: string, password: string, name: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await api
        .post("auth/signup", {
          json: { email, password, name },
        })
        .json<{ token: string; user: AuthUser }>();

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      setUser(res.user);
    } catch (err) {
      setError("Signup failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGOUT FIXED
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}