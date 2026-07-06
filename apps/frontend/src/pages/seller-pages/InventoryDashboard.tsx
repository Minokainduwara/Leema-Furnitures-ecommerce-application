import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch, API_BASE } from "../../utils/api";

function InventoryDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [logFilter, setLogFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NONE");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [sidebaropen] = useState(false);
  const navigate = useNavigate();
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
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  // LOAD DATA
  useEffect(() => {
    Promise.all([
      authFetch(`${API_BASE}/api/products`).then((res) => res.json()),
      authFetch(`${API_BASE}/api/inventory-logs`).then((res) =>
        res.json(),
      ),
    ])
      .then(([productsData, logsData]) => {
        setProducts(productsData || []);
        setLogs(logsData || []);
        setFilteredProducts(productsData || []);
        setLoading(false);
      })

      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (logFilter === "ALL") return true;
    if (logFilter === "IN") return log.quantityChange > 0;
    if (logFilter === "OUT") return log.quantityChange < 0;
    return true;
  });

  const applyFilters = () => {
    let result = [...products];

    // SEARCH
    if (search.trim()) {
      result = result.filter((p) =>
        (p.name || "").toLowerCase().includes(search.toLowerCase()),
      );
    }

    // STOCK FILTER
    if (stockFilter === "IN") {
      result = result.filter((p) => p.stock > 5);
    } else if (stockFilter === "LOW") {
      result = result.filter((p) => p.stock > 0 && p.stock <= 5);
    } else if (stockFilter === "OUT") {
      result = result.filter((p) => p.stock === 0);
    }

    // SORT
    if (sortBy === "HIGH") {
      result.sort((a, b) => b.stock - a.stock);
    } else if (sortBy === "LOW") {
      result.sort((a, b) => a.stock - b.stock);
    }

    setFilteredProducts(result);
  };
  useEffect(() => {
    applyFilters();
  }, [products, search, stockFilter, sortBy]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex text-gray-800">
      {/* ================= SIDEBAR ================= */}
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
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-500 hover:rounded-md"
            >
              <img src={item.icon} className="w-6 h-6" />
              <span className="text-white font-medium">{item.name}</span>
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

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-10 bg-gray-50 overflow-y-auto h-screen">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          {/* ================= FILTER BAR ================= */}

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Inventory Dashboard
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Monitor stock levels and inventory activity
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full md:w-80 px-4 py-2.5 rounded-xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
          />
        </div>
        {/* ================= FILTER BAR (PRO LEVEL UI) ================= */}
<div className="bg-gradient-to-r from-white to-gray-50 p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center gap-4">

  {/* LABEL */}
  <div className="flex items-center gap-2 mr-2">
    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
    <h4 className="text-sm font-semibold text-gray-700">
      Smart Filters
    </h4>
  </div>

  {/* STOCK FILTER */}
  <select
    value={stockFilter}
    onChange={(e) => setStockFilter(e.target.value)}
    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm shadow-sm 
           focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none
           hover:border-blue-300 transition"
  >
    <option value="ALL">📦 All Stock</option>
    <option value="IN">🟢 In Stock</option>
    <option value="LOW">🟠 Low Stock</option>
    <option value="OUT">🔴 Out of Stock</option>
  </select>

  {/* SORT */}
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm shadow-sm 
           focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none
           hover:border-purple-300 transition"
  >
    <option value="NONE">↕ Sort By</option>
    <option value="HIGH">⬆ Stock High → Low</option>
    <option value="LOW">⬇ Stock Low → High</option>
  </select>

  {/* RESET BUTTON */}
  <button
    onClick={() => {
      setStockFilter("ALL");
      setSortBy("NONE");
      setSearch("");
      setFilteredProducts(products);
    }}
    className="ml-auto px-5 py-2.5 rounded-xl text-sm font-medium
           bg-gradient-to-r from-red-500 to-pink-500 text-white
           hover:from-red-600 hover:to-pink-600
           shadow-md hover:shadow-lg transition transform hover:scale-105"
  >
    🔄 Reset Filters
  </button>

</div>
        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Products</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {filteredProducts.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Low Stock</p>
            <h3 className="text-2xl font-bold text-orange-500 mt-2">
              {
                filteredProducts.filter((p) => p.stock < 5 && p.stock > 0)
                    .length
              }
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Out of Stock</p>
            <h3 className="text-2xl font-bold text-red-500 mt-2">
              {filteredProducts.filter((p) => p.stock === 0).length}
            </h3>
          </div>
        </div>

        {/* ================= STOCK TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-10">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Product Stock
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="p-4 text-left font-medium">ID</th>
                  <th className="p-4 text-left font-medium">Product</th>
                  <th className="p-4 text-left font-medium">Stock</th>
                  <th className="p-4 text-left font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      <td className="p-4 text-gray-500">{p.id}</td>

                      <td className="p-4 font-medium text-gray-800">
                        {p.name}
                      </td>

                      <td
                        className={`p-4 font-semibold ${
                          p.stock < 5 ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {p.stock}
                      </td>

                      <td className="p-4">
                        {p.stock === 0 ? (
                          <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 font-medium">
                            Out of Stock
                          </span>
                        ) : p.stock < 5 ? (
                          <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-600 font-medium">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* ================= LOG FILTER BAR ================= */}
<div className="bg-gradient-to-r from-white to-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm mb-4 flex items-center gap-4">

  {/* LEFT LABEL */}
  <div className="flex items-center gap-2">
    <div className="w-2 h-5 bg-green-500 rounded-full"></div>
    <h4 className="text-sm font-semibold text-gray-700">
      Activity Filter
    </h4>
  </div>

  {/* SELECT FILTER */}
  <select
    value={logFilter}
    onChange={(e) => setLogFilter(e.target.value)}
    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm shadow-sm
           focus:ring-2 focus:ring-green-300 focus:border-green-500
           hover:border-green-300 transition outline-none"
  >
    <option value="ALL">📋 All Activity</option>
    <option value="IN">📈 Stock Added</option>
    <option value="OUT">📉 Stock Removed</option>
  </select>

  {/* RIGHT INFO BADGE (optional but professional touch) */}
  <div className="ml-auto text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
    Live Inventory Logs
  </div>

</div>
        {/* ================= INVENTORY LOGS ================= */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-700">
              Inventory Activity
            </h3>
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-5 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {log.product?.name || "Product"}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {log.reason} • Order #{log.order?.id}
                  </p>
                </div>

                <div
                  className={`font-semibold text-lg ${
                    log.quantityChange > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {log.quantityChange > 0 ? "+" : ""}
                  {log.quantityChange}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default InventoryDashboard;