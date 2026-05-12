import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./hooks/Authcontext";
import Home from "./pages/Home";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProductManagement from "./pages/seller-pages/SellerProductManagement";
import SellerOrderManagement from "./pages/seller-pages/SellerOrderManagement";
import SellerCustomerDetails from "./pages/seller-pages/SellerCustomerDetails";
import SellerPromotions from "./pages/seller-pages/SellerPromotions";
import SellerMessage from "./pages/seller-pages/SellerMessage";
import SellerProfile from "./pages/seller-pages/SellerProfile";
import AddProduct from "./pages/seller-pages/AddProduct";
import EditProduct from "./pages/seller-pages/EditProduct";
import CategoryManagement from "./pages/seller-pages/CategoryManagement";
import AddCategory from "./pages/seller-pages/AddCategory";
import EditCategory from "./pages/seller-pages/EditCategory";
import RepairManagement from "./pages/seller-pages/RepairManagement";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import InventoryDashboard from "./pages/seller-pages/InventoryDashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserDashboard from "./pages/User-pages/UserDashboard";
import Category from "./pages/User-pages/Category";
import ProductDetails from "./pages/User-pages/ProductDetails";
import AddToCart from "./pages/userOrders/AddToCart";
const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
           <Route path="/addtocart" element={<AddToCart/>} />
          
          <Route path="/product/details/:id" element={<ProductDetails />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/category" element={<Category />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/products" element={<SellerProductManagement />} />
          <Route path="/orders" element={<SellerOrderManagement />} />
          <Route path="/customers" element={<SellerCustomerDetails />} />
          <Route path="/promotions" element={<SellerPromotions />} />
          <Route path="/messages" element={<SellerMessage />} />
          <Route path="/profile" element={<SellerProfile />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/category" element={<CategoryManagement />} />
          <Route path="/category/add" element={<AddCategory />} />
          <Route path="/category/edit/:id" element={<EditCategory />} />
          <Route path="/repairs" element={<RepairManagement />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/inventory" element={<InventoryDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
