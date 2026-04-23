import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ForbiddenPage from "../pages/ForbiddenPage";
import AdminLayout from "../pages/admin-pages/AdminLayout";
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

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={S(<LoginPage />)} />
    <Route path="/" element={S(<Home />)} />

    {/* Admin Routes with Layout */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute requireAdmin>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={S(<DashboardPage />)} />
      <Route path="products" element={S(<ProductsPage />)} />
      <Route path="users" element={S(<UsersPage />)} />
      <Route path="services" element={S(<ServicesPage />)} />
      <Route path="analytics" element={S(<AnalyticsPage />)} />
      <Route path="profile" element={S(<ProfilePage />)} />
    </Route>

    {/* Error Routes */}
    <Route path="/forbidden" element={<ForbiddenPage />} />
    <Route path="*" element={<div className="p-8 text-center">404 - Page Not Found</div>} />
  </Routes>
);

export default AppRoutes;