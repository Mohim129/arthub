"use client";
import { useMemo, useState } from "react";

// Fixed color assignment per artwork category
const CATEGORY_COLOR_MAP = {
  "Digital Painting": "#6366f1",
  "3D Abstract": "#f59e0b",
  "Generative Art": "#10b981",
  Photography: "#ef4444",
  "Digital Illustration": "#8b5cf6",
  Painting: "#ec4899",
  Other: "#64748b",
};

// Subscription tier visual config
const TIER_CONFIG = {
  free: { label: "Free", color: "#94a3b8", bg: "bg-slate-100 dark:bg-slate-800/40" },
  pro: { label: "Pro", color: "#6366f1", bg: "bg-indigo-50 dark:bg-indigo-900/30" },
  premium: { label: "Premium", color: "#f59e0b", bg: "bg-amber-50 dark:bg-amber-900/30" },
};

function getCategoryColor(categoryName) {
  return CATEGORY_COLOR_MAP[categoryName] || CATEGORY_COLOR_MAP["Other"];
}

function parseAmount(val) {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const n = String(val).replace(/[^0-9.-]/g, "");
  return parseFloat(n) || 0;
}

function formatCurrency(amount) {
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getTransactionDate(txn) {
  if (txn.createdAt) return new Date(txn.createdAt);
  if (txn.date) return new Date(txn.date);
  return null;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function AnalyticsCharts({ transactions = [], stats = null, users = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const { weeklySales, categorySlices, totalCategoryRevenue, totalCategorySales } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      return d;
    });

    const weeklySales = weekDays.map((date) => ({
      date,
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      amount: 0,
    }));

    const categoryRevenue = new Map();
    const categorySalesCount = new Map();

    for (const t of transactions || []) {
      const amount = parseAmount(t.amount);
      const txnDate = getTransactionDate(t);

      if (t.type === "Purchase") {
        if (txnDate) {
          const bucket = weeklySales.find((day) => isSameDay(day.date, txnDate));
          if (bucket) bucket.amount += amount;
        }

        const cat = t.artworkCategory || t.category || "Other";
        categoryRevenue.set(cat, (categoryRevenue.get(cat) || 0) + amount);
        categorySalesCount.set(cat, (categorySalesCount.get(cat) || 0) + 1);
      }
    }

    const totalCategoryRevenue =
      Array.from(categoryRevenue.values()).reduce((sum, v) => sum + v, 0) || 0;

    const totalCategorySales =
      Array.from(categorySalesCount.values()).reduce((sum, v) => sum + v, 0) || 0;

    const categorySlices = Array.from(categoryRevenue.entries())
      .map(([label, revenue]) => ({
        label,
        revenue,
        salesCount: categorySalesCount.get(label) || 0,
        percent:
          totalCategoryRevenue > 0
            ? (revenue / totalCategoryRevenue) * 100
            : 0,
        color: getCategoryColor(label),
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const percentSum = categorySlices.reduce((sum, s) => sum + s.percent, 0);
    if (percentSum > 0 && categorySlices.length > 0) {
      categorySlices.forEach((slice) => {
        slice.percent = (slice.percent / percentSum) * 100;
      });
    }

    return { weeklySales, categorySlices, totalCategoryRevenue, totalCategorySales };
  }, [transactions]);

  // Compute subscription tier counts from users
  const tierCounts = useMemo(() => {
    const counts = { free: 0, pro: 0, premium: 0 };
    for (const user of users || []) {
      const tier = (user.tier || "free").toLowerCase();
      if (counts[tier] !== undefined) {
        counts[tier]++;
      } else {
        counts.free++;
      }
    }
    return counts;
  }, [users]);

  const totalTierUsers = tierCounts.free + tierCounts.pro + tierCounts.premium;

  const maxSales = Math.max(...weeklySales.map((d) => d.amount), 1);
  const chartWidth = 800;
  const chartHeight = 200;
  const paddingY = 20;

  const points = weeklySales.map((day, i) => {
    const x =
      weeklySales.length === 1
        ? chartWidth / 2
        : (i / (weeklySales.length - 1)) * chartWidth;
    const y =
      chartHeight -
      paddingY -
      (day.amount / maxSales) * (chartHeight - paddingY * 2);
    return { x, y, ...day };
  });

  const pathD = points.length
    ? `M${points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" L")}`
    : "";

  const areaD = points.length
    ? `${pathD} L${chartWidth},${chartHeight} L0,${chartHeight} Z`
    : "";

  let doughnutOffset = 25;
  const doughnutSlices = categorySlices.map((slice) => {
    const dash = slice.percent;
    const offset = doughnutOffset;
    doughnutOffset -= dash;
    return { ...slice, dash, offset };
  });

  const activePoint =
    hoveredPoint !== null ? weeklySales[hoveredPoint] : null;
  const activePointCoords =
    hoveredPoint !== null ? points[hoveredPoint] : null;
  const activeCategory =
    hoveredCategory !== null
      ? categorySlices.find((s) => s.label === hoveredCategory)
      : null;

  return (
    <div className="space-y-gutter">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Weekly sales line chart */}
        <div className="lg:col-span-2 glass-card p-lg rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-lg">
            <div>
              <h4 className="font-h3 text-h3 text-on-surface">Sales Performance</h4>
              <p className="text-body-small text-on-surface-variant mt-xs">
                Purchase revenue over the last 7 days
              </p>
            </div>
            <span className="flex items-center gap-xs font-label-caps text-on-surface-variant">
              <span className="w-3 h-3 bg-primary rounded-full" />
              This Week
            </span>
          </div>

          <div className="h-64 w-full relative">
            <svg
              className="w-full h-full"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = paddingY + ratio * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={ratio}
                    x1="0"
                    x2={chartWidth}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity="0.12"
                    strokeWidth="1"
                  />
                );
              })}

              {areaD && (
                <path
                  d={areaD}
                  fill="url(#salesGradient)"
                  opacity="0.25"
                />
              )}

              {pathD && (
                <path
                  className="chart-path"
                  d={pathD}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {points.map((point, i) => (
                <g key={point.label}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="18"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={hoveredPoint === i ? 7 : 5}
                    fill="#6366f1"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="pointer-events-none transition-all duration-150"
                  />
                </g>
              ))}

              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {activePoint && activePointCoords && (
              <div
                className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-full mb-2"
                style={{
                  left: `${(activePointCoords.x / chartWidth) * 100}%`,
                  top: `${(activePointCoords.y / chartHeight) * 100}%`,
                }}
              >
                <div className="bg-surface-container-highest border border-outline-variant/30 shadow-lg rounded-lg px-md py-sm text-center min-w-[140px]">
                  <p className="text-body-small font-semibold text-on-surface">
                    {activePoint.label}
                  </p>
                  <p className="text-body-small text-primary font-bold mt-xs">
                    {formatCurrency(activePoint.amount)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-sm text-on-surface-variant font-label-caps text-[10px] sm:text-label-caps">
              {weeklySales.map((day) => (
                <span key={day.label} className="text-center">
                  {day.date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue by category doughnut */}
        <div className="glass-card p-lg rounded-xl shadow-sm flex flex-col">
          <div className="mb-lg">
            <h4 className="font-h3 text-h3 text-on-surface">Category Sales</h4>
            <p className="text-body-small text-on-surface-variant mt-xs">
              Revenue & sales by artwork category
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
            <svg className="w-52 h-52" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                fill="transparent"
                r="15.9"
                stroke="currentColor"
                strokeOpacity="0.12"
                strokeWidth="3.8"
              />
              {doughnutSlices.map((slice) => (
                <circle
                  key={slice.label}
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="15.9"
                  stroke={slice.color}
                  strokeDasharray={`${slice.dash} ${100 - slice.dash}`}
                  strokeDashoffset={slice.offset}
                  strokeWidth="3.8"
                  className="cursor-pointer transition-opacity duration-150"
                  style={{
                    opacity:
                      hoveredCategory && hoveredCategory !== slice.label
                        ? 0.35
                        : 1,
                  }}
                  onMouseEnter={() => setHoveredCategory(slice.label)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              ))}
            </svg>

            <div className="absolute text-center pointer-events-none px-sm">
              {activeCategory ? (
                <>
                  <span className="block text-body-small font-semibold text-on-surface truncate max-w-[120px]">
                    {activeCategory.label}
                  </span>
                  <span className="block text-h3 font-bold text-on-surface mt-xs">
                    {activeCategory.salesCount} sales
                  </span>
                  <span className="text-label-caps text-on-surface-variant">
                    {activeCategory.percent.toFixed(1)}% · {formatCurrency(activeCategory.revenue)}
                  </span>
                </>
              ) : (
                <>
                  <span className="block text-h3 font-bold text-on-surface">
                    {totalCategorySales}
                  </span>
                  <span className="text-label-caps text-on-surface-variant">
                    Total Sales
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="mt-md space-y-sm">
            {categorySlices.length > 0 ? (
              categorySlices.map((slice) => (
                <div
                  key={slice.label}
                  className={`flex justify-between items-center rounded-lg px-sm py-xs transition-colors cursor-default ${
                    hoveredCategory === slice.label
                      ? "bg-surface-container-high"
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredCategory(slice.label)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <span className="flex items-center gap-xs font-body-small text-on-surface-variant">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: slice.color }}
                    />
                    {slice.label}
                  </span>
                  <span className="font-semibold text-on-surface text-body-small">
                    {slice.salesCount} sold{" "}
                    <span className="text-on-surface-variant font-normal">
                      · {slice.percent.toFixed(1)}%
                    </span>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-body-small text-on-surface-variant text-center py-md">
                No purchase revenue data yet
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Subscription Tier Distribution */}
      <section className="glass-card p-lg rounded-xl shadow-sm">
        <div className="mb-lg">
          <h4 className="font-h3 text-h3 text-on-surface">Subscription Tiers</h4>
          <p className="text-body-small text-on-surface-variant mt-xs">
            Users across subscription plans · {totalTierUsers} total
          </p>
        </div>

        {totalTierUsers > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {Object.entries(TIER_CONFIG).map(([key, config]) => {
              const count = tierCounts[key];
              const pct = totalTierUsers > 0 ? ((count / totalTierUsers) * 100).toFixed(1) : "0.0";
              return (
                <div
                  key={key}
                  className={`${config.bg} rounded-xl p-md border border-outline-variant/20 dark:border-outline-variant/10 transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-sm">
                    <div className="flex items-center gap-sm">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ background: config.color }}
                      />
                      <span className="font-h3 text-h3 text-on-surface">{config.label}</span>
                    </div>
                    <span className="text-body-small text-on-surface-variant font-medium">{pct}%</span>
                  </div>
                  <p className="text-3xl font-bold text-on-surface mb-sm">{count}</p>
                  <div className="w-full h-2 bg-outline-variant/20 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-body-small text-on-surface-variant text-center py-md">
            No user data available
          </p>
        )}
      </section>
    </div>
  );
}
