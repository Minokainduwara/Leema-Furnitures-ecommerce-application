import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem("token"));
};

const isAdminUser = (): boolean => {
  return localStorage.getItem("role") === "ADMIN";
};

function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdminUser()) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;