import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ForbiddenPage from "../pages/ForbiddenPage";
import AdminLayout from "../pages/admin-pages/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
// import CategoryPage from "@/pages/User-pages/Category";
// import ProductDetail from "@/pages/User-pages/ProductDetail";
import UserDashboard from "@/pages/User-pages/UserDashboard";

// ─── Lazy page chunks ─────────────────────────────────────────────────────────

const DashboardPage = lazy(() => import("../pages/admin-pages/DashboardPage"));
const ProductsPage  = lazy(() => import("../pages/admin-pages/ProductsPage"));
const UsersPage     = lazy(() => import("../pages/admin-pages/UsersPage"));
const ServicesPage  = lazy(() => import("../pages/admin-pages/ServicesPage"));
const AnalyticsPage = lazy(() => import("../pages/admin-pages/AnalyticsPage"));
const ProfilePage   = lazy(() => import("../pages/admin-pages/ProfilePage"));
const LoginPage     = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
// const Home          = lazy(() => import("../pages/Home"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const Products = lazy(() => import("../pages/Products"));
const ContactUs = lazy(() => import("../pages/ContactUs"));
// const Category = lazy(() => import("../pages/User-pages/Category"));
// const ProductDetails = lazy(() => import("../pages/User-pages/ProductDetail"));
// const UserDashboard = lazy(() => import("../pages/User-pages/UserDashboard"));
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
    <Route path="/" element={S(<UserDashboard/>)} />
    <Route path="/login" element={S(<LoginPage />)} />
    <Route path="/signup" element={S(<SignupPage />)} />
    <Route path="/about" element={S(<AboutUs />)} />
    <Route path="/products" element={S(<Products />)} />
    <Route path="/contact" element={S(<ContactUs />)} />

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