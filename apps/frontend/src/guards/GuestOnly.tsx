import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/Authcontext";

// ─── GuestOnly ────────────────────────────────────────────────────────────────
// Prevents authenticated users from accessing the login page.

const GuestOnly: React.FC = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default GuestOnly;