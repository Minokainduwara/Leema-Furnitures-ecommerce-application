import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/Authcontext";
import type { AuthUser } from "../types";

// ─── RequireAuth ──────────────────────────────────────────────────────────────
// Wraps any route that needs the user to be logged in.
// Saves the attempted URL so we can redirect back after login.

interface RequireAuthProps {
  allowedRoles?: AuthUser["role"][];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location             = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;