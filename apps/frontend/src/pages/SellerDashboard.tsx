import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";
import { getUserName } from "../utils/jwt";
import { LayoutGrid } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const SalesIcon = () => (
  <svg
    className="w-6 h-6 text-blue-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10h1l2 9h13l2-9h1"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 10V6a4 4 0 00-8 0v4"
    />
  </svg>
);

const OrderIcon = () => (
  <svg
    className="w-6 h-6 text-green-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 7h10M7 7a2 2 0 012-2h6a2 2 0 012 2M7 7v10a2 2 0 002 2h6a2 2 0 002-2V7"
    />
  </svg>
);

const ProductIcon = () => (
  <svg
    className="w-6 h-6 text-purple-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l10 7 10-7" />
  </svg>
);

function SellerDashboard() {
  const [sidebaropen, setsidebar] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
  });
  const [inventory, setInventory] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
  });
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [recentServices, setRecentServices] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [ordersData, setOrdersData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    authFetch("http://localhost:8080/api/orders/stats/per-day")
      .then((res) => res.json())
      .then((data) => {
        console.log("RAW orders API:", data);
        const formatted = data.map((d: any) => ({
          date: new Date(d.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          orders: d.orders,
        }));
        setOrdersData(formatted);
      });

    authFetch("http://localhost:8080/api/categories/stats/distribution")
      .then((res) => res.json())
      .then((data) => {
        console.log("CATEGORY DATA:", data);
        console.log("LENGTH:", data.length);
        setCategoryData(data);
      });
  }, []);
  useEffect(() => {
  authFetch("http://localhost:8080/api/categories/stats/status")
    .then((res) => res.json())
    .then((data) => {
      console.log("RAW:", data);

      const formatted = data.map((item: any) => ({
        ...item,
        status: item.status ? "Active" : "Inactive", // ✅ FIX
      }));

      console.log("FORMATTED:", formatted);

      setStatusData(formatted);
    });
}, []);
  useEffect(() => {
    const load = async () => {
      const res = await authFetch(
        "http://localhost:8080/api/orders/pending/count",
      );

      const data = await res.json();
      setPendingCount(data);
    };

    load();
  }, []);
  useEffect(() => {
    const userName = getUserName();
    setName(userName);
  }, []);
  useEffect(() => {
    const loadPendingOrders = async () => {
      try {
        const res = await authFetch("http://localhost:8080/api/orders/pending");

        if (!res.ok) throw new Error("Failed to load pending orders");

        const data = await res.json();
        setPendingOrders(data);
      } catch (err) {
        console.error("Pending orders error:", err);
      }
    };

    loadPendingOrders();
  }, []);
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const res = await authFetch(
          "http://localhost:8080/api/inventory-logs/summary",
        );

        const data = await res.json();
        console.log("Inventory API:", data);

        setInventory(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadInventory();
  }, []);
  useEffect(() => {
    const loadPendingServices = async () => {
      try {
        const res = await authFetch(
          "http://localhost:8080/api/repairs/seller/pending",
        );

        if (!res.ok) throw new Error("Failed to load pending services");

        const data = await res.json();
        setRecentServices(data); // you can rename later
      } catch (err) {
        console.error("Pending services error:", err);
      }
    };

    loadPendingServices();
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
    { name: "Inventory", icon: "/images/inventory.png", path: "/inventory" },
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
        const res = await authFetch(
          "http://localhost:8080/api/dashboard/seller",
        );

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
      value: pendingCount,
      icon: <OrderIcon />,
      description: "All pending orders",
    },
    {
      title: "Products",
      value: loading ? "..." : inventory.totalProducts,
      icon: <Package className="w-6 h-6 text-purple-500" />,
      description: "Total products in store",
    },
    {
      title: "Categories",
      value: loading ? "..." : dashboard.totalCategories,
      icon: <LayoutGrid className="w-6 h-6 text-indigo-500" />,
      description: "Total product categories",
    },
    {
      title: "In Stock",
      value: inventory.inStock,
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      description: "Products available",
    },
    {
      title: "Low Stock",
      value: inventory.lowStock,
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      description: "Stock less than 5",
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <aside
        className={`bg-gray-900 w-56 h-screen fixed shadow-lg z-20 ${
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
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-h-0 overflow-y-auto bg-gray-50 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white px-6 py-4 rounded-xl shadow-sm border mb-6">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Dashboard
          </h1>

          <div className="text-right">
            <p className="text-gray-400 text-sm">Welcome back,</p>
            <p className="font-semibold text-gray-700">{name}</p>
          </div>
        </div>

        {/* CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {card.value}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-gray-100">{card.icon}</div>
              </div>

              <p className="text-xs text-gray-400 mt-3">{card.description}</p>
            </div>
          ))}
        </section>

        {/* PENDING SERVICES */}
        <section className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Pending Services
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3">Order No</th>
                <th>Status</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {recentServices.map((service: any) => (
                <tr
                  key={service.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 text-gray-700">
                    {service.order?.orderNumber || "N/A"}
                  </td>

                  <td>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                      {service.status}
                    </span>
                  </td>

                  <td className="text-right font-medium text-gray-700">
                    Rs {service.estimatedCost ?? "0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* PENDING ORDERS */}
        <section className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Pending Orders
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3">Order No</th>
                <th>Status</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {pendingOrders.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-400">
                    No pending orders
                  </td>
                </tr>
              ) : (
                pendingOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 text-gray-700">{order.orderNumber}</td>

                    <td>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                        {order.status}
                      </span>
                    </td>

                    <td className="text-right font-medium text-gray-700">
                      Rs {order.totalAmount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
        {/* Orders Per Day */}
        <section className="mt-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Orders Per Day
            </h2>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              Analytics
            </span>
          </div>

          {ordersData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={ordersData}>
                <XAxis
                  dataKey="date"
                  tick={{
                    fill: "#111827",
                    fontSize: 13,
                    fontWeight: 600,
                    style: { fill: "#111827", opacity: 1 },
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#111827",
                    fontSize: 12,
                    style: { fill: "#111827", opacity: 1 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                  }}
                />
                <Bar
                  dataKey="orders"
                  radius={[8, 8, 0, 0]}
                  fill="#2563eb"
                  barSize={100}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-400 py-12">
              No order data available
            </div>
          )}
        </section>

        {/* Category Distribution */}
        <section className="mt-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Category Distribution
            </h2>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
              Insights
            </span>
          </div>

          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={60}
                  paddingAngle={4}
                  labelLine={false}
                  label={(entry: any) =>
                    `${entry.category} ${((entry.percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-400 py-12">
              No category data available
            </div>
          )}
        </section>
        <section className="mt-8 bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Category Status
          </h2>

          {statusData.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <XAxis dataKey="status" tick={{ fill: "#111827" }} />
                <YAxis tick={{ fill: "#111827" }} />
                <Tooltip />

                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry: any, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.status === "Active" ? "#22c55e" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
      </main>
    </div>
  );
}

export default SellerDashboard;
