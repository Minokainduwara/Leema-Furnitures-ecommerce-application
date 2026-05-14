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
  // | "categories"
  // | "messages"
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
type Repair = {
  id: number;
  issueDescription: string;
  estimatedCost?: number;
  status: string;
  product?: { name?: string };
  order?: { id?: number };
};
type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  userId: number;
};
export default function UserDashboard() {
  const [panel, setPanel] = useState<Panel>("overview");
  const navigate = useNavigate();
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
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/user/category")}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Browse Products
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-lg">
            View Orders
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-lg">Support</button>
        </div>
      </div>
    );
  }
  function Profile() {
    const [form, setForm] = React.useState({
      name: "",
      email: "",
      phone: "",
    });

    const [passwordData, setPasswordData] = React.useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    React.useEffect(() => {
      loadProfile();
    }, []);

    const loadProfile = async () => {
      try {
        const res = await authFetch("http://localhost:8080/api/users/me");
        const data = await res.json();

        console.log("PROFILE DATA:", data);

        // ✅ FIX: backend may return different field names
        setForm({
          name: data.name || data.fullName || "",
          email: data.email || "",
          phone: data.phone || data.phoneNumber || "",
        });
      } catch (err) {
        console.error("Profile load error", err);
      }
    };

    const handleChange = (e: any) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };

    const handleUpdate = async () => {
      try {
        const res = await authFetch("http://localhost:8080/api/users/me", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // ✅ FIX (THIS WAS MISSING)
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
          }),
        });

        if (!res.ok) {
          throw new Error("Profile update failed");
        }

        alert("Profile updated!");
      } catch (err) {
        console.error(err);
        alert("Profile update failed");
      }
    };

    const handlePasswordChange = (e: any) => {
      setPasswordData({
        ...passwordData,
        [e.target.name]: e.target.value,
      });
    };

    const handlePasswordUpdate = async () => {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        const res = await authFetch(
          "http://localhost:8080/api/users/change-password", // ✅ FIXED ENDPOINT
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              currentPassword: passwordData.currentPassword,
              newPassword: passwordData.newPassword,
            }),
          },
        );

        if (!res.ok) {
          throw new Error("Password update failed");
        }

        alert("Password updated!");

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        console.error(err);
        alert("Password update failed");
      }
    };

    return (
      <div className="space-y-6">
        {/* PROFILE INFO */}
        <div>
          <h2 className="font-semibold mb-3">Profile Info</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* PHONE */}
            <div className="col-span-2">
              <label className="block text-sm text-gray-500 mb-1">
                Phone Number
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="mt-4 bg-yellow-500 px-6 py-2 rounded-lg"
          >
            Update Profile
          </button>
        </div>

        {/* PASSWORD SECTION */}
        <div>
          <h2 className="font-semibold mb-3">Change Password</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="p-3 border rounded-lg w-full"
              />
            </div>

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="p-3 border rounded-lg"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="p-3 border rounded-lg"
            />
          </div>

          <button
            onClick={handlePasswordUpdate}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg"
          >
            Update Password
          </button>
        </div>
      </div>
    );
  }
  function Services() {
    const [repairs, setRepairs] = React.useState<Repair[]>([]);

    React.useEffect(() => {
      loadRepairs();
    }, []);

    const loadRepairs = async () => {
      try {
        // 1. get current user
        const userRes = await authFetch("http://localhost:8080/api/users/me");
        const user = await userRes.json();

        // 2. fetch repairs for user
        const res = await authFetch(
          `http://localhost:8080/api/repairs/user/${user.id}`,
        );

        const data = await res.json();
        setRepairs(data || []);
      } catch (err) {
        console.error("Repair load error:", err);
      }
    };

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">My Repair Requests</h2>

        {repairs.length === 0 && (
          <p className="text-gray-500">No repair requests found</p>
        )}

        {repairs.map((r) => (
          <div
            key={r.id}
            className="bg-white border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{r.issueDescription}</p>
              <p className="text-sm text-gray-500">
                Estimated: LKR {r.estimatedCost || 0}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                r.status === "REQUESTED"
                  ? "bg-yellow-100 text-yellow-600"
                  : r.status === "APPROVED"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200"
              }`}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    );
  }
  function NotificationsPanel() {
    const [notifications, setNotifications] = React.useState<Notification[]>(
      [],
    );
    const [unreadCount, setUnreadCount] = React.useState(0);

    React.useEffect(() => {
      loadNotifications();
    }, []);

    const loadNotifications = async () => {
      try {
        // get current user
        const userRes = await authFetch("http://localhost:8080/api/users/me");
        const user = await userRes.json();

        // notifications
        const res = await authFetch("http://localhost:8080/api/notifications");
        const data = await res.json();

        // filter only logged user notifications
        const userNotifications = data.filter(
          (n: Notification) => n.userId === user.id,
        );

        setNotifications(userNotifications);

        // unread count
        const countRes = await authFetch(
          `http://localhost:8080/api/notifications/unread-count?userId=${user.id}`,
        );
        const count = await countRes.json();

        setUnreadCount(count);
      } catch (err) {
        console.error("Notification load error:", err);
      }
    };

    const markAsRead = async (id: number) => {
      try {
        await authFetch(`http://localhost:8080/api/notifications/${id}/read`, {
          method: "PATCH",
        });

        loadNotifications();
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div className="space-y-4">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notifications</h2>

          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            Unread: {unreadCount}
          </span>
        </div>

        {/* LIST */}
        {notifications.length === 0 && (
          <p className="text-gray-500">No notifications</p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 border rounded-lg flex justify-between items-center ${
              n.read ? "bg-gray-100" : "bg-white"
            }`}
          >
            <div>
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm text-gray-500">{n.message}</p>
            </div>

            {!n.read && (
              <button
                onClick={() => markAsRead(n.id)}
                className="text-sm bg-green-500 text-white px-3 py-1 rounded"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }
  function Orders() {
  type OrderHistory = {
    id: number;
    status: string;
    message: string;
    changedBy: string;
    createdAt: string;
  };

  // ✅ FIX HERE
  const [history, setHistory] = React.useState<OrderHistory[]>([]);

  React.useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const userRes = await authFetch("http://localhost:8080/api/users/me");
      const user = await userRes.json();

      const res = await authFetch(
        `http://localhost:8080/api/orders/user/${user.id}/history`
      );

      if (!res.ok) {
        setHistory([]);
        return;
      }

      const data: unknown = await res.json();

      if (Array.isArray(data)) {
        setHistory(data as OrderHistory[]);
      } else {
        setHistory([]);
      }

    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  };

  return (
    <div>
      {history.map((h) => (
        <div key={h.id}>{h.status}</div>
      ))}
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
              active={panel === "products"}
              onClick={() => setPanel("products")}
            />
            {/* <Item
              icon={<Tags size={18} />}
              label="Categories"
              active={panel === "categories"}
              onClick={() => setPanel("categories")}
            /> */}
          </Section>

          {/* SUPPORT */}
          <Section title="SUPPORT">
            {/* <Item
              icon={<MessageCircle size={18} />}
              label="Messages"
              active={panel === "messages"}
              onClick={() => setPanel("messages")}
            /> */}
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
          {panel === "profile" && <Profile />}
          {panel === "orders" && <Orders />}
          {panel === "wishlist" && <p>Saved products</p>}
          {panel === "services" && <Services />}

          {panel === "products" && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Browse Products</h2>
              <button
                onClick={() => navigate("/user/category")}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Go to Category Page
              </button>
            </div>
          )}

          {/* {panel === "categories" && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Categories</h2>
              <p>Filter products by category (Sofas, Chairs, etc.)</p>
            </div>
          )} */}

          {/* {panel === "messages" && <p>Chat with support/seller</p>} */}
          {panel === "notifications" && <NotificationsPanel />}
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
