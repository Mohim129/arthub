export default function AnalyticsCharts() {
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
            <line
              stroke="#e3e0f7"
              strokeWidth="1"
              x1="0"
              x2="800"
              y1="0"
              y2="0"
            />
            <line
              stroke="#e3e0f7"
              strokeWidth="1"
              x1="0"
              x2="800"
              y1="50"
              y2="50"
            />
            <line
              stroke="#e3e0f7"
              strokeWidth="1"
              x1="0"
              x2="800"
              y1="100"
              y2="100"
            />
            <line
              stroke="#e3e0f7"
              strokeWidth="1"
              x1="0"
              x2="800"
              y1="150"
              y2="150"
            />
            <path
              className="chart-path"
              d="M0,180 Q100,140 200,160 T400,80 T600,120 T800,40"
              fill="none"
              stroke="#3525cd"
              strokeWidth="4"
            />
            <path
              className="chart-path"
              d="M0,190 Q100,170 200,185 T400,130 T600,150 T800,90"
              fill="none"
              stroke="#9a442d"
              strokeOpacity="0.5"
              strokeWidth="3"
            />
          </svg>
          <div className="flex justify-between mt-sm text-on-surface-variant font-label-caps">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="glass-card p-lg rounded-xl shadow-sm flex flex-col">
        <h4 className="font-h3 text-h3 text-on-surface mb-lg">
          Art Categories
        </h4>
        <div className="flex-1 flex items-center justify-center relative">
          <svg className="w-48 h-48" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              fill="transparent"
              r="15.9"
              stroke="#e3e0f7"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              fill="transparent"
              r="15.9"
              stroke="#3525cd"
              strokeDasharray="45 100"
              strokeDashoffset="25"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              fill="transparent"
              r="15.9"
              stroke="#9a442d"
              strokeDasharray="25 100"
              strokeDashoffset="80"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              fill="transparent"
              r="15.9"
              stroke="#7e3000"
              strokeDasharray="15 100"
              strokeDashoffset="105"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute text-center">
            <span className="block text-h3 font-bold text-on-surface">
              2.4k
            </span>
            <span className="text-label-caps text-on-surface-variant">
              Works
            </span>
          </div>
        </div>
        <div className="mt-md space-y-sm">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-xs font-body-small text-on-surface-variant">
              <div className="w-3 h-3 bg-primary rounded-full"></div> Painting
            </span>
            <span className="font-semibold text-on-surface">45%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-xs font-body-small text-on-surface-variant">
              <div className="w-3 h-3 bg-secondary rounded-full"></div> Digital
              Art
            </span>
            <span className="font-semibold text-on-surface">25%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-xs font-body-small text-on-surface-variant">
              <div className="w-3 h-3 bg-tertiary rounded-full"></div>{" "}
              Sculptures
            </span>
            <span className="font-semibold text-on-surface">15%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
