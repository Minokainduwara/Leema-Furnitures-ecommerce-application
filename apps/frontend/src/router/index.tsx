import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RequireAuth   from "../guards/RequireAuth";
import GuestOnly     from "../guards/GuestOnly";
import AdminLayout   from "../pages/admin-pages/AdminLayout";
import LoginPage     from "../pages/LoginPage";
import NotFoundPage  from "../pages/NotFoundPage";
import ForbiddenPage from "../pages/ForbiddenPage";

// ─── Lazy page chunks ─────────────────────────────────────────────────────────

const DashboardPage = lazy(() => import("../pages/admin-pages/DashboardPage"));
const ProductsPage  = lazy(() => import("../pages/admin-pages/ProductsPage"));
const UsersPage     = lazy(() => import("../pages/admin-pages/UsersPage"));
const ServicesPage  = lazy(() => import("../pages/admin-pages/ServicesPage"));
const AnalyticsPage = lazy(() => import("../pages/admin-pages/AnalyticsPage"));
const ProfilePage   = lazy(() => import("../pages/admin-pages/ProfilePage"));

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

    {/* Guest only — redirect logged-in users away */}
    <Route element={<GuestOnly />}>
      <Route path="login" element={<LoginPage />} />
    </Route>

    {/* Protected — any authenticated user */}
    <Route element={<RequireAuth />}>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={S(<DashboardPage />)} />
        <Route path="products"  element={S(<ProductsPage />)} />
        <Route path="services"  element={S(<ServicesPage />)} />
        <Route path="profile"   element={S(<ProfilePage />)} />

        {/* Superadmin + admin only */}
        <Route element={<RequireAuth allowedRoles={["superadmin", "admin"]} />}>
          <Route path="users"     element={S(<UsersPage />)} />
          <Route path="analytics" element={S(<AnalyticsPage />)} />
        </Route>
      </Route>
    </Route>

    {/* Error pages */}
    <Route path="403" element={<ForbiddenPage />} />
    <Route path="*"   element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;