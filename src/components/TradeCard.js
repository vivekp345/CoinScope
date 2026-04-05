// src/components/TradeCard.jsx

export default function TradeCard({ trade, currentPrice, onDelete }) {
  const currentValue = trade.quantity * currentPrice;
  const pl           = currentValue - trade.invested;
  const plPct        = ((pl / trade.invested) * 100).toFixed(2);
  const isProfit     = pl >= 0;

  async function handleDelete() {
    if (!confirm(`Remove your ${trade.coinName} trade?`)) return;

    const res = await fetch(`/api/trades/${trade._id}`, { method: "DELETE" });

    if (res.ok) {
      onDelete(trade._id);
    } else {
      alert("Failed to delete trade. Please try again.");
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Coin avatar */}
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
            {trade.coinSymbol.slice(0, 3)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {trade.coinName}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {trade.coinSymbol} · {trade.quantity} coins
            </p>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label="Delete trade"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Invested</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            ${trade.invested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Current value</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            ${currentValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Buy price</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            ${trade.buyPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${isProfit ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">P&amp;L</p>
          <p className={`text-sm font-semibold ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {isProfit ? "+" : ""}${pl.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-xs ml-1">({isProfit ? "+" : ""}{plPct}%)</span>
          </p>
        </div>
      </div>

      {/* Buy date */}
      <p className="mt-3 text-xs text-slate-400 dark:text-slate-600">
        Simulated on {new Date(trade.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
      </p>
    </div>
  );
}