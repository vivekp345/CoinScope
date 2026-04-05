    // src/components/PLSimulator.jsx
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function PLSimulator({ coin, currentPrice }) {
  const { data: session } = useSession();

  const [invested, setInvested]   = useState("");
  const [buyPrice, setBuyPrice]   = useState("");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [saveError, setSaveError] = useState("");

  // Core calculations
  const quantity     = invested && buyPrice && +buyPrice > 0 ? +invested / +buyPrice : 0;
  const currentValue = quantity * currentPrice;
  const pl           = currentValue - +invested;
  const plPct        = +invested > 0 ? (pl / +invested) * 100 : 0;
  const isProfit     = pl >= 0;
  const hasResult    = quantity > 0;

  // Save to portfolio
  async function handleSave() {
    if (!session) {
      window.location.href = "/auth/signin?callbackUrl=/crypto/" + coin.id;
      return;
    }

    setSaving(true);
    setSaveError("");

    const res = await fetch("/api/trades", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coinId:     coin.id,
        coinName:   coin.name,
        coinSymbol: coin.symbol.toUpperCase(),
        quantity,
        buyPrice:   +buyPrice,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setSaveError(data.error ?? "Failed to save trade");
      return;
    }

    setSaved(true);
    // Reset saved state after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
        P&amp;L Simulator
      </h2>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
        Enter an amount and a buy price to see your simulated profit or loss.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Amount invested */}
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Amount invested (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input
              type="number"
              value={invested}
              onChange={(e) => { setInvested(e.target.value); setSaved(false); }}
              placeholder="1000"
              min="0"
              step="any"
              className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Buy price */}
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Buy price (USD per coin)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => { setBuyPrice(e.target.value); setSaved(false); }}
              placeholder={currentPrice.toLocaleString()}
              min="0"
              step="any"
              className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          {/* Quick fill current price */}
          <button
            type="button"
            onClick={() => setBuyPrice(currentPrice.toString())}
            className="mt-1.5 text-xs text-blue-500 hover:underline"
          >
            Use current price (${currentPrice.toLocaleString()})
          </button>
        </div>
      </div>

      {/* Result panel */}
      {hasResult && (
        <div className={`rounded-xl p-5 mb-4 border transition-all ${
          isProfit
            ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900"
            : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900"
        }`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Coins held</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {quantity.toFixed(6)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Current value</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                ${currentValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">P&amp;L (USD)</p>
              <p className={`text-sm font-semibold ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {isProfit ? "+" : ""}${pl.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Return</p>
              <p className={`text-sm font-semibold ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {isProfit ? "+" : ""}{plPct.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Save error */}
      {saveError && (
        <p className="text-xs text-red-500 mb-3">{saveError}</p>
      )}

      {/* Save to portfolio button */}
      {hasResult && (
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
            saved
              ? "bg-green-500 text-white cursor-default"
              : "bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white"
          }`}
        >
          {saved
            ? "✓ Saved to portfolio"
            : saving
            ? "Saving..."
            : session
            ? "Save to portfolio"
            : "Sign in to save trade"}
        </button>
      )}
    </div>
  );
}