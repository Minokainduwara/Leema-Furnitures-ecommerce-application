import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import RequireAuth  from "../guards/RequireAuth";
import GuestOnly    from "../guards/GuestOnly";
import AdminLayout  from "../pages/admin-pages/AdminLayout";
import LoginPage    from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import ForbiddenPage from "../pages/ForbiddenPage";

// ─── Lazy-loaded page chunks ──────────────────────────────────────────────────
// Each page is split into its own JS chunk — only loaded when navigated to.

const DashboardPage  = lazy(() => import("../pages/admin-pages/DashboardPage"));
const ProductsPage   = lazy(() => import("../pages/admin-pages/ProductsPage"));
const UsersPage      = lazy(() => import("../pages/admin-pages/UsersPage"));
const ServicesPage   = lazy(() => import("../pages/admin-pages/ServicesPage"));
const AnalyticsPage  = lazy(() => import("../pages/admin-pages/AnalyticsPage"));
const ProfilePage    = lazy(() => import("../pages/admin-pages/ProfilePage"));

// ─── Page loader spinner ──────────────────────────────────────────────────────

const PageLoader: React.FC = () => (
  <div className="flex-1 flex items-center justify-center h-full">
    <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

// ─── Router definition ────────────────────────────────────────────────────────

const router = createBrowserRouter([
  // ── Root redirect ──────────────────────────────────────────────────────────
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // ── Guest-only routes (login) ──────────────────────────────────────────────
  {
    element: <GuestOnly />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },

  // ── Protected admin routes ─────────────────────────────────────────────────
  {
    element: <RequireAuth />,           // any logged-in user
    children: [
      {
        element: <AdminLayout />,       // shared sidebar + topbar shell
        children: [
          // Dashboard — all roles
          {
            path: "dashboard",
            element: withSuspense(<DashboardPage />),
          },
          // Products — all roles
          {
            path: "products",
            element: withSuspense(<ProductsPage />),
          },
          // Users — superadmin + admin only
          {
            element: <RequireAuth allowedRoles={["superadmin", "admin"]} />,
            children: [
              {
                path: "users",
                element: withSuspense(<UsersPage />),
              },
            ],
          },
          // Services — all roles
          {
            path: "services",
            element: withSuspense(<ServicesPage />),
          },
          // Analytics — superadmin + admin only
          {
            element: <RequireAuth allowedRoles={["superadmin", "admin"]} />,
            children: [
              {
                path: "analytics",
                element: withSuspense(<AnalyticsPage />),
              },
            ],
          },
          // Profile — all roles
          {
            path: "profile",
            element: withSuspense(<ProfilePage />),
          },
        ],
      },
    ],
  },

  // ── Error pages ────────────────────────────────────────────────────────────
  {
    path: "403",
    element: <ForbiddenPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;