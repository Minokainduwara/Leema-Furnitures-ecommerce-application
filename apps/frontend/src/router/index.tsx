import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ForbiddenPage from "../pages/ForbiddenPage";
import AdminLayout from "../pages/admin-pages/AdminLayout";
import RequireAuth from "../guards/RequireAuth";




// ─── Lazy page chunks ─────────────────────────────────────────────────────────

const DashboardPage = lazy(() => import("../pages/admin-pages/DashboardPage"));
const ProductsPage = lazy(() => import("../pages/admin-pages/ProductsPage"));
const UsersPage = lazy(() => import("../pages/admin-pages/UsersPage"));
const ServicesPage = lazy(() => import("../pages/admin-pages/ServicesPage"));
const AnalyticsPage = lazy(() => import("../pages/admin-pages/AnalyticsPage"));
const ProfilePage   = lazy(() => import("../pages/admin-pages/ProfilePage"));

const LoginPage     = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
const Home = lazy(() => import("../pages/Home"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const Products = lazy(() => import("../pages/Products"));
const ContactUs = lazy(() => import("../pages/ContactUs"));

const UserDashboard = lazy(() => import("../pages/user-pages/UserDashboard"));
const UserLayout = lazy(() => import("../pages/user-pages/userLayout"));
const UserDetailsPage = lazy(() => import("../pages/user-pages/UserDetailsPage"));
const UserOrdersPage = lazy(() => import("../pages/user-pages/UserOrdersPage"));
const UserServicesPage = lazy(() => import("../pages/user-pages/UserServicesPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("../pages/OrderSuccessPage"));
const OrderTrackingPage = lazy(() => import("../pages/OrderTrackingPage"));

const SellerDashboard = lazy(() => import("../pages/SellerDashboard"));
const SellerProductManagement = lazy(() => import("../pages/seller-pages/SellerProductManagement"));
const SellerOrderManagement = lazy(() => import("../pages/seller-pages/SellerOrderManagement"));
const SellerCustomerDetails = lazy(() => import("../pages/seller-pages/SellerCustomerDetails"));
const SellerPromotions = lazy(() => import("../pages/seller-pages/SellerPromotions"));
const SellerMessages = lazy(() => import("../pages/seller-pages/SellerMessage"));
const SellerProfile = lazy(() => import("../pages/seller-pages/SellerProfile"));

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

    {/* PUBLIC ROUTES */}
    <Route path="/" element={S(<Home />)} />
    <Route path="/login" element={S(<LoginPage />)} />
    <Route path="/signup" element={S(<SignupPage />)} />
    <Route path="/about" element={S(<AboutUs />)} />
    <Route path="/products" element={S(<Products />)} />
    <Route path="/contact" element={S(<ContactUs />)} />

    {/* ADMIN ROUTES */}
    <Route
      path="/admin"
      element={
        <RequireAuth allowedRoles={["ADMIN"]}>
          <AdminLayout />
        </RequireAuth>
      }
    >
      <Route index element={S(<DashboardPage />)} />
      
      <Route path="dashboard" element={S(<DashboardPage />)} />

      {/* PRODUCTS */}
      <Route path="products" element={S(<ProductsPage />)} />
      <Route path="products/add" element={S(<AdminAddProduct />)} />
      <Route path="products/edit/:id" element={S(<AdminEditProduct />)} />
      
      {/* CATEGORIES */}
      <Route path="categories" element={S(<AdminCategoryManagement />)} />
      <Route path="categories/add" element={S(<AdminAddCategory />)} />
      <Route path="categories/edit/:id" element={S(<AdminEditCategory />)} />

      {/* OTHER ADMIN */}
      <Route path="users" element={S(<UsersPage />)} />
      <Route path="services" element={S(<ServicesPage />)} />
      <Route path="analytics" element={S(<AnalyticsPage />)} />
      <Route path="profile" element={S(<ProfilePage />)} />
    </Route>

    {/* User Routes */}
    <Route
      path="/user"
      element={
        <RequireAuth allowedRoles={["USER"]}>
          <UserLayout />
        </RequireAuth>
      }
    >
      <Route index element={S(<UserDashboard />)} />
      <Route path="dashboard" element={S(<UserDashboard />)} />
      <Route path="details" element={S(<UserDetailsPage />)} />
      <Route path="orders" element={S(<UserOrdersPage />)} />
      <Route path="services" element={S(<UserServicesPage />)} />
      <Route path="checkout" element={S(<CheckoutPage />)} />
      <Route path="order-success/:orderNumber" element={S(<OrderSuccessPage />)} />
      <Route path="tracking/:id" element={S(<OrderTrackingPage />)} />
    </Route>

    {/* Seller Routes */}
    <Route
      path="/seller"
      element={
        <RequireAuth allowedRoles={["SELLER"]}>
          <SellerDashboard />
        </RequireAuth>
      }
    >
      <Route index element={S(<SellerDashboard />)} />
      <Route path="dashboard" element={S(<SellerDashboard />)} />
      <Route path="products" element={S(<SellerProductManagement />)} />
      <Route path="orders" element={S(<SellerOrderManagement />)} />
      <Route path="customers" element={S(<SellerCustomerDetails />)} />
      <Route path="promotions" element={S(<SellerPromotions />)} />
      <Route  path="messages" element={S(<SellerMessages />)} />
      <Route path="profile" element={S(<SellerProfile />)} />
    </Route>

    {/* Error Routes */}
    <Route path="/forbidden" element={<ForbiddenPage />} />
    <Route path="*" element={<div className="p-8 text-center">404 - Page Not Found</div>} />

  </Routes>


);

export default AppRoutes;