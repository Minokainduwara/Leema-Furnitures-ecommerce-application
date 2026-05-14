import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api"; 

const SalesIcon = () => (
  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h1l2 9h13l2-9h1" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 10V6a4 4 0 00-8 0v4" />
  </svg>
);

const OrderIcon = () => (
  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 7a2 2 0 012-2h6a2 2 0 012 2M7 7v10a2 2 0 002 2h6a2 2 0 002-2V7" />
  </svg>
);

const ProductIcon = () => (
  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l10 7 10-7" />
  </svg>
);

function SellerDashboard() {
  const [sidebaropen, setsidebar] = useState(false);
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
  });

  const [loading, setLoading] = useState(true);
  const sideBarItems = [
    { name: "Dashboard", icon: "/images/dashboard.png", path: "/dashboard" },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Category", icon: "/images/products.png", path: "/category" },
    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    { name: "Repair", icon: "/images/products.png", path: "/repairs" },
    {
      name: "Customer Details",
      icon: "/images/Details.png",
      path: "/customers",
    },
    { name: "Promotions", icon: "/images/promotion.png", path: "/promotions" },
    { name: "Messages", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png", path: "/profile" },
  ];

  // ✅ SINGLE API CALL (YOUR BACKEND)
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await authFetch("http://localhost:8080/api/dashboard/seller");

        if (!res.ok) throw new Error("Dashboard API failed");

        const data = await res.json();

        setDashboard({
          totalSales: data.totalSales,
          totalProducts: data.totalProducts,
          totalOrders: data.totalOrders,
          totalCategories: data.totalCategories,
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Total Sales",
      value: loading ? "..." : `Rs ${dashboard.totalSales}`,
      icon: <SalesIcon />,
      description: "Total revenue from orders",
    },
    {
      title: "Orders",
      value: loading ? "..." : dashboard.totalOrders,
      icon: <OrderIcon />,
      description: "All placed orders",
    },
    {
      title: "Products",
      value: loading ? "..." : dashboard.totalProducts,
      icon: <ProductIcon />,
      description: "Total products in store",
    },
    {
      title: "Categories",
      value: loading ? "..." : dashboard.totalCategories,
      icon: <ProductIcon />,
      description: "Total product categories",
    },
  ];

  return (
    <div className="min-h-screen flex bg-white">

      {/* ✅ YOUR SIDEBAR (UNCHANGED 100%) */}
      <aside
              className={`bg-gray-900 w-70 h-screen fixed shadow-lg z-20 ${
                sidebaropen ? "translate-x-0" : "-translate-x-64"
              } lg:translate-x-0 lg:static transition-all flex flex-col`}
            >
              <div className="flex items-center gap-2 p-4 border-b border-white">
                <img src="/images/leemalogo.jpg" className="h-6 w-18" />
                <span className="font-bold text-white">Seller Dashboard</span>
              </div>
      
              <nav className="flex-1 mt-6">
                {sideBarItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path!}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-500"
                  >
                    <img src={item.icon} className="w-6 h-6" />
                    <span className="text-white">{item.name}</span>
                  </Link>
                ))}
              </nav>
      
              <div className="p-4 border-t border-white">
                <button className="w-full bg-red-500 text-white py-2 rounded">
                  Logout
                </button>
              </div>
            </aside>

      {/* MAIN */}
      <main className="w-full min-h-screen p-6">

        <h1 className="text-2xl font-bold mb-6 text-gray-700">Dashboard</h1>

        {/* CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-white shadow shadow-lg rounded-xl p-6 border">
              <div className="flex items-center gap-3">
                {card.icon}
                <div className="text-lg font-semibold text-gray-700">{card.title}</div>
              </div>

              <div className="text-2xl font-bold mt-3 text-gray-400">{card.value}</div>

              <div className="text-sm text-gray-500 mt-2">
                {card.description}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default SellerDashboard;