import React from "react";
import { DollarSign, ShoppingCart, Package, Users, ChevronRight, Star } from "lucide-react";
import { Badge, StatCard, PageHeader } from "../../components/ui/admin-ui/index";
import { BarChart, ProgressBar } from "../../components/charts/index";
import {
  MONTHS, REVENUE_DATA,
  INITIAL_PRODUCTS, RECENT_ORDERS, CATEGORY_BREAKDOWN,
} from "../../data/Mockdata";
import type { Order, StatCardProps } from "../../types";

// ─── Status variant map ───────────────────────────────────────────────────────

const ORDER_STATUS_VARIANT: Record<Order["status"], "success" | "info" | "warning" | "danger"> = {
  Delivered:    "success",
  "In Transit": "info",
  Processing:   "warning",
  Cancelled:    "danger",
};

// ─── Recent Orders Table ──────────────────────────────────────────────────────

const RecentOrdersTable: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-stone-800">Recent Orders</h3>
      <button className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-600 transition-colors font-medium">
        View All <ChevronRight size={13} />
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100">
            {(["Order", "Customer", "Product", "Amount", "Status"] as const).map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-stone-400 pb-2 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RECENT_ORDERS.map((o) => (
            <tr key={o.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
              <td className="py-2.5 pr-4 font-mono text-xs text-stone-500">{o.id}</td>
              <td className="py-2.5 pr-4 text-stone-700 font-medium">{o.customer}</td>
              <td className="py-2.5 pr-4 text-stone-500 max-w-[140px] truncate">{o.product}</td>
              <td className="py-2.5 pr-4 font-semibold text-stone-800">${o.amount.toLocaleString()}</td>
              <td className="py-2.5">
                <Badge variant={ORDER_STATUS_VARIANT[o.status]}>{o.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Best Sellers ─────────────────────────────────────────────────────────────

const BestSellers: React.FC = () => {
  const top5 = [...INITIAL_PRODUCTS].sort((a, b) => b.sales - a.sales).slice(0, 5);
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
      <h3 className="font-semibold text-stone-800 mb-4">Best Sellers</h3>
      <div className="space-y-3">
        {top5.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-300 w-4">#{i + 1}</span>
            <span className="text-xl">{p.image}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-stone-700 truncate">{p.name}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-stone-400">{p.rating} · {p.sales} sales</span>
              </div>
            </div>
            <span className="text-sm font-bold text-stone-800">${p.price.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Category Breakdown ───────────────────────────────────────────────────────

const CategoryBreakdown: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <h3 className="font-semibold text-stone-800 mb-1">Top Categories</h3>
    <p className="text-xs text-stone-400 mb-4">By revenue share</p>
    {CATEGORY_BREAKDOWN.map((c) => (
      <ProgressBar key={c.name} label={c.name} pct={c.pct} colorClass={c.color} />
    ))}
  </div>
);

// ─── Dashboard Page ───────────────────────────────────────────────────────────

const STATS: StatCardProps[] = [
  { label: "Total Revenue",     value: "$284,920", change: "+18.2%", up: true,  icon: DollarSign,  colorClass: "text-amber-500",   bgClass: "bg-amber-50",   ringClass: "ring-amber-100" },
  { label: "Orders This Month", value: "342",      change: "+12.5%", up: true,  icon: ShoppingCart, colorClass: "text-blue-500",    bgClass: "bg-blue-50",    ringClass: "ring-blue-100" },
  { label: "Active Products",   value: "128",      change: "-2.1%",  up: false, icon: Package,     colorClass: "text-emerald-500", bgClass: "bg-emerald-50", ringClass: "ring-emerald-100" },
  { label: "Total Customers",   value: "1,847",    change: "+9.3%",  up: true,  icon: Users,       colorClass: "text-purple-500",  bgClass: "bg-purple-50",  ringClass: "ring-purple-100" },
];

const DashboardPage: React.FC = () => (
  <div className="space-y-6">
    <PageHeader
      title="Dashboard Overview"
      subtitle={`Welcome back, Admin · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
    />

    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {STATS.map((s) => <StatCard key={s.label} {...s} />)}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-stone-800">Revenue Overview</h3>
            <p className="text-xs text-stone-400">Last 12 months</p>
          </div>
          <Badge variant="success">↑ 18.2% vs last year</Badge>
        </div>
        <BarChart data={REVENUE_DATA} labels={MONTHS} color="#f59e0b" />
      </div>
      <CategoryBreakdown />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2"><RecentOrdersTable /></div>
      <BestSellers />
    </div>
  </div>
);

export default DashboardPage;