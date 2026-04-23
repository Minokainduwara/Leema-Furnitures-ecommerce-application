import React from "react";
import type { BarChartProps, SparkLineProps, ProgressBarProps, TrafficSegment } from "../../types";

// ─── SparkLine ────────────────────────────────────────────────────────────────

export const SparkLine: React.FC<SparkLineProps> = ({ data, color = "#f59e0b", height = 40 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 120;
  const h = height;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = [
    `M0,${h}`,
    ...points.map((p) => `L${p.x},${p.y}`),
    `L${w},${h}`,
    "Z",
  ].join(" ");

  const gradId = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ─── BarChart ─────────────────────────────────────────────────────────────────

export const BarChart: React.FC<BarChartProps> = ({ data, labels, color = "#f59e0b" }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height:     `${(v / max) * 100}%`,
              background: color,
              opacity:    i === data.length - 1 ? 1 : 0.5,
            }}
          />
          <span className="text-[9px] text-stone-400 font-medium">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ─── ProgressBar ─────────────────────────────────────────────────────────────

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label, pct, colorClass = "bg-amber-400",
}) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs text-stone-600 mb-1.5">
      <span>{label}</span>
      <span className="font-semibold">{pct}%</span>
    </div>
    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${colorClass} rounded-full transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  </div>
);

// ─── TrafficBar ──────────────────────────────────────────────────────────────

interface TrafficBarProps {
  segments: TrafficSegment[];
}

export const TrafficBar: React.FC<TrafficBarProps> = ({ segments }) => (
  <div className="flex gap-1 h-4 rounded-full overflow-hidden mb-4">
    {segments.map((s, i) => (
      <div key={i} className={`${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
    ))}
  </div>
);