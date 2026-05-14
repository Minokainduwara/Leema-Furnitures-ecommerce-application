import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api"; 
import { getUserName } from "../utils/jwt";

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
  const [name, setName] = useState("");
const [recentOrders, setRecentOrders] = useState([]);
  useEffect(() => {
    const userName = getUserName();
    setName(userName);
  }, []);
  useEffect(() => {
  const loadRecentOrders = async () => {
    try {
      const res = await authFetch("http://localhost:8080/api/orders/recent");

      if (!res.ok) throw new Error("Failed to load recent orders");

      const data = await res.json();
      setRecentOrders(data);
    } catch (err) {
      console.error("Recent orders error:", err);
    }
  };

  loadRecentOrders();
}, []);
  const sideBarItems = [
    {
      name: "Dashboard",
      icon: "/images/dashboard.png",
      path: "/seller/dashboard",
    },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Category", icon: "/images/category.png", path: "/category" },

    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    { name: "Repair", icon: "/images/service.png", path: "/repairs" },
    {
      name: "Customer Details",
      icon: "/images/Details.png",
      path: "/customers",
    },
    
    { name: "notification", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png", path: "/profile" },
  ];

  
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

  const handleLogout = () => {
  if (window.confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("token");
    navigate("/login");
  }
};
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

        <div className="flex justify-between items-center p-4 shadow shadow-xl mb-6">
      
      <h1 className="text-xl font-bold text-gray-700">
        Dashboard
      </h1>

      {/* TOP RIGHT USER NAME */}
      <div className="text-right">
        <p className="text-gray-600 text-sm">Welcome,</p>
        <p className="font-semibold text-gray-500">{name}</p>
      </div>

    </div>

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
        <section className="mt-8 bg-white shadow rounded-xl p-6">
  <h2 className="text-lg font-bold text-gray-700 mb-4">
    Recent Orders
  </h2>

  <table className="w-full border-collapse">
    <thead>
      <tr className="text-left border-b">
        <th className="py-2 text-gray-500">Order No</th>
        <th className="text-gray-500">Status</th>
        <th className="text-gray-500">Amount</th>
      </tr>
    </thead>

    <tbody>
      {recentOrders.map((order: any) => (
        <tr key={order.id} className="border-b hover:bg-gray-50">
          <td className="py-2">{order.orderNumber}</td>
          <td>
            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-600">
              {order.status}
            </span>
          </td>
          <td>Rs {order.totalAmount}</td>
        </tr>
      ))}
    </tbody>
  </table>
</section>
      </main>
    </div>
  );
}

export default SellerDashboard;