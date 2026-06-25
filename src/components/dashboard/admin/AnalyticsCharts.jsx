"use client";
import { useMemo } from "react";

function parseAmount(val) {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const n = String(val).replace(/[^0-9.-]/g, "");
  return parseFloat(n) || 0;
}

export default function AnalyticsCharts({ transactions = [], stats = null }) {
  const { salesSeries, labels, categorySlices, totalWorks } = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      return d;
    });

    const labels = days.map((d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    const salesMap = new Map(labels.map((l) => [l, 0]));
    const categoryCount = new Map();
    let totalWorks = 0;

    for (const t of transactions || []) {
      const date = t.createdAt ? new Date(t.createdAt) : null;
      const label = date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : null;
      const amt = parseAmount(t.amount);

      if (t.type === "Purchase") {
        totalWorks += 1;
        if (label && salesMap.has(label)) salesMap.set(label, salesMap.get(label) + amt);
      }

      const cat = t.artworkCategory || t.category || t.type || "Other";
      categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
    }

    const salesSeries = Array.from(salesMap.values());
    const total = Array.from(categoryCount.values()).reduce((s, v) => s + v, 0) || 1;
    const categorySlices = Array.from(categoryCount.entries()).map(([k, v], i) => ({
      label: k,
      value: v,
      percent: Math.round((v / total) * 100),
      colorIndex: i,
    }));

    return { salesSeries, labels, categorySlices, totalWorks };
  }, [transactions]);

  const maxSales = Math.max(...salesSeries, 10);
  const points = salesSeries.map((v, i) => {
    const x = ((i / Math.max(1, salesSeries.length - 1)) * 800).toFixed(2);
    const y = (180 - (v / maxSales) * 160).toFixed(2);
    return `${x},${y}`;
  });
  const pathD = points.length ? `M${points.join(" L")}` : "";
  const doughnutTotal = stats?.totalSoldArtworks ?? totalWorks;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-xl">
      {/* Line Chart */}
      <div className="lg:col-span-2 glass-card p-lg rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-lg">
          <h4 className="font-h3 text-h3 text-on-surface">Sales Performance</h4>
          <div className="flex gap-sm">
            <span className="flex items-center gap-xs font-label-caps text-on-surface-variant">
              <div className="w-3 h-3 bg-primary rounded-full"></div> This Month
            </span>
            <span className="flex items-center gap-xs font-label-caps text-on-surface-variant">
              <div className="w-3 h-3 bg-secondary rounded-full"></div> Last
              Month
            </span>
          </div>
        </div>
        <div className="h-64 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 800 200">
            <line stroke="#e3e0f7" strokeWidth="1" x1="0" x2="800" y1="0" y2="0" />
            <line stroke="#e3e0f7" strokeWidth="1" x1="0" x2="800" y1="50" y2="50" />
            <line stroke="#e3e0f7" strokeWidth="1" x1="0" x2="800" y1="100" y2="100" />
            <line stroke="#e3e0f7" strokeWidth="1" x1="0" x2="800" y1="150" y2="150" />
            <path className="chart-path" d={pathD} fill="none" stroke="#3525cd" strokeWidth="4" />
          </svg>
          <div className="flex justify-between mt-sm text-on-surface-variant font-label-caps">
            {labels.map((l) => (
              <span key={l}>{l.split(" ")[0]}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="glass-card p-lg rounded-xl shadow-sm flex flex-col">
        <h4 className="font-h3 text-h3 text-on-surface mb-lg">Art Categories</h4>
        <div className="flex-1 flex items-center justify-center relative">
          <svg className="w-48 h-48" viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#e3e0f7" strokeWidth="3" />
            {categorySlices.reduce((offset, slice, i) => {
              const dash = `${(slice.percent / 100) * 100} ${100 - (slice.percent / 100) * 100}`;
              const colors = ["#3525cd", "#9a442d", "#7e3000", "#2a9d8f", "#e9c46a"];
              const circle = (
                <circle
                  key={slice.label}
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="15.9"
                  stroke={colors[i % colors.length]}
                  strokeDasharray={dash}
                  strokeDashoffset={offset}
                  strokeWidth="3"
                />
              );
              return offset - (slice.percent / 100) * 100;
            }, 0)}
          </svg>
          <div className="absolute text-center">
            <span className="block text-h3 font-bold text-on-surface">{doughnutTotal}</span>
            <span className="text-label-caps text-on-surface-variant">Works</span>
          </div>
        </div>
        <div className="mt-md space-y-sm">
          {categorySlices.map((s, i) => (
            <div key={s.label} className="flex justify-between items-center">
              <span className="flex items-center gap-xs font-body-small text-on-surface-variant">
                <div className={`w-3 h-3 rounded-full`} style={{ background: ["#3525cd","#9a442d","#7e3000","#2a9d8f","#e9c46a"][i%5] }}></div>
                {s.label}
              </span>
              <span className="font-semibold text-on-surface">{s.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
