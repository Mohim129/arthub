"use client";
import { useMemo, useState } from "react";

const CATEGORY_COLORS = [
  "#3525cd",
  "#9a442d",
  "#2a9d8f",
  "#e9c46a",
  "#e76f51",
  "#6d597a",
  "#457b9d",
];

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

export default function AnalyticsCharts({ transactions = [], stats = null }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const { weeklySales, categorySlices, totalCategoryRevenue } = useMemo(() => {
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
      }
    }

    const totalCategoryRevenue =
      Array.from(categoryRevenue.values()).reduce((sum, v) => sum + v, 0) || 0;

    const categorySlices = Array.from(categoryRevenue.entries())
      .map(([label, revenue], i) => ({
        label,
        revenue,
        percent:
          totalCategoryRevenue > 0
            ? (revenue / totalCategoryRevenue) * 100
            : 0,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }))
      .sort((a, b) => b.revenue - a.revenue);

    const percentSum = categorySlices.reduce((sum, s) => sum + s.percent, 0);
    if (percentSum > 0 && categorySlices.length > 0) {
      categorySlices.forEach((slice) => {
        slice.percent = (slice.percent / percentSum) * 100;
      });
    }

    return { weeklySales, categorySlices, totalCategoryRevenue };
  }, [transactions]);

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
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-xl">
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
                stroke="#3525cd"
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
                  fill="#3525cd"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="pointer-events-none transition-all duration-150"
                />
              </g>
            ))}

            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3525cd" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3525cd" stopOpacity="0" />
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
          <h4 className="font-h3 text-h3 text-on-surface">Art Categories</h4>
          <p className="text-body-small text-on-surface-variant mt-xs">
            Revenue distribution by category
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
                  {formatCurrency(activeCategory.revenue)}
                </span>
                <span className="text-label-caps text-on-surface-variant">
                  {activeCategory.percent.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <span className="block text-h3 font-bold text-on-surface">
                  {formatCurrency(totalCategoryRevenue)}
                </span>
                <span className="text-label-caps text-on-surface-variant">
                  Total Revenue
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
                  {formatCurrency(slice.revenue)}{" "}
                  <span className="text-on-surface-variant font-normal">
                    ({slice.percent.toFixed(1)}%)
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
  );
}
