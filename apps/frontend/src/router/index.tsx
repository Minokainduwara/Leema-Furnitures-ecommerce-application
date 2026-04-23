import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ForbiddenPage from "../pages/ForbiddenPage";

import ProtectedRoute from "../components/ProtectedRoute";
// ─── Lazy page chunks ─────────────────────────────────────────────────────────

const DashboardPage = lazy(() => import("../pages/admin-pages/DashboardPage"));
const ProductsPage  = lazy(() => import("../pages/admin-pages/ProductsPage"));
const UsersPage     = lazy(() => import("../pages/admin-pages/UsersPage"));
const ServicesPage  = lazy(() => import("../pages/admin-pages/ServicesPage"));
const AnalyticsPage = lazy(() => import("../pages/admin-pages/AnalyticsPage"));
const ProfilePage   = lazy(() => import("../pages/admin-pages/ProfilePage"));
const LoginPage     = lazy(() => import("../pages/LoginPage"));
const Home          = lazy(() => import("../pages/Home"));


// ─── Spinner ──────────────────────────────────────────────────────────────────

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const S = (el: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{el}</Suspense>
);

// ─── Routes ───────────────────────────────────────────────────────────────────
// BrowserRouter is provided in main.tsx — no router created here.

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Root → dashboard */}
    <Route index element={<Navigate to="/dashboard" replace />} />

    {/* Public */}
    <Route path="/login" element={S(<LoginPage />)} />
    <Route path="/" element={S(<Home />)} />

    {/* Admin area - wrap with ProtectedRoute */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute requireAdmin>
          {S(<DashboardPage />)}
        </ProtectedRoute>
      }
    />
    <Route
      path="/products"
      element={
        <ProtectedRoute requireAdmin>
          {S(<ProductsPage />)}
        </ProtectedRoute>
      }
    />
    <Route
      path="/users"
      element={
        <ProtectedRoute requireAdmin>
          {S(<UsersPage />)}
        </ProtectedRoute>
      }
    />
    <Route
      path="/services"
      element={
        <ProtectedRoute requireAdmin>
          {S(<ServicesPage />)}
        </ProtectedRoute>
      }
    />
    <Route
      path="/analytics"
      element={
        <ProtectedRoute requireAdmin>
          {S(<AnalyticsPage />)}
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          {S(<ProfilePage />)}
        </ProtectedRoute>
      }
    />

    <Route path="/forbidden" element={<ForbiddenPage />} />
    <Route path="*" element={<div className="p-8">404 - Not Found</div>} />
  </Routes>
);

export default AppRoutes;