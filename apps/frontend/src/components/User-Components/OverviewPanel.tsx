import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Heart, Wrench, ShoppingBag } from "lucide-react";
import { userApi, type UserOrder, type WishlistItem, type ServiceRequest } from "../../utils/userApi";
import { formatLkr } from "../../utils/currency";

type Props = {
  onNavigate: (panel: "overview" | "profile" | "orders" | "wishlist" | "services" | "notifications") => void;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-orange-600 bg-orange-50",
  confirmed: "text-blue-600 bg-blue-50",
  processing: "text-indigo-600 bg-indigo-50",
  shipped: "text-purple-600 bg-purple-50",
  delivered: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
};

export default function OverviewPanel({ onNavigate }: Props) {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { label: "Total Orders", value: 0, icon: Package, color: "text-amber-600" },
    { label: "Pending Orders", value: 0, icon: ShoppingBag, color: "text-orange-600" },
    { label: "Wishlist Items", value: 0, icon: Heart, color: "text-red-500" },
    { label: "Service Requests", value: 0, icon: Wrench, color: "text-emerald-600" },
  ]);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [s, o, w, svc] = await Promise.all([
          userApi.getDashboardStats(),
          userApi.getRecentOrders(),
          userApi.getWishlist(),
          userApi.getServiceRequests(),
        ]);
        setStats([
          { label: "Total Orders", value: s.totalOrders, icon: Package, color: "text-amber-600" },
          { label: "Pending Orders", value: s.pendingOrders, icon: ShoppingBag, color: "text-orange-600" },
          { label: "Wishlist Items", value: s.wishlistCount || w.length, icon: Heart, color: "text-red-500" },
          { label: "Service Requests", value: s.serviceCount || svc.length, icon: Wrench, color: "text-emerald-600" },
        ]);
        setOrders(o);
        setWishlist(w);
        setServices(svc);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-5 border border-stone-100">
            <div className="flex items-center justify-between">
              <p className="text-stone-500 text-sm">{s.label}</p>
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-stone-800 mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-stone-800">Recent Orders</h2>
          <button
            onClick={() => onNavigate("orders")}
            className="text-amber-600 text-sm font-semibold hover:underline"
          >
            View all
          </button>
        </div>
        {orders.length === 0 ? (
          <p className="text-stone-400 text-sm py-4 text-center">No orders yet. Start shopping!</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-stone-800">{o.orderNumber}</p>
                  <p className="text-xs text-stone-400">{o.productName}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    STATUS_COLORS[o.status] ?? "text-stone-600 bg-stone-100"
                  }`}
                >
                  {o.status}
                </span>
                <span className="font-bold text-stone-800">{formatLkr(o.totalAmount)}</span>
                <button
                  onClick={() => navigate(`/order/tracking/${o.id}`)}
                  className="text-xs text-amber-600 font-semibold hover:underline"
                >
                  Track
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-stone-800">Wishlist Preview</h2>
            <button
              onClick={() => onNavigate("wishlist")}
              className="text-amber-600 text-sm font-semibold hover:underline"
            >
              See all
            </button>
          </div>
          {wishlist.length === 0 ? (
            <p className="text-stone-400 text-sm">No saved items</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {wishlist.slice(0, 6).map((item) => (
                <span
                  key={item.id}
                  className="px-3 py-1.5 bg-stone-100 rounded-full text-sm text-stone-700"
                >
                  {item.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-stone-800">Service Requests</h2>
            <button
              onClick={() => onNavigate("services")}
              className="text-amber-600 text-sm font-semibold hover:underline"
            >
              Manage
            </button>
          </div>
          {services.length === 0 ? (
            <p className="text-stone-400 text-sm">No service requests</p>
          ) : (
            services.slice(0, 4).map((s) => (
              <div key={s.id} className="flex justify-between py-2 border-b border-stone-100 last:border-0">
                <span className="text-sm text-stone-700">
                  #{s.referenceNumber ?? s.invoiceRef ?? s.id}
                </span>
                <span className="text-xs font-semibold text-amber-600 uppercase">{s.status}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/user/category")}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-amber-500/30"
        >
          Browse Products
        </button>
        <button
          onClick={() => navigate("/cart")}
          className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-lg"
        >
          View Cart
        </button>
        <button
          onClick={() => onNavigate("orders")}
          className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-5 py-2.5 rounded-lg font-semibold"
        >
          My Orders
        </button>
      </div>
    </div>
  );
}
