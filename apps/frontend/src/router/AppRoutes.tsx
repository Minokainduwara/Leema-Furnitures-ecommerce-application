import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// ─── Public Pages ─────────────────────────────────────────────

const Home = lazy(() => import("../pages/Home"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const ContactUs = lazy(() => import("../pages/ContactUs"));

// ─── User Pages ───────────────────────────────────────────────

const UserDashboard = lazy(() => import("../pages/User-pages/UserDashboard"));
const Category = lazy(() => import("../pages/User-pages/Category"));
const ProductDetails = lazy(() => import("../pages/User-pages/ProductDetails"));
const AddToCart = lazy(() => import("../pages/userOrders/AddToCart"));

// ─── Seller Pages ────────────────────────────────────────────

const SellerDashboard = lazy(() => import("../pages/SellerDashboard"));
const SellerProductManagement = lazy(() => import("../pages/seller-pages/SellerProductManagement"));
const SellerOrderManagement = lazy(() => import("../pages/seller-pages/SellerOrderManagement"));
const SellerCustomerDetails = lazy(() => import("../pages/seller-pages/SellerCustomerDetails"));
const SellerPromotions = lazy(() => import("../pages/seller-pages/SellerPromotions"));
const SellerMessage = lazy(() => import("../pages/seller-pages/SellerMessage"));
const SellerProfile = lazy(() => import("../pages/seller-pages/SellerProfile"));
const AddProduct = lazy(() => import("../pages/seller-pages/AddProduct"));
const EditProduct = lazy(() => import("../pages/seller-pages/EditProduct"));
const CategoryManagement = lazy(() => import("../pages/seller-pages/CategoryManagement"));
const AddCategory = lazy(() => import("../pages/seller-pages/AddCategory"));
const EditCategory = lazy(() => import("../pages/seller-pages/EditCategory"));
const RepairManagement = lazy(() => import("../pages/seller-pages/RepairManagement"));
const InventoryDashboard = lazy(() => import("../pages/seller-pages/InventoryDashboard"));

// ─── Admin Pages ─────────────────────────────────────────────

const AdminLayout = lazy(() => import("../pages/admin-pages/AdminLayout"));
const DashboardPage = lazy(() => import("../pages/admin-pages/DashboardPage"));
const ProductsPage = lazy(() => import("../pages/admin-pages/ProductsPage"));
const UsersPage = lazy(() => import("../pages/admin-pages/UsersPage"));
const ServicesPage = lazy(() => import("../pages/admin-pages/ServicesPage"));
const AnalyticsPage = lazy(() => import("../pages/admin-pages/AnalyticsPage"));
const ProfilePage = lazy(() => import("../pages/admin-pages/ProfilePage"));

const ForbiddenPage = lazy(() => import("../pages/ForbiddenPage"));
const ProtectedRoute = lazy(() => import("../components/ProtectedRoute"));

// ─── Loader ──────────────────────────────────────────────────

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-7 h-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const S = (el: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{el}</Suspense>
);

// ─── Routes ──────────────────────────────────────────────────

const AppRoutes: React.FC = () => {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={S(<Home />)} />
      <Route path="/login" element={S(<LoginPage />)} />
      <Route path="/signup" element={S(<SignupPage />)} />
      <Route path="/aboutus" element={S(<AboutUs />)} />
      <Route path="/contactus" element={S(<ContactUs />)} />

      {/* User Routes */}
      <Route path="/user/dashboard" element={S(<UserDashboard />)} />
      <Route path="/user/category" element={S(<Category />)} />
      <Route path="/product/details/:id" element={S(<ProductDetails />)} />
      <Route path="/addtocart" element={S(<AddToCart />)} />

      {/* Seller Routes */}
      <Route path="/seller/dashboard" element={S(<SellerDashboard />)} />
      <Route path="/products" element={S(<SellerProductManagement />)} />
      <Route path="/orders" element={S(<SellerOrderManagement />)} />
      <Route path="/customers" element={S(<SellerCustomerDetails />)} />
      <Route path="/promotions" element={S(<SellerPromotions />)} />
      <Route path="/messages" element={S(<SellerMessage />)} />
      <Route path="/profile" element={S(<SellerProfile />)} />
      <Route path="/products/add" element={S(<AddProduct />)} />
      <Route path="/products/edit/:id" element={S(<EditProduct />)} />
      <Route path="/category" element={S(<CategoryManagement />)} />
      <Route path="/category/add" element={S(<AddCategory />)} />
      <Route path="/category/edit/:id" element={S(<EditCategory />)} />
      <Route path="/repairs" element={S(<RepairManagement />)} />
      <Route path="/inventory" element={S(<InventoryDashboard />)} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={S(<DashboardPage />)} />
        <Route path="dashboard" element={S(<DashboardPage />)} />
        <Route path="products" element={S(<ProductsPage />)} />
        <Route path="users" element={S(<UsersPage />)} />
        <Route path="services" element={S(<ServicesPage />)} />
        <Route path="analytics" element={S(<AnalyticsPage />)} />
        <Route path="profile" element={S(<ProfilePage />)} />
      </Route>

      {/* Error Routes */}
      <Route path="/forbidden" element={S(<ForbiddenPage />)} />

      <Route
        path="*"
        element={
          <div className="p-8 text-center">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;