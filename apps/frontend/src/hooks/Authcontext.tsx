import React, { createContext, useContext, useState, useCallback } from "react";
import type { AuthContextValue, AuthUser, AuthState } from "../types";

// ─── Mock credentials ─────────────────────────────────────────────────────────

const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
  "admin@leema.lk": {
    id:       "u1",
    name:     "Leema Admin",
    email:    "admin@leema.lk",
    role:     "superadmin",
    avatar:   "LA",
    password: "admin123",
  },
  "manager@leema.lk": {
    id:       "u2",
    name:     "Store Manager",
    email:    "manager@leema.lk",
    role:     "manager",
    avatar:   "SM",
    password: "manager123",
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user:      null,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setState((s) => ({ ...s, isLoading: true }));

    // simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const found = MOCK_USERS[email.toLowerCase()];
    if (!found || found.password !== password) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error("Invalid email or password.");
    }

    const { password: _pw, ...user } = found;
    setState({ user, isLoading: false });
  }, []);

  const logout = useCallback((): void => {
    setState({ user: null, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}