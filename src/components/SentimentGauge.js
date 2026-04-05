// src/components/SentimentGauge.jsx

const SENTIMENT_CONFIG = {
  "Extreme Fear": {
    color:   "#ef4444",
    bg:      "bg-red-50 dark:bg-red-900/10",
    border:  "border-red-200 dark:border-red-900",
    text:    "text-red-600 dark:text-red-400",
    range:   "0 – 24",
    message: "Market is extremely fearful. Historically a buying opportunity.",
  },
  "Fear": {
    color:   "#f97316",
    bg:      "bg-orange-50 dark:bg-orange-900/10",
    border:  "border-orange-200 dark:border-orange-900",
    text:    "text-orange-600 dark:text-orange-400",
    range:   "25 – 49",
    message: "Investors are fearful. Proceed with caution.",
  },
  "Neutral": {
    color:   "#eab308",
    bg:      "bg-yellow-50 dark:bg-yellow-900/10",
    border:  "border-yellow-200 dark:border-yellow-900",
    text:    "text-yellow-600 dark:text-yellow-400",
    range:   "50",
    message: "Market sentiment is balanced between fear and greed.",
  },
  "Greed": {
    color:   "#22c55e",
    bg:      "bg-green-50 dark:bg-green-900/10",
    border:  "border-green-200 dark:border-green-900",
    text:    "text-green-600 dark:text-green-400",
    range:   "51 – 74",
    message: "Investors are greedy. Consider taking some profits.",
  },
  "Extreme Greed": {
    color:   "#16a34a",
    bg:      "bg-green-50 dark:bg-green-900/10",
    border:  "border-green-200 dark:border-green-900",
    text:    "text-green-700 dark:text-green-300",
    range:   "75 – 100",
    message: "Market is extremely greedy. A correction may be near.",
  },
};

const FALLBACK_CONFIG = {
  color:   "#94a3b8",
  bg:      "bg-slate-50 dark:bg-slate-800",
  border:  "border-slate-200 dark:border-slate-700",
  text:    "text-slate-600 dark:text-slate-400",
  range:   "–",
  message: "Sentiment data unavailable.",
};

export default function SentimentGauge({ value, label, updatedAt }) {
  const config = SENTIMENT_CONFIG[label] ?? FALLBACK_CONFIG;
  const pct    = Math.min(Math.max(value, 0), 100); // clamp 0–100

  return (
    <div className={`rounded-2xl border p-6 ${config.bg} ${config.border}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Market Sentiment
        </h2>
        {updatedAt && (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Updated {updatedAt}
          </span>
        )}
      </div>

      {/* Score + label */}
      <div className="flex items-end gap-3 mb-4">
        <span className={`text-5xl font-bold ${config.text}`}>
          {value}
        </span>
        <div className="mb-1">
          <p className={`text-sm font-semibold ${config.text}`}>{label}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Fear &amp; Greed Index
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-1.5">
          <span>Extreme Fear</span>
          <span>Extreme Greed</span>
        </div>
        <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          {/* Gradient track */}
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              background:
                "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #16a34a)",
            }}
          />
          {/* Active fill */}
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
            style={{
              width:      `${pct}%`,
              background: config.color,
            }}
          />
          {/* Indicator dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm transition-all duration-700"
            style={{
              left:       `calc(${pct}% - 8px)`,
              background: config.color,
            }}
          />
        </div>
        {/* Scale labels */}
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* Editorial message */}
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {config.message}
      </p>

      {/* Range bands */}
      <div className="grid grid-cols-5 gap-1 mt-4">
        {Object.entries(SENTIMENT_CONFIG).map(([key, cfg]) => (
          <div
            key={key}
            className={`rounded-lg p-1.5 text-center transition-opacity ${
              key === label ? "opacity-100" : "opacity-40"
            }`}
            style={{ background: cfg.color + "20", border: `1px solid ${cfg.color}40` }}
          >
            <p className="text-xs font-semibold" style={{ color: cfg.color }}>
              {cfg.range}
            </p>
            <p className="text-xs leading-tight mt-0.5" style={{ color: cfg.color, fontSize: "9px" }}>
              {key}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}