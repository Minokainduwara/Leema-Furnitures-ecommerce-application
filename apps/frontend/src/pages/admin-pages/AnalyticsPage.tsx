import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge, Btn, PageHeader } from "../../components/ui/admin-ui/index";
import { SparkLine, TrafficBar } from "../../components/charts/index";
import { authFetch, API_BASE } from "../../utils/api";
import { formatLkr, formatNumber } from "../../utils/currency";
import type { KPI, TrafficSource, CategoryShare } from "../../types";

const STATUS_COLORS: string[] = ["bg-amber-500", "bg-stone-700", "bg-amber-300", "bg-stone-400", "bg-stone-200", "bg-emerald-400"];
const CATEGORY_COLORS: string[] = ["bg-amber-400", "bg-stone-700", "bg-amber-200", "bg-stone-300", "bg-stone-100"];

const ANALYTICS_API = `${API_BASE}/api/admin/analytics`;

// ─── KPI Card ─────────────────────────────────────────────────────────────────

const KPICard: React.FC<KPI> = ({ label, value, change, up }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <div className="text-2xl font-bold text-stone-800">{value}</div>
    <div className="text-xs text-stone-500 mt-0.5 mb-2">{label}</div>
    <span className={`text-xs font-semibold flex items-center gap-0.5 ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {change} vs prev period
    </span>
  </div>
);

// ─── Revenue Hero ─────────────────────────────────────────────────────────────

const RevenueHero: React.FC<{
  totalRevenue: number;
  totalRevenueLkr: string;
  revenueGrowth: number;
  orderGrowth: number;
  totalOrders: number;
}> = ({ totalRevenue, totalRevenueLkr, revenueGrowth, orderGrowth, totalOrders }) => (
  <div className="bg-gradient-to-r from-stone-800 to-stone-900 rounded-2xl p-6 text-white shadow-lg">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p className="text-stone-400 text-sm mb-1">Total Revenue (LKR)</p>
        <p className="text-3xl md:text-4xl font-bold">{totalRevenueLkr || formatLkr(totalRevenue, { compact: true })}</p>
        <p className="text-stone-400 text-xs mt-1">{formatLkr(totalRevenue)} · {formatNumber(totalOrders)} orders</p>
      </div>
      <div className="flex gap-4">
        <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[100px]">
          <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs mb-1">
            <TrendingUp size={12} />
            Revenue
          </div>
          <div className={`text-lg font-bold ${revenueGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {revenueGrowth >= 0 ? "+" : ""}{revenueGrowth}%
          </div>
        </div>
        <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[100px]">
          <div className="flex items-center justify-center gap-1 text-amber-400 text-xs mb-1">
            <TrendingUp size={12} />
            Orders
          </div>
          <div className={`text-lg font-bold ${orderGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {orderGrowth >= 0 ? "+" : ""}{orderGrowth}%
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Trend Panel ─────────────────────────────────────────────────────────────

interface TrendData {
  label: string;
  orders: number;
  revenue: number;
}

const TrendPanel: React.FC<{ monthly: TrendData[]; weekly: TrendData[] }> = ({ monthly, weekly }) => {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");
  const data = view === "monthly" ? monthly : weekly;
  const orderTrend = data.map((m) => m.orders);
  const revenueTrend = data.map((m) => m.revenue / 1000);
  const lastOrders = orderTrend[orderTrend.length - 1] || 0;
  const lastRevenue = revenueTrend[revenueTrend.length - 1] || 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-800">Orders vs Revenue</h3>
        <div className="flex gap-1 bg-stone-100 rounded-lg p-0.5">
          {(["monthly", "weekly"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                view === v ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {v === "monthly" ? "Monthly" : "Weekly"}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-stone-500 mb-1.5">
            <span>Orders</span>
            <span className="font-semibold text-stone-700">{lastOrders}</span>
          </div>
          <SparkLine data={orderTrend.length > 0 ? orderTrend : [0]} color="#78716c" height={48} />
        </div>
        <div>
          <div className="flex justify-between text-xs text-stone-500 mb-1.5">
            <span>Revenue (LKR thousands)</span>
            <span className="font-semibold text-stone-700">{formatLkr(lastRevenue * 1000, { compact: true })}</span>
          </div>
          <SparkLine data={revenueTrend.length > 0 ? revenueTrend : [0]} color="#f59e0b" height={48} />
        </div>
      </div>
    </div>
  );
};

// ─── Order Status Panel ───────────────────────────────────────────────────────

const OrderStatusPanel: React.FC<{ sources: TrafficSource[] }> = ({ sources }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <h3 className="font-semibold text-stone-800 mb-1">Order Status Breakdown</h3>
    <p className="text-xs text-stone-400 mb-4">Distribution by order status</p>
    {sources.length === 0 ? (
      <p className="text-sm text-stone-400 text-center py-6">No orders in selected period</p>
    ) : (
      <>
        <TrafficBar segments={sources.map((t, i) => ({ pct: t.pct, color: STATUS_COLORS[i] }))} />
        <div className="space-y-2.5 mt-4">
          {sources.map((t, i) => (
            <div key={t.source} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[i]}`} />
                <span className="text-sm text-stone-600">{t.source}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-stone-800">{t.visits.toLocaleString()}</span>
                <span className="text-xs text-stone-400 ml-1">({t.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

// ─── Payment Status Panel ─────────────────────────────────────────────────────

interface PaymentStatusItem {
  status: string;
  count: number;
  pct: number;
}

const PaymentStatusPanel: React.FC<{ items: PaymentStatusItem[] }> = ({ items }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <h3 className="font-semibold text-stone-800 mb-1">Payment Status</h3>
    <p className="text-xs text-stone-400 mb-4">Payment completion breakdown</p>
    {items.length === 0 ? (
      <p className="text-sm text-stone-400 text-center py-6">No payment data</p>
    ) : (
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.status}>
            <div className="flex justify-between text-xs text-stone-600 mb-1">
              <span>{item.status}</span>
              <span className="font-semibold">{item.count} ({item.pct}%)</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ─── Category Breakdown Panel ─────────────────────────────────────────────────

const CategoryPanel: React.FC<{ categories: CategoryShare[] }> = ({ categories }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <h3 className="font-semibold text-stone-800 mb-1">Category Breakdown</h3>
    <p className="text-xs text-stone-400 mb-4">Revenue share by category (LKR)</p>
    {categories.length === 0 ? (
      <p className="text-sm text-stone-400 text-center py-6">No category sales data</p>
    ) : (
      <div className="space-y-3">
        {categories.map((c) => (
          <div key={c.name}>
            <div className="flex justify-between text-xs text-stone-600 mb-1">
              <span>{c.name}</span>
              <span className="font-semibold">{c.pct}%</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${c.color || CATEGORY_COLORS[0]} rounded-full transition-all duration-700`}
                style={{ width: `${c.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ─── Reports Panel ────────────────────────────────────────────────────────────

interface ReportCard {
  title: string;
  desc: string;
  type: string;
  icon: string;
}

const REPORTS: ReportCard[] = [
  { title: "Sales Report",      desc: "All orders with amounts in LKR, status, and payment details.",     type: "sales",      icon: "📊" },
  { title: "Revenue Report",    desc: "Daily revenue breakdown with totals and averages in LKR.",         type: "revenue",    icon: "💰" },
  { title: "Customer Report",   desc: "Customer spend, order counts, and lifetime value in LKR.",         type: "customers",  icon: "👥" },
  { title: "Category Report",   desc: "Sales and revenue share by product category in LKR.",              type: "categories", icon: "🏷️" },
  { title: "Inventory Report",  desc: "Stock levels, prices in LKR, and top-selling SKUs.",               type: "inventory",  icon: "📦" },
];

const PERIOD_LABEL: Record<string, string> = {
  "30days": "Last 30 Days",
  "90days": "Last 90 Days",
  "12months": "This Year",
  all: "All Time",
};

const ReportsPanel: React.FC<{
  period: string;
  onDownload: (type: string) => void;
  downloading: string | null;
}> = ({ period, onDownload, downloading }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <h3 className="font-semibold text-stone-800 mb-1">Generate Reports</h3>
    <p className="text-xs text-stone-400 mb-4">Download CSV reports with LKR amounts for the selected period</p>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {REPORTS.map((r) => (
        <div key={r.type} className="border border-stone-100 rounded-xl p-4 hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{r.icon}</span>
            <div className="font-semibold text-stone-800">{r.title}</div>
          </div>
          <div className="text-xs text-stone-400 mb-3">{r.desc}</div>
          <div className="flex items-center justify-between">
            <Badge variant="default">{PERIOD_LABEL[period] || period}</Badge>
            <Btn
              variant="ghost"
              size="sm"
              className="group-hover:text-amber-600"
              onClick={() => onDownload(r.type)}
              disabled={downloading === r.type}
            >
              {downloading === r.type ? (
                <span className="inline-block w-3 h-3 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin" />
              ) : (
                <Download size={13} />
              )}
              CSV
            </Btn>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Best Sellers Panel ───────────────────────────────────────────────────────

interface BestSeller {
  id: number;
  name: string;
  price: number;
  totalSales: number;
  stock: number;
  revenue?: number;
}

const BestSellersPanel: React.FC<{ products: BestSeller[] }> = ({ products }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <h3 className="font-semibold text-stone-800 mb-4">Best Sellers</h3>
    <div className="space-y-3">
      {products.map((p, i) => (
        <div key={p.id} className="flex items-center justify-between border-b border-stone-50 pb-2 last:border-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-300 w-5">#{i + 1}</span>
            <div>
              <div className="text-sm font-medium text-stone-800">{p.name}</div>
              <div className="text-xs text-stone-400">{formatLkr(p.price)} · {p.stock} in stock</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-emerald-600">{p.totalSales} sold</div>
            {p.revenue != null && (
              <div className="text-xs text-stone-400">{formatLkr(p.revenue, { compact: true })}</div>
            )}
          </div>
        </div>
      ))}
      {products.length === 0 && (
        <div className="text-sm text-stone-400 text-center py-4">No sales data yet</div>
      )}
    </div>
  </div>
);

// ─── Summary Stats Panel ──────────────────────────────────────────────────────

const SummaryPanel: React.FC<{
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  activeProducts: number;
  totalProducts: number;
  avgOrderValue: number;
}> = ({ totalRevenue, totalOrders, totalCustomers, activeProducts, totalProducts, avgOrderValue }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <h3 className="font-semibold text-stone-800 mb-4">Summary</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[
        { label: "Total Revenue", value: formatLkr(totalRevenue, { compact: true }), bg: "bg-amber-50" },
        { label: "Total Orders", value: formatNumber(totalOrders), bg: "bg-blue-50" },
        { label: "Avg Order Value", value: formatLkr(avgOrderValue), bg: "bg-emerald-50" },
        { label: "Customers", value: formatNumber(totalCustomers), bg: "bg-purple-50" },
        { label: "Active Products", value: `${activeProducts} / ${totalProducts}`, bg: "bg-orange-50" },
        { label: "Revenue / Order", value: formatLkr(avgOrderValue), bg: "bg-rose-50" },
      ].map((s) => (
        <div key={s.label} className={`text-center p-3 ${s.bg} rounded-xl`}>
          <div className="text-xs text-stone-500 mb-1">{s.label}</div>
          <div className="text-lg font-bold text-stone-800">{s.value}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Recent Orders Panel ──────────────────────────────────────────────────────

interface RecentOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  status: string;
  totalAmount: number;
  date: string;
}

const STATUS_VARIANT: Record<string, "success" | "info" | "warning" | "danger" | "default"> = {
  DELIVERED: "success", COMPLETED: "success", SHIPPED: "info",
  PROCESSING: "warning", CONFIRMED: "info", PENDING: "warning",
  CANCELLED: "danger", FAILED: "danger", REFUNDED: "default", RETURNED: "default",
};

const RecentOrdersPanel: React.FC<{ orders: RecentOrder[] }> = ({ orders }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <h3 className="font-semibold text-stone-800 mb-4">Recent Orders</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100">
            {(["Order", "Customer", "Amount (LKR)", "Status"] as const).map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-stone-400 pb-2 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan={4} className="py-6 text-center text-stone-400">No orders yet.</td></tr>
          ) : orders.map((o) => (
            <tr key={o.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <td className="py-2.5 pr-4 font-mono text-xs text-stone-500">{o.orderNumber || `#${o.id}`}</td>
              <td className="py-2.5 pr-4 text-stone-700 font-medium">{o.customerName || "—"}</td>
              <td className="py-2.5 pr-4 font-semibold text-stone-800">{formatLkr(o.totalAmount)}</td>
              <td className="py-2.5">
                <Badge variant={STATUS_VARIANT[o.status] || "default"}>{o.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Analytics Page ───────────────────────────────────────────────────────────

interface AnalyticsData {
  kpis: Record<string, KPI>;
  monthlyTrend: TrendData[];
  weeklyTrend: TrendData[];
  categoryBreakdown: CategoryShare[];
  orderStatusBreakdown: TrafficSource[];
  paymentStatusBreakdown: PaymentStatusItem[];
  trafficSources: TrafficSource[];
  bestSellers: BestSeller[];
  recentOrders: RecentOrder[];
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  activeProducts: number;
  totalProducts: number;
  avgOrderValue: number;
  totalRevenueLkr: string;
  revenueGrowth: number;
  orderGrowth: number;
}

const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("30days");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadMsg, setDownloadMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (period) params.append("period", period);
      if (fromDate) params.append("from", fromDate);
      if (toDate) params.append("to", toDate);

      const url = `${ANALYTICS_API}${params.toString() ? "?" + params.toString() : ""}`;
      const res = await authFetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Analytics fetch error:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [period, fromDate, toDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleDownload = async (type: string) => {
    setDownloading(type);
    setDownloadMsg(null);
    try {
      const params = new URLSearchParams();
      params.append("period", period);
      if (fromDate) params.append("from", fromDate);
      if (toDate) params.append("to", toDate);

      const res = await authFetch(`${ANALYTICS_API}/report/${type}?${params.toString()}`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setDownloadMsg({ ok: true, text: `${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded successfully.` });
    } catch (err) {
      console.error("Download error:", err);
      setDownloadMsg({ ok: false, text: "Failed to download report. Please try again." });
    } finally {
      setDownloading(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-5">
        <PageHeader title="Analytics & Reports" subtitle="Performance insights in LKR" />
        <div className="flex items-center justify-center h-64">
          <div className="text-stone-400 text-sm">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-5">
        <PageHeader title="Analytics & Reports" subtitle="Performance insights in LKR" />
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 text-center">
          <div className="text-stone-400 text-sm mb-2">Unable to load analytics data</div>
          <div className="text-xs text-red-400">{error}</div>
          <Btn variant="primary" size="sm" className="mt-4" onClick={fetchAnalytics}>Retry</Btn>
        </div>
      </div>
    );
  }

  const kpiList: KPI[] = data?.kpis
    ? [
        data.kpis.conversionRate as KPI,
        data.kpis.avgOrderValue as KPI,
        data.kpis.returnRate as KPI,
        data.kpis.cartAbandonment as KPI,
      ]
    : [];

  const orderStatus = data?.orderStatusBreakdown || data?.trafficSources || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader title="Analytics & Reports" subtitle="Performance insights in LKR" />
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-1">
            <Filter size={14} className="text-stone-400 ml-2" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm text-stone-700 bg-transparent border-none outline-none py-1.5 pr-2 pl-1"
            >
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="12months">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-1">
            <Calendar size={14} className="text-stone-400 ml-2" />
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
              className="text-xs text-stone-700 bg-transparent border-none outline-none py-1.5 w-28" />
            <span className="text-stone-300">-</span>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
              className="text-xs text-stone-700 bg-transparent border-none outline-none py-1.5 w-28" />
          </div>
          <button onClick={fetchAnalytics}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {loading && <div className="text-center py-2 text-stone-400 text-sm">Updating...</div>}

      {downloadMsg && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
          downloadMsg.ok ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {downloadMsg.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {downloadMsg.text}
        </div>
      )}

      {data && (
        <RevenueHero
          totalRevenue={data.totalRevenue}
          totalRevenueLkr={data.totalRevenueLkr}
          revenueGrowth={data.revenueGrowth ?? 0}
          orderGrowth={data.orderGrowth ?? 0}
          totalOrders={data.totalOrders}
        />
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiList.map((k) => <KPICard key={k.label} {...k} />)}
      </div>

      {data && (
        <SummaryPanel
          totalRevenue={data.totalRevenue}
          totalOrders={data.totalOrders}
          totalCustomers={data.totalCustomers}
          activeProducts={data.activeProducts}
          totalProducts={data.totalProducts}
          avgOrderValue={data.avgOrderValue}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TrendPanel monthly={data?.monthlyTrend || []} weekly={data?.weeklyTrend || []} />
        <OrderStatusPanel sources={orderStatus} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <CategoryPanel categories={data?.categoryBreakdown || []} />
        <PaymentStatusPanel items={data?.paymentStatusBreakdown || []} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <BestSellersPanel products={data?.bestSellers || []} />
        {data?.recentOrders && data.recentOrders.length > 0 && (
          <RecentOrdersPanel orders={data.recentOrders} />
        )}
      </div>

      <ReportsPanel period={period} onDownload={handleDownload} downloading={downloading} />
    </div>
  );
};

export default AnalyticsPage;
