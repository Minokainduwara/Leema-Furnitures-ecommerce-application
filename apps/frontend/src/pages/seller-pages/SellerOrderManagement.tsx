import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

type OrderItem = {
  name: string;
  qty: number;
};

type Order = {
  id: number;
  customer: string;
  total: string;
  status: string;
  date: string;
  items: OrderItem[];
};

/* ================= ICONS ================= */

const ViewIcon = () => <span>👁️</span>;
const EditIcon = () => <span>✏️</span>;

/* ================= COMPONENT ================= */
function SellerOrderManagement() {
  const Navigate = useNavigate();
  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);

  /* ================= STATE ================= */

  const [orders, setOrders] = useState<Order[]>([
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

  const [search, setSearch] = useState<string>("");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  /* ================= FUNCTIONS ================= */

  const filteredOrders = orders.filter(
    (o) =>
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search),
  );

  const handleViewOrder = (order: Order) => {
    setViewOrder(order);
  };

  const handleOpenStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedOrder) return;

    setSelectedOrder({
      ...selectedOrder,
      status: e.target.value,
    });
  };

  const handleStatusUpdate = () => {
    if (!selectedOrder) return;

    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? selectedOrder : o)),
    );

    setShowStatusModal(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const sideBarItems = [
    { name: "Dashboard", icon: "/images/dashboard.png", path: "/dashboard" },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    {
      name: "Customer Details",
      icon: "/images/Details.png",
      path: "/customers",
    },
    { name: "Promotions", icon: "/images/promotion.png", path: "/promotions" },
    { name: "Messages", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png", path: "/profile" },
  ];

  const navigate = useNavigate();

  return (
    <div
      className={`bg-gray-100 min-h-screen font-sans ${darkmode ? "dark" : ""} flex`}
    >
      {/* Sidebar */}
      <aside
        className={`bg-white w-64 h-screen dark:bg-gray-900 fixed shadow-lg border-r border-gray-200 dark:border-gray-800 z-20 ${
          sidebaropen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 lg:static transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
          <img src="/images/logo.png" alt="Logo" className="h-12 w-12" />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Seller Dashboard
          </span>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setsidebar(false)}
          >
            <img src="/images/close.png" alt="close" className="h-8 w-8 p-1" />
          </button>
        </div>
        <nav className="flex-1 mt-6">
          {sideBarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path!}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition font-medium mb-2"
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 mt-2">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition">
            Logout
          </button>
        </div>
        <div className="mt-auto flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={() => setdarkmode(!darkmode)}
            aria-label="Toggle dark mode"
          >
            {darkmode ? (
              <img src="/images/moon.png" alt="moon" className="w-6 h-6" />
            ) : (
              <img src="/images/sun.png" alt="sun" className="w-6 h-6" />
            )}
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="bg-white flex-1 dark:bg-gray-900 min-h-screen p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 dark:text-gray-100">
            Order Management
          </h2>

          <input
            type="text"
            placeholder="Search by Order ID or Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition text-sm bg-white"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-3 py-2 text-left">Order ID</th>
                <th className="px-3 py-2 text-left">Customer</th>
                <th className="px-3 py-2 text-left">Total</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{order.id}</td>
                  <td className="px-3 py-2">{order.customer}</td>
                  <td className="px-3 py-2 text-green-600 font-semibold">
                    Rs{order.total}
                  </td>

                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-3 py-2">{order.date}</td>

                  <td className="px-3 py-2 flex gap-1">
                    <button
                      className="bg-gray-100 p-1 rounded"
                      onClick={() => navigate(`/vieworder/${order.id}`)}
                    >
                      <ViewIcon />
                    </button>

                    <button
                      className="bg-blue-100 p-1 rounded"
                      onClick={() => navigate(`/updateorder/${order.id}`)}
                    >
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Modal */}
        {viewOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg">
              <h3 className="text-lg font-bold mb-4">Order Details</h3>

              <p>
                <strong>ID:</strong> {viewOrder.id}
              </p>
              <p>
                <strong>Customer:</strong> {viewOrder.customer}
              </p>
              <p>
                <strong>Total:</strong> Rs{viewOrder.total}
              </p>
              <p>
                <strong>Status:</strong> {viewOrder.status}
              </p>

              <ul className="mt-4 list-disc ml-6">
                {viewOrder.items.map((item, i) => (
                  <li key={i}>
                    {item.name} - {item.qty}
                  </li>
                ))}
              </ul>

              <button
                className="mt-4 bg-gray-200 px-4 py-2 rounded"
                onClick={() => setViewOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Status Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4">Update Status</h3>

              <select
                value={selectedOrder.status}
                onChange={handleStatusChange}
                className="w-full border px-3 py-2 rounded mb-4"
              >
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Delivered</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-200 px-4 py-2 rounded"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleStatusUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SellerOrderManagement;
