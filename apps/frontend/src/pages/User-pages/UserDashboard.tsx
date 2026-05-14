import React, { useState } from "react";
import { authFetch } from "../../utils/api";

import {
  LayoutDashboard,
  User,
  ShoppingCart,
  Heart,
  Wrench,
  PackageSearch,
  Tags,
  Bell,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router";

type Panel =
  | "overview"
  | "profile"
  | "orders"
  | "wishlist"
  | "services"
  | "products"
  | "categories"
  | "messages"
  | "notifications";

type ServiceRequest = {
  id: number;
  referenceNumber?: string;
  status: string;
};

type Order = {
  id: number;
  orderNumber?: string;
  status: string;
  totalAmount?: number;
  price?: number;
};

type WishlistItem = {
  id: number;
  productName?: string;
};

export default function UserDashboard() {
  const [panel, setPanel] = useState<Panel>("overview");
  const navigate=useNavigate();
  function Overview() {
    const [stats, setStats] = React.useState([
      { label: "Total Orders", value: 0 },
      { label: "Pending Orders", value: 0 },
      { label: "Wishlist Items", value: 0 },
      { label: "Services", value: 0 },
    ]);

    const [orders, setOrders] = React.useState<Order[]>([]);
    const [wishlist, setWishlist] = React.useState<WishlistItem[]>([]);
    const [services, setServices] = React.useState<ServiceRequest[]>([]);

    React.useEffect(() => {
      loadData();
    }, []);

    const authFetch = async (url) => {
      const token = localStorage.getItem("token");

      return fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };

    const loadData = async () => {
      try {
        // 🔹 Dashboard stats
        const statsRes = await authFetch(
          "http://localhost:8080/api/dashboard/overview",
        );
        const statsData = await statsRes.json();

        setStats([
          { label: "Total Orders", value: statsData.totalOrders || 0 },
          { label: "Pending Orders", value: statsData.pendingOrders || 0 },
          { label: "Wishlist Items", value: statsData.wishlistCount || 0 },
          { label: "Services", value: statsData.serviceCount || 0 },
        ]);

        // 🔹 Recent Orders
        const orderRes = await authFetch(
          "http://localhost:8080/api/orders/recent",
        );
        const orderData = await orderRes.json();
        setOrders(orderData || []);

        // 🔹 Wishlist
        const wishRes = await authFetch("http://localhost:8080/api/wishlist");
        const wishData = await wishRes.json();
        setWishlist(wishData || []);

        // 🔹 Services
        const serviceRes = await authFetch(
          "http://localhost:8080/api/service-requests",
        );
        const serviceData: ServiceRequest[] = await serviceRes.json();
        setServices(serviceData);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    return (
      <div className="space-y-6">
        {/* ================= STATS ================= */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 border">
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ================= RECENT ORDERS ================= */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="font-semibold mb-4">Recent Orders</h2>

          <div className="space-y-3">
            {orders.length === 0 && <p>No recent orders</p>}

            {orders.map((o) => (
              <div key={o.id} className="flex justify-between border-b pb-2">
                <span>Order #{o.orderNumber || o.id}</span>
                <span className="text-gray-500">{o.status}</span>
                <span className="font-bold">
                  LKR {o.totalAmount || o.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= WISHLIST ================= */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="font-semibold mb-3">Wishlist Preview</h2>

          <div className="flex gap-3 flex-wrap">
            {wishlist.length === 0 && <p>No wishlist items</p>}

            {wishlist.map((item) => (
              <span
                key={item.id}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {item.productName || "Item"}
              </span>
            ))}
          </div>
        </div>

        {/* ================= SERVICES ================= */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="font-semibold mb-4">Service Requests</h2>

          {services.length === 0 && <p>No service requests</p>}

          {services.map((s) => (
            <div key={s.id} className="flex justify-between py-2 border-b">
              <span>Request #{s.referenceNumber || s.id}</span>
              <span className="text-yellow-600">{s.status}</span>
            </div>
          ))}
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/user/category")}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-amber-500/30"
          >
            🛍️ Browse Products
          </button>
          <button
            onClick={() => navigate("/addtocart")}
            className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            View Cart
          </button>
          <button
            onClick={() => setPanel("orders")}
            className="bg-stone-200 hover:bg-stone-300 px-5 py-2.5 rounded-lg"
          >
            My Orders
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-gray-900 text-white flex flex-col">
        {/* BRAND */}
        <div className="p-6 text-xl font-bold border-b border-gray-800">
          MyStore
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* ACCOUNT SECTION */}
          <Section title="ACCOUNT">
            <Item
              icon={<LayoutDashboard size={18} />}
              label="Overview"
              active={panel === "overview"}
              onClick={() => setPanel("overview")}
            />
            <Item
              icon={<User size={18} />}
              label="Profile"
              active={panel === "profile"}
              onClick={() => setPanel("profile")}
            />
            <Item
              icon={<ShoppingCart size={18} />}
              label="Orders"
              active={panel === "orders"}
              onClick={() => setPanel("orders")}
            />
            <Item
              icon={<Heart size={18} />}
              label="Wishlist"
              active={panel === "wishlist"}
              onClick={() => setPanel("wishlist")}
            />
            <Item
              icon={<Wrench size={18} />}
              label="Services"
              active={panel === "services"}
              onClick={() => setPanel("services")}
            />
          </Section>

          {/* SHOP SECTION */}
          <Section title="SHOP">
            <Item
              icon={<PackageSearch size={18} />}
              label="Browse Products"
              active={false}
              onClick={() => navigate("/user/category")}
            />
            <Item
              icon={<Tags size={18} />}
              label="Cart"
              active={false}
              onClick={() => navigate("/addtocart")}
            />
          </Section>

          {/* SUPPORT */}
          <Section title="SUPPORT">
            <Item
              icon={<MessageCircle size={18} />}
              label="Messages"
              active={panel === "messages"}
              onClick={() => setPanel("messages")}
            />
            <Item
              icon={<Bell size={18} />}
              label="Notifications"
              active={panel === "notifications"}
              onClick={() => setPanel("notifications")}
            />
          </Section>
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-red-500 transition">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold capitalize text-gray-800">
            {panel}
          </h1>
          <p className="text-gray-500">
            Manage your account and shopping experience
          </p>
        </div>

        {/* CONTENT AREA */}
        <div className="bg-gray-50 rounded-xl shadow p-6 border text-gray-700">
          {panel === "overview" && <Overview />}
          {panel === "profile" && <p>User profile settings</p>}
          {panel === "orders" && <p>Order history list</p>}
          {panel === "wishlist" && <p>Saved products</p>}
          {panel === "services" && <p>Service requests</p>}

          {panel === "products" && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Browse Products</h2>
              <p>Product grid + search + filters will be here</p>
            </div>
          )}

          {panel === "categories" && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Categories</h2>
              <p>Filter products by category (Sofas, Chairs, etc.)</p>
            </div>
          )}

          {panel === "messages" && <p>Chat with support/seller</p>}
          {panel === "notifications" && <p>System notifications</p>}
        </div>
      </main>
    </div>
  );
}

/* ================= SIDEBAR COMPONENTS ================= */

function Section({ title, children }: any) {
  return (
    <div>
      <p className="text-xs text-gray-400 px-4 mb-2 tracking-wider">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Item({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition
      ${
        active
          ? "bg-yellow-500 text-black"
          : "hover:bg-yellow-500 hover:text-black"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
