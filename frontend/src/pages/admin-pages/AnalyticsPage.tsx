import React from "react";
import { ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { Badge, Btn, PageHeader } from "../../components/ui/admin-ui/index";
import { SparkLine, TrafficBar } from "../../components/charts/index";
import {
  ORDERS_DATA, REVENUE_DATA,
  ANALYTICS_KPI, TRAFFIC_SOURCES,
} from "../../data/Mockdata";
import type { KPI, Report, TrafficSource } from "../../types";

// ─── Traffic colours ──────────────────────────────────────────────────────────

const TRAFFIC_COLORS: string[] = ["bg-amber-500", "bg-stone-700", "bg-amber-300", "bg-stone-400", "bg-stone-200"];

// ─── KPI Card ─────────────────────────────────────────────────────────────────

const KPICard: React.FC<KPI> = ({ label, value, change, up }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <div className="text-2xl font-bold text-stone-800">{value}</div>
    <div className="text-xs text-stone-500 mt-0.5 mb-2">{label}</div>
    <span className={`text-xs font-semibold flex items-center gap-0.5 ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {change}
    </span>
  </div>
);

// ─── Trend Panel ─────────────────────────────────────────────────────────────

const TrendPanel: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <h3 className="font-semibold text-stone-800 mb-4">Orders vs Revenue</h3>
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-xs text-stone-500 mb-1.5">
          <span>Orders</span>
          <span className="font-semibold text-stone-700">{ORDERS_DATA[ORDERS_DATA.length - 1]}</span>
        </div>
        <SparkLine data={ORDERS_DATA} color="#78716c" height={48} />
      </div>
      <div>
        <div className="flex justify-between text-xs text-stone-500 mb-1.5">
          <span>Revenue (K)</span>
          <span className="font-semibold text-stone-700">${REVENUE_DATA[REVENUE_DATA.length - 1]}K</span>
        </div>
        <SparkLine data={REVENUE_DATA} color="#f59e0b" height={48} />
      </div>
    </div>
  </div>
);

// ─── Traffic Panel ────────────────────────────────────────────────────────────

const TrafficPanel: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <h3 className="font-semibold text-stone-800 mb-4">Traffic Sources</h3>
    <TrafficBar
      segments={TRAFFIC_SOURCES.map((t, i) => ({ pct: t.pct, color: TRAFFIC_COLORS[i] || "bg-stone-200" }))}
    />
    <div className="space-y-2.5">
      {TRAFFIC_SOURCES.map((t: TrafficSource, i: number) => (
        <div key={t.source} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${TRAFFIC_COLORS[i]}`} />
            <span className="text-sm text-stone-600">{t.source}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-stone-800">{t.visits.toLocaleString()}</span>
            <span className="text-xs text-stone-400 ml-1">({t.pct}%)</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Reports Panel ────────────────────────────────────────────────────────────

const REPORTS: Report[] = [
  { title: "Sales Report",     desc: "Full breakdown of monthly sales by product, category, and region.", period: "June 2025" },
  { title: "Customer Report",  desc: "New vs returning customers, lifetime value, and churn analysis.",   period: "Q2 2025" },
  { title: "Inventory Report", desc: "Stock levels, reorder points, and top-selling SKUs.",               period: "Current" },
];

const ReportsPanel: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
    <h3 className="font-semibold text-stone-800 mb-4">Download Reports</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {REPORTS.map((r) => (
        <div key={r.title} className="border border-stone-100 rounded-xl p-4 hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
          <div className="font-semibold text-stone-800 mb-1">{r.title}</div>
          <div className="text-xs text-stone-400 mb-3">{r.desc}</div>
          <div className="flex items-center justify-between">
            <Badge variant="default">{r.period}</Badge>
            <Btn variant="ghost" size="sm" className="group-hover:text-amber-600">
              <Download size={13} />Export
            </Btn>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Analytics Page ───────────────────────────────────────────────────────────

const AnalyticsPage: React.FC = () => (
  <div className="space-y-5">
    <PageHeader title="Analytics & Reports" subtitle="Performance insights — last 30 days" />

    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {ANALYTICS_KPI.map((k) => <KPICard key={k.label} {...k} />)}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <TrendPanel />
      <TrafficPanel />
    </div>

    <ReportsPanel />
  </div>
);

export default AnalyticsPage;