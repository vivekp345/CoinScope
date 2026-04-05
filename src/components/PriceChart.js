// src/components/PriceChart.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js modules once
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export default function PriceChart({ history, coinName }) {
  const prices    = history.map((h) => h.price);
  const firstPrice = prices[0] ?? 0;
  const lastPrice  = prices[prices.length - 1] ?? 0;
  const isUp       = lastPrice >= firstPrice;

  const color = isUp ? "#22c55e" : "#ef4444";
  const fillColor = isUp ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)";

  const data = {
    labels: history.map((h) => h.date),
    datasets: [
      {
        data:            prices,
        borderColor:     color,
        backgroundColor: fillColor,
        borderWidth:     2,
        fill:            true,
        tension:         0.4,
        pointRadius:     3,
        pointHoverRadius: 5,
        pointBackgroundColor: color,
      },
    ],
  };

  const options = {
    responsive:          true,
    maintainAspectRatio: true,
    interaction: {
      mode:      "index",
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ` $${ctx.parsed.y.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font:  { size: 11 },
          color: "#94a3b8",
        },
      },
      y: {
        position: "right",
        grid: {
          color: "rgba(148,163,184,0.1)",
        },
        ticks: {
          font:  { size: 11 },
          color: "#94a3b8",
          callback: (val) =>
            "$" + val.toLocaleString("en-US", { maximumFractionDigits: 0 }),
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          7-day price
        </h2>
        <span className={`text-sm font-semibold ${isUp ? "text-green-500" : "text-red-500"}`}>
          {isUp ? "▲" : "▼"}{" "}
          {Math.abs(((lastPrice - firstPrice) / firstPrice) * 100).toFixed(2)}%
        </span>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}