import { useEffect, useMemo, useState } from "react";
import { authFetch, API_BASE } from "../../utils/api";
import { Search, RefreshCw } from "lucide-react";

type Order = {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  customerName?: string;
  phone?: string;
  address?: string;
  orderDate?: string;
};

const ORDER_STATUSES = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED",
  "DELIVERED", "CANCELLED", "REFUNDED", "RETURNED",
] as const;

const PAYMENT_STATUSES = [
  "PENDING", "COMPLETED", "FAILED", "REFUNDED", "CANCELLED",
] as const;

const STATUS_COLOR: Record<string, string> = {
  PENDING:    "bg-amber-100 text-amber-700",
  CONFIRMED:  "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED:    "bg-cyan-100 text-cyan-700",
  DELIVERED:  "bg-emerald-100 text-emerald-700",
  CANCELLED:  "bg-stone-200 text-stone-700",
  REFUNDED:   "bg-purple-100 text-purple-700",
  RETURNED:   "bg-rose-100 text-rose-700",
  COMPLETED:  "bg-emerald-100 text-emerald-700",
  FAILED:     "bg-red-100 text-red-700",
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/api/orders/all`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "All" && o.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (o.orderNumber || "").toLowerCase().includes(q) ||
        (o.customerName || "").toLowerCase().includes(q)
      );
    });
  }, [orders, search, statusFilter]);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await authFetch(`${API_BASE}/api/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(await res.text());
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      );
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const updatePaymentStatus = async (id: number, newStatus: string) => {
    try {
      const res = await authFetch(`${API_BASE}/api/orders/${id}/payment-status`, {
        method: "PATCH",
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      if (!res.ok) throw new Error(await res.text());
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, paymentStatus: newStatus } : o)),
      );
    } catch (err: any) {
      alert(`Failed to update payment status: ${err.message}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Orders</h1>
          <p className="text-sm text-stone-500">Manage customer orders and payment status</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-64 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or customer name"
            className="w-full pl-9 pr-3 py-2 text-sm text-stone-900 placeholder-stone-400 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm text-stone-900 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="All">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-sm text-stone-500 ml-auto">
          {filtered.length} of {orders.length} orders
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Order #</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Payment</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-stone-400">Loading…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-stone-400">No orders found.</td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-t border-stone-100 hover:bg-stone-50">
                    <td className="px-4 py-3 font-mono text-xs text-stone-700">
                      {o.orderNumber || `#${o.id}`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-800">{o.customerName || "—"}</div>
                      <div className="text-xs text-stone-400">{o.phone || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-stone-900">
                      LKR {Number(o.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLOR[o.status] || "bg-stone-100 text-stone-600"}`}>
                          {o.status}
                        </span>
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          className="text-xs text-stone-900 border border-stone-200 rounded px-2 py-1 bg-white"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLOR[o.paymentStatus] || "bg-stone-100 text-stone-600"}`}>
                          {o.paymentStatus}
                        </span>
                        <select
                          value={o.paymentStatus}
                          onChange={(e) => updatePaymentStatus(o.id, e.target.value)}
                          className="text-xs text-stone-900 border border-stone-200 rounded px-2 py-1 bg-white"
                        >
                          {PAYMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;