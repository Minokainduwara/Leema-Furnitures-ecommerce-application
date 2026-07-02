import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/api";

type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  userId: number;
  customerName?: string;
  customerEmail?: string;
  orderNumber?: string;
  createdAt?: string;
};

function SellerMessage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | recent
  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Notification[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Notification | null>(
    null,
  );

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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkmode);
  }, [darkmode]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔍 Token from storage:", token);
      const res = await authFetch(
        "http://localhost:8080/api/notifications/seller",
      );
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const openMessage = async (msg: Notification) => {
    setSelectedMessage(msg);

    if (!msg.read) {
      try {
        await authFetch(
          `http://localhost:8080/api/notifications/${msg.id}/read`,
          {
            method: "PATCH",
          },
        );

        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
        );
      } catch (err) {
        console.error("Mark as read failed", err);
      }
    }
  };
  const filteredMessages = messages.filter((msg) => {
    // SEARCH
    if (
      search &&
      !msg.orderNumber?.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    // FILTER RECENT
    if (filter === "recent") {
      if (!msg.createdAt) return false;

      const created = new Date(msg.createdAt);
      if (isNaN(created.getTime())) return false;

      const now = new Date();
      const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

      return diff <= 24;
    }

    return true;
  });
  return (
    <div className="bg-gray-100 min-h-screen flex">
      <aside
        className={`bg-gray-900 w-70 h-screen fixed shadow-lg z-20 ${
          sidebaropen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 lg:static transition-all flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-white">
          <img src="/images/leemalogo.jpg" className="h-6 w-18" />
          <span className="font-bold text-white ">Seller Dashboard</span>
        </div>

        <nav className="flex-1 mt-6">
          {sideBarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path!}
              className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-500    hover:rounded-md"
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

      <main className={`w-full p-6 h-screen overflow-y-auto`}>
        <div className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-gray-900 p-4 rounded-xl shadow border mb-3">
          {/* 🔍 Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by Order Number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700"
            />

            {/* Icon */}
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* 🧾 Filter Dropdown */}
          <div className="w-full md:w-40">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">📋 All</option>
              <option value="recent">⚡ Recent</option>
            </select>
          </div>

          {/* 📊 Optional Count */}
          <div className="ml-auto text-sm text-gray-500 hidden md:block">
            Showing results
          </div>
        </div>
        {/* HEADER */}
        <div className="px-6 py-4 bg-white dark:bg-gray-900 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Messages 💬</h1>
            <p className="text-sm text-gray-500">Customer notifications</p>
          </div>

          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {filteredMessages.length} Messages
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex h-[calc(100%-70px)]">
          {/* LEFT LIST */}
          <div className="w-1/3 border-r overflow-y-auto bg-white dark:bg-gray-900">
            {filteredMessages.length === 0 ? (
              <div className="p-4 text-gray-500">No messages</div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-100 dark:hover:bg-gray-800
                    ${selectedMessage?.id === msg.id ? "bg-blue-50 dark:bg-gray-800" : ""}`}
                >
                  <div className="flex justify-between">
                    <p className="font-semibold">
                      {msg.customerName || "Unknown User"}
                    </p>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        msg.read
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {msg.read ? "Read" : "New"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 truncate">
                    {msg.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    Order: {msg.orderNumber || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* RIGHT VIEW */}
          <div className="flex-1 p-6 overflow-y-auto">
            {!selectedMessage ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="text-5xl">💬</div>
                <p className="mt-2 font-semibold">Select a message</p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
                  <h2 className="text-lg font-bold">
                    {selectedMessage.customerName || "Unknown"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedMessage.customerEmail || "No email"}
                  </p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                  <p>{selectedMessage.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SellerMessage;
