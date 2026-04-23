import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import SellerDashboard from "./pages/seller-pages/SellerDashboard";
import SellerProductManagement from "./pages/seller-pages/SellerProductManagement";
import SellerOrderManagement from "./pages/seller-pages/SellerOrderManagement";
import SellerCustomerDetails from "./pages/seller-pages/SellerCustomerDetails";
import SellerPromotions from "./pages/seller-pages/SellerPromotions";
import SellerMessage from "./pages/seller-pages/SellerMessage";
import SellerProfile from "./pages/seller-pages/SellerProfile";
import ViewOrder from "./pages/seller-pages/ViewOrder";
import UpdateOrder from "./pages/seller-pages/UpdateOrder";
import EditPromotions from "./pages/seller-pages/EditPromotions";
import AddProduct from "./pages/seller-pages/AddProduct";
import EditProduct from "./pages/seller-pages/EditProduct";

function Root() {
  
  const [orders, setOrders] = useState([
    {
      id: 101,
      customer: "Kasun",
      total: "5000",
      status: "Pending",
      date: "2026-04-16",
      items: [
        { name: "Chair", qty: 2 },
        { name: "Table", qty: 1 },
      ],
    },
    {
      id: 102,
      customer: "Nimal",
      total: "8000",
      status: "Confirmed",
      date: "2026-04-15",
      items: [{ name: "Cupboard", qty: 1 }],
    },
  ]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/seller",
      element: <SellerDashboard />,
    },
    {
      path: "/products",
      element: <SellerProductManagement />,
    },
    {
      path: "/dashboard",
      element: <SellerDashboard />,
    },

    
    {
      path: "/orders",
      element: <SellerOrderManagement orders={orders} setOrders={setOrders} />,
    },

    {
      path: "/customers",
      element: <SellerCustomerDetails />,
    },
    {
      path: "/promotions",
      element: <SellerPromotions />,
    },
    {
      path: "/messages",
      element: <SellerMessage />,
    },
    {
      path: "/profile",
      element: <SellerProfile />,
    },

    {
      path: "/vieworder/:id",
      element: <ViewOrder orders={orders} />,
    },
    {
      path: "/updateorder/:id",
      element: <UpdateOrder />,
    },
    {
      path: "/editpromotions/:id",
      element: <EditPromotions />,
    },
    {
      path: "/products/add",
      element: <AddProduct />,
    },
    {
      path: "/products/edit/:id",
      element: <EditProduct />,
    },
  ]);

  return <RouterProvider router={router} />;
}

// ✅ RENDER ROOT COMPONENT
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
