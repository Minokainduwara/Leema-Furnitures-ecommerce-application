import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Search, ExternalLink } from "lucide-react";
import { userApi, type UserOrder } from "../../utils/userApi";
import { formatLkr } from "../../utils/currency";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-orange-600 bg-orange-50 border-orange-200",
  confirmed: "text-blue-600 bg-blue-50 border-blue-200",
  processing: "text-indigo-600 bg-indigo-50 border-indigo-200",
  shipped: "text-purple-600 bg-purple-50 border-purple-200",
  delivered: "text-green-600 bg-green-50 border-green-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
  refunded: "text-stone-600 bg-stone-100 border-stone-200",
};

const formatDate = (d?: string) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
};

export default function UserOrdersPanel() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await userApi.getOrders();
      setOrders(data);
      setLoading(false);
    })();
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (o.productName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 text-sm focus:ring-2 focus:ring-amber-200 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white"
        >
          <option value="all">All statuses</option>
          {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-100">
          <Package size={40} className="mx-auto text-stone-300 mb-3" />
          <p className="text-stone-500 font-medium">No orders found</p>
          <button
            onClick={() => navigate("/user/category")}
            className="mt-4 text-amber-600 font-semibold text-sm hover:underline"
          >
            Start shopping
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm flex flex-wrap gap-4 items-center"
            >
              {order.productImage && (
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="w-20 h-20 object-cover rounded-lg border border-stone-100"
                />
              )}
              <div className="flex-1 min-w-[180px]">
                <p className="font-bold text-stone-800">{order.orderNumber}</p>
                <p className="text-sm text-stone-500 mt-0.5">{order.productName}</p>
                <p className="text-xs text-stone-400 mt-1">{formatDate(order.createdAt)}</p>
                {order.paymentMethod && (
                  <p className="text-xs text-stone-400">Payment: {order.paymentMethod}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-stone-800">{formatLkr(order.totalAmount)}</p>
                <span
                  className={`inline-block mt-1 text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${
                    STATUS_COLORS[order.status] ?? "text-stone-600 bg-stone-100 border-stone-200"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <button
                onClick={() => navigate(`/order/tracking/${order.id}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition"
              >
                <ExternalLink size={14} />
                Track Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
