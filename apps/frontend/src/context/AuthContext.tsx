import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

interface AuthContextType {
  token: string | null;
  role: string | null;
  loading: boolean;
  setToken?: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
          setRole(null);
          setLoading(false);

          navigate("/login");
          return;
        }
        const data = await res.json();
        setRole(data.role);
      
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, role, loading, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}