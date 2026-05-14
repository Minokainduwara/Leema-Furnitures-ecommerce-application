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
const Checkout = lazy(() => import("../pages/Checkout"));
const PaymentSuccess = lazy(() => import("../pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("../pages/PaymentCancel"));

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
const AdminAddProduct = lazy(() => import("../pages/admin-pages/AdminAddProduct"));
const AdminEditProduct = lazy(() => import("../pages/admin-pages/AdminEditProduct"));
const AdminCategoryManagement = lazy(() => import("../pages/admin-pages/AdminCategoryManagement"));
const AdminAddCategory = lazy(() => import("../pages/admin-pages/AdminAddCategory"));
const AdminEditCategory = lazy(() => import("../pages/admin-pages/AdminEditCategory"));
const UsersPage = lazy(() => import("../pages/admin-pages/UsersPage"));
const ServicesPage = lazy(() => import("../pages/admin-pages/ServicesPage"));
const AdminOrdersPage = lazy(() => import("../pages/admin-pages/AdminOrdersPage"));
const AdminAnnouncementsPage = lazy(() => import("../pages/admin-pages/AdminAnnouncementsPage"));
const AnalyticsPage = lazy(() => import("../pages/admin-pages/AnalyticsPage"));
const ProfilePage = lazy(() => import("../pages/admin-pages/ProfilePage"));

const ForbiddenPage = lazy(() => import("../pages/ForbiddenPage"));
const ProtectedRoute = lazy(() => import("../components/ProtectedRoute"));
const PublicLayout = lazy(() => import("../components/PublicLayout"));
const SellerLayout = lazy(() => import("../components/SellerLayout"));

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

      {/* Home keeps its own Header (with hero), no shared navbar */}
      <Route path="/" element={S(<Home />)} />

      {/* All routes that share the orange site navbar */}
      <Route element={S(<PublicLayout />)}>
        <Route path="/login" element={S(<LoginPage />)} />
        <Route path="/signup" element={S(<SignupPage />)} />
        <Route path="/aboutus" element={S(<AboutUs />)} />
        <Route path="/contactus" element={S(<ContactUs />)} />
        <Route path="/user/dashboard" element={S(<UserDashboard />)} />
        <Route path="/user/category" element={S(<Category />)} />
        <Route path="/product/details/:id" element={S(<ProductDetails />)} />
        <Route path="/addtocart" element={S(<AddToCart />)} />
        <Route path="/checkout" element={S(<Checkout />)} />
        <Route path="/payment/success" element={S(<PaymentSuccess />)} />
        <Route path="/payment/cancel" element={S(<PaymentCancel />)} />
      </Route>

      {/* Seller Routes — wrapped in SellerLayout so the site Navbar sits on top */}
      <Route element={S(<SellerLayout />)}>
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
      </Route>

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
        <Route path="users" element={S(<UsersPage />)} />
        <Route path="products" element={S(<ProductsPage />)} />
        <Route path="products/add" element={S(<AdminAddProduct />)} />
        <Route path="products/edit/:id" element={S(<AdminEditProduct />)} />
        <Route path="categories" element={S(<AdminCategoryManagement />)} />
        <Route path="categories/add" element={S(<AdminAddCategory />)} />
        <Route path="categories/edit/:id" element={S(<AdminEditCategory />)} />
        <Route path="orders" element={S(<AdminOrdersPage />)} />
        <Route path="services" element={S(<ServicesPage />)} />
        <Route path="announcements" element={S(<AdminAnnouncementsPage />)} />
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