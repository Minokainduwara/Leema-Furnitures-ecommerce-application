import React, { useEffect, useState } from "react";
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

type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
};
type Repair = {
  id: number;
  referenceNumber?: string;
  status: string;
  issueDescription?: string;
  type?: string;
  estimatedCost?: number;
  actualCost?: number;
  createdAt?: string;

  product?: {
    name: string;
  };

  handledBy?: {
    name: string;
  };
};
type OrderItem = {
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
};
type Order = {
  id: number;
  orderNumber?: string;
  status: string;
  totalAmount?: number;
  price?: number;
  discount?: number;
  shippingCost?: number;
  paymentStatus?: string;

  items?: OrderItem[];
};

type WishlistItem = {
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  productCode: string;
};
type WishlistResponse = {
  id: number;
  userEmail: string;
  items: WishlistItem[];
};

export default function UserDashboard() {
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [wishlist, setWishlist] = React.useState<WishlistResponse | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceType, setServiceType] = useState("REPAIR");
  const [description, setDescription] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [services, setServices] = React.useState<Repair[]>([]);
  const [panel, setPanel] = useState<Panel>("overview");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = React.useState([
    { label: "Total Orders", value: 0 },
    { label: "Pending Orders", value: 0 },
    { label: "Wishlist Items", value: 0 },
    { label: "Services", value: 0 },
  ]);
  const [sku, setSku] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
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
        { label: "Wishlist Items", value: wishlist?.items?.length || 0 },
        { label: "Services", value: services?.length || 0 }
      ]);

      // 🔹 Recent Orders
      const orderRes = await authFetch(
        "http://localhost:8080/api/orders/recent",
      );
      const orderData = await orderRes.json();
      setOrders(orderData || []);
      // useEffect(() => {
      //   console.log("ORDERS:", orders);
      // }, [orders]);
      // 🔹 Wishlist
      const wishRes = await authFetch("http://localhost:8080/api/wishlist");
      const wishData: WishlistResponse = await wishRes.json();
      setWishlist(wishData);
      const allOrdersRes = await authFetch(
        "http://localhost:8080/api/orders/my-orders",
      );
      const allOrders = await allOrdersRes.json();
      setOrders(allOrders);

      const loadHistory = async (orderId: number) => {
        try {
          const res = await authFetch(
            `http://localhost:8080/api/orders/my-orders/${orderId}/history`,
          );
          const data = await res.json();

          setOrderHistory(data);
          setSelectedOrderId(orderId);
        } catch (err) {
          console.error(err);
        }
      };
      // 🔹 Services
      const serviceRes = await authFetch("http://localhost:8080/api/repairs");
      const serviceData: Repair[] = await serviceRes.json();
      setServices(serviceData);
      const notifRes = await authFetch(
        "http://localhost:8080/api/notifications/my",
      );
      const notifData = await notifRes.json();
      setNotifications(notifData);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };
  const removeFromWishlist = async (productId: number) => {
    try {
      await authFetch(
        `http://localhost:8080/api/wishlist/remove/${productId}`,
        {
          method: "DELETE",
        },
      );

      // refresh wishlist after delete
      loadData();
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };
  function Overview() {
    React.useEffect(() => {
      loadData();
    }, []);

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
            {wishlist?.items?.length === 0 && <p>No wishlist items</p>}

            {wishlist?.items?.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm"
              >
                <img
                  src={`http://localhost:8080${item.imageUrl}`}
                  alt={item.productName}
                  className="w-10 h-10 object-cover rounded"
                />

                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-gray-500 text-xs">Rs. {item.price}</p>
                </div>

                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="text-red-500 font-bold ml-2"
                >
                  ✕
                </button>
              </div>
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
          {panel === "orders" && (
            <div className="space-y-6">
              {orders.length === 0 && <p>No orders found</p>}

              {orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white p-5 rounded-xl shadow space-y-4"
                >
                  {/* ================= HEADER ================= */}
                  <div className="flex justify-between border-b pb-3">
                    <div>
                      <p className="font-bold text-lg">
                        Order #{o.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {o.status}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {o.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* ================= PRODUCTS ================= */}
                  <div className="space-y-3">
                    {o.items?.map((item: any, index: number) => (
                      console.log("ITEM:", item),
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                      >
                        {/* IMAGE */}
                        <img
                          src={`http://localhost:8080${item.imageUrl}`}
                          className="w-14 h-14 object-cover rounded"
                        />

                        {/* DETAILS */}
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-gray-400">
                            Code: {item.productCode}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        {/* PRICE */}
                        <p className="font-semibold">
                          {" "}
                          LKR {Number(item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* ================= SUMMARY ================= */}
                  <div className="border-t pt-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>
                        LKR{" "}
                        {(o.totalAmount ?? 0) +
                          (o.discount ?? 0) -
                          (o.shippingCost ?? 0)}
                      </span>
                    </div>

                    <div className="flex justify-between text-red-500">
                      <span>Discount</span>
                      <span>- LKR {o.discount}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>LKR {o.shippingCost}</span>
                    </div>

                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                      <span>Total</span>
                      <span>LKR {o.totalAmount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {panel === "wishlist" && (
            <div className="space-y-2">
              {wishlist?.items?.length === 0 && <p>No wishlist items</p>}

              {wishlist?.items?.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between bg-white p-3 rounded shadow items-center"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`http://localhost:8080${item.imageUrl}`}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p>{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        Price:Rs {item.price}
                      </p>
                      <p className="text-sm text-gray-500">
                        Description:{item.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Category:{item.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        Product Code:{item.productCode}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-md transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          {panel === "services" && (
            <>
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">My Service Requests</h2>

                  <button
                    className="bg-yellow-500 px-4 py-2 rounded-lg font-semibold"
                    onClick={() => setShowServiceForm(true)}
                  >
                    + New Request
                  </button>
                </div>

                {/* List */}
                <div className="space-y-3">
                  {services.length === 0 && <p>No service requests</p>}

                  {services.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white p-4 rounded shadow space-y-1"
                    >
                      <h2 className="font-bold text-lg">
                        {r.product?.name || "No Product"}
                      </h2>

                      <p>
                        <b>Request #:</b> {r.referenceNumber || r.id}
                      </p>

                      <p>
                        <b>Issue:</b> {r.issueDescription || "N/A"}
                      </p>

                      <p>
                        <b>Service Type:</b> {r.type || "N/A"}
                      </p>

                      <p>
                        <b>Status:</b>
                        <span className="ml-2 text-blue-600">{r.status}</span>
                      </p>

                      <p>
                        <b>Estimated Cost:</b>
                        {r.estimatedCost ? `Rs. ${r.estimatedCost}` : "Pending"}
                      </p>

                      <p>
                        <b>Actual Cost:</b>
                        {r.actualCost ? `Rs. ${r.actualCost}` : "Not completed"}
                      </p>

                      <p>
                        <b>Requested Date:</b>
                        {r.createdAt || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SERVICE FORM */}
              {showServiceForm && (
                <div className="bg-white p-5 rounded shadow space-y-3 mt-4">
                  <h2 className="font-semibold">Create Service Request</h2>

                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="border p-2 w-full border-gray-300 rounded"
                  >
                    <option value="REPAIR">Repair</option>
                    <option value="REFUND">Refund</option>
                    <option value="REINSTALLMENT">Reinstallment</option>
                  </select>

                  <input
                    placeholder="Order Number (e.g. ORD-1001)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="border p-2 w-full border-gray-300 rounded"
                  />

                  <input
                    placeholder="Product SKU (e.g. AD5521)"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="border p-2 w-full border-gray-300 rounded"
                  />
                  <textarea
                    placeholder="Describe your issue"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 w-full border-gray-300 rounded"
                  />

                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 px-4 py-2 rounded"
                      onClick={async () => {
                        try {
                          await authFetch("http://localhost:8080/api/repairs", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              orderNumber: orderNumber,
                              sku: sku,
                              issueDescription: description,
                              type: serviceType,
                            }),
                          });

                          // ✅ success message
                          setSuccessMsg(
                            "Repair request submitted successfully!",
                          );

                          // reset form
                          setShowServiceForm(false);
                          setOrderNumber("");
                          setSku("");
                          setDescription("");

                          loadData();

                          // auto hide message after 3 sec
                          setTimeout(() => setSuccessMsg(""), 3000);
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    >
                      Submit
                    </button>

                    <button
                      className="bg-gray-300 px-4 py-2 rounded"
                      onClick={() => setShowServiceForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
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

          {panel === "notifications" && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Notifications</h2>

              {notifications.length === 0 && <p>No notifications</p>}

              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded border ${
                    n.read ? "bg-gray-100" : "bg-white font-semibold"
                  }`}
                >
                  <p className="text-sm text-gray-500">{n.type}</p>
                  <p className="font-bold">{n.title}</p>
                  <p>{n.message}</p>
                </div>
              ))}
            </div>
          )}
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
