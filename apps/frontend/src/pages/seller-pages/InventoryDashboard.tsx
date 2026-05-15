import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/api";
function InventoryDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
    { name: "Inventory", icon: "/images/orders.png", path: "/inventory" },
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
      authFetch("http://localhost:8080/api/products").then((res) => res.json()),
      authFetch("http://localhost:8080/api/inventory-logs").then((res) =>
        res.json(),
      ),
    ])
      .then(([productsData, logsData]) => {
        setProducts(productsData || []);
        setLogs(logsData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((p) =>
    (p?.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex text-gray-800">
      {/* ================= SIDEBAR ================= */}
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
      <main className="w-full p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Inventory Dashboard
          </h2>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product..."
            className="border px-3 py-2 rounded border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* ================= STOCK TABLE ================= */}
        <div className="bg-white shadow rounded-lg overflow-x-auto mb-6">
          <h3 className="p-4 font-bold text-gray-800 border-b">
            Product Stock
          </h3>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="p-3">ID</th>
                <th className="p-3">Product</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.id}</td>

                    <td className="p-3 font-semibold text-gray-900">
                      {p.name}
                    </td>

                    <td
                      className={`p-3 font-bold ${
                        p.stock < 5 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {p.stock}
                    </td>

                    <td className="p-3">
                      {p.stock === 0 ? (
                        <span className="text-red-600">Out of Stock</span>
                      ) : p.stock < 5 ? (
                        <span className="text-orange-500">Low Stock</span>
                      ) : (
                        <span className="text-green-600">In Stock</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= INVENTORY LOGS ================= */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <h3 className="p-4 font-bold text-gray-800 border-b">
            Inventory Activity
          </h3>

          <div className="max-h-[400px] overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="border-b p-3 flex justify-between text-sm"
              >
                <div>
                  <p className="font-semibold">
                    {log.product?.name || "Product"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {log.reason} • Order #{log.order?.id}
                  </p>
                </div>

                <div
                  className={`font-bold ${
                    log.quantityChange > 0 ? "text-green-600" : "text-red-600"
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
