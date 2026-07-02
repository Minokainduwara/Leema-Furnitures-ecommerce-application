import React, { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Package, Users, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, StatCard, PageHeader } from "../../components/ui/admin-ui/index";
import { ProgressBar } from "../../components/charts/index";
import { authFetch, API_BASE, productImageUrl } from "../../utils/api";

type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  ordersThisMonth: number;
  activeProducts: number;
  totalProducts: number;
  totalCustomers: number;
  totalUsers: number;
  ordersByStatus: Record<string, number>;
  bestSellers: Array<{
    id: number;
    name: string;
    image: string | null;
    price: number;
    totalSales: number;
  }>;
  recentOrders: Array<{
    id: number;
    orderNumber: string;
    customerName: string | null;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    createdAt: string;
  }>;
};

const STATUS_VARIANT: Record<string, "success" | "info" | "warning" | "danger" | "default"> = {
  DELIVERED:  "success",
  COMPLETED:  "success",
  SHIPPED:    "info",
  PROCESSING: "warning",
  CONFIRMED:  "info",
  PENDING:    "warning",
  CANCELLED:  "danger",
  FAILED:     "danger",
  REFUNDED:   "default",
  RETURNED:   "default",
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_BASE}/api/admin/dashboard/stats`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setStats(await res.json());
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="text-stone-500 text-sm">Loading dashboard…</div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
        {error || "No data"}
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `LKR ${Number(stats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      colorClass: "text-amber-500", bgClass: "bg-amber-50", ringClass: "ring-amber-100",
    },
    {
      label: "Orders This Month",
      value: String(stats.ordersThisMonth),
      icon: ShoppingCart,
      colorClass: "text-blue-500", bgClass: "bg-blue-50", ringClass: "ring-blue-100",
    },
    {
      label: "Active Products",
      value: String(stats.activeProducts),
      icon: Package,
      colorClass: "text-emerald-500", bgClass: "bg-emerald-50", ringClass: "ring-emerald-100",
    },
    {
      label: "Total Customers",
      value: String(stats.totalCustomers),
      icon: Users,
      colorClass: "text-purple-500", bgClass: "bg-purple-50", ringClass: "ring-purple-100",
    },
  ];

  // Build a simple distribution for the right-column progress bars.
  const totalForPct = Object.values(stats.ordersByStatus).reduce((s, n) => s + n, 0) || 1;
  const statusEntries = Object.entries(stats.ordersByStatus).filter(([_, v]) => v > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        subtitle={`Welcome back, Admin · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-800">Recent Orders</h3>
            <Link to="/admin/orders" className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-600 transition-colors font-medium">
              View All <ChevronRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  {(["Order", "Customer", "Amount", "Status"] as const).map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-stone-400 pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length === 0 ? (
                  <tr><td colSpan={4} className="py-6 text-center text-stone-400">No orders yet.</td></tr>
                ) : stats.recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="py-2.5 pr-4 font-mono text-xs text-stone-500">{o.orderNumber || `#${o.id}`}</td>
                    <td className="py-2.5 pr-4 text-stone-700 font-medium">{o.customerName || "—"}</td>
                    <td className="py-2.5 pr-4 font-semibold text-stone-800">LKR {Number(o.totalAmount || 0).toLocaleString()}</td>
                    <td className="py-2.5">
                      <Badge variant={STATUS_VARIANT[o.status] || "default"}>{o.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <h3 className="font-semibold text-stone-800 mb-1">Orders by Status</h3>
          <p className="text-xs text-stone-400 mb-4">Across all orders</p>
          {statusEntries.length === 0 ? (
            <p className="text-sm text-stone-400">No data</p>
          ) : statusEntries.map(([status, count]) => (
            <ProgressBar
              key={status}
              label={`${status} (${count})`}
              pct={Math.round((count / totalForPct) * 100)}
              colorClass="bg-amber-500"
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <h3 className="font-semibold text-stone-800 mb-4">Best Sellers</h3>
        {stats.bestSellers.length === 0 ? (
          <p className="text-sm text-stone-400">No sales recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {stats.bestSellers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-300 w-6">#{i + 1}</span>
                <img
                  src={productImageUrl(p.image)}
                  alt={p.name}
                  className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.jpg"; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-700 truncate">{p.name}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-stone-400">{p.totalSales || 0} sales</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-stone-800">LKR {Number(p.price || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
