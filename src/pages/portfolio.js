// src/pages/portfolio.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TradeCard from "@/components/TradeCard";
import { getServerSession, redirectToSignIn } from "@/lib/getServerSession";
import dbConnect from "@/lib/dbConnect";
import Trade from "@/models/Trade";

// Fetch current prices for a list of coin IDs from CoinGecko
async function fetchCurrentPrices(coinIds) {
  if (!coinIds.length) return {};
  try {
    const ids = coinIds.join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );
    if (!res.ok) throw new Error("CoinGecko rate limited");
    const data = await res.json();
    // Returns { bitcoin: { usd: 65000 }, ethereum: { usd: 3200 }, ... }
    return Object.fromEntries(
      Object.entries(data).map(([id, val]) => [id, val.usd])
    );
  } catch {
    // Fallback mock prices so the page never breaks
    return coinIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
  }
}

export default function PortfolioPage({ trades: initialTrades, prices, totalInvested, totalValue, totalPL, totalPLPct, session }) {
  const [trades, setTrades] = useState(initialTrades);

  // Add trade form state
  const [showForm, setShowForm]     = useState(false);
  const [coinId, setCoinId]         = useState("");
  const [coinName, setCoinName]     = useState("");
  const [coinSymbol, setCoinSymbol] = useState("");
  const [quantity, setQuantity]     = useState("");
  const [buyPrice, setBuyPrice]     = useState("");
  const [formError, setFormError]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isProfit = totalPL >= 0;

  // Optimistic delete — remove from state instantly
  function handleDelete(deletedId) {
    setTrades((prev) => prev.filter((t) => t._id !== deletedId));
  }

  async function handleAddTrade(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    const res = await fetch("/api/trades", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coinId:     coinId.toLowerCase().trim(),
        coinName:   coinName.trim(),
        coinSymbol: coinSymbol.toUpperCase().trim(),
        quantity:   parseFloat(quantity),
        buyPrice:   parseFloat(buyPrice),
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setFormError(data.error ?? "Failed to add trade");
      return;
    }

    // Prepend new trade to list
    setTrades((prev) => [data.trade, ...prev]);

    // Reset form
    setCoinId(""); setCoinName(""); setCoinSymbol("");
    setQuantity(""); setBuyPrice("");
    setShowForm(false);
  }

  return (
    <>
      <Head>
        {/* SEO — portfolio is private so noindex */}
        <title>My Portfolio — CoinScope Pro</title>
        <meta name="description" content="Your virtual crypto portfolio on CoinScope Pro." />
        <meta name="robots" content="noindex, nofollow" />

        {/* JSON-LD — BreadcrumbList for navigation context */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home",      item: "https://yourdomain.com" },
                { "@type": "ListItem", position: 2, name: "Portfolio", item: "https://yourdomain.com/portfolio" },
              ],
            }),
          }}
        />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                My Portfolio
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Welcome back, {session.user.name?.split(" ")[0] ?? "Trader"}
              </p>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add trade
            </button>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Total invested</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                ${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Current value</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className={`rounded-2xl border p-5 ${isProfit ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900" : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900"}`}>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Total P&amp;L</p>
              <p className={`text-xl font-bold ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {isProfit ? "+" : ""}${totalPL.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className={`rounded-2xl border p-5 ${isProfit ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900" : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900"}`}>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Return</p>
              <p className={`text-xl font-bold ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {isProfit ? "+" : ""}{totalPLPct.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Add trade form */}
          {showForm && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-8">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Add simulated trade
              </h2>

              {formError && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddTrade}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Coin ID <span className="text-slate-400">(e.g. bitcoin)</span>
                    </label>
                    <input
                      type="text"
                      value={coinId}
                      onChange={(e) => setCoinId(e.target.value)}
                      placeholder="bitcoin"
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Coin name <span className="text-slate-400">(e.g. Bitcoin)</span>
                    </label>
                    <input
                      type="text"
                      value={coinName}
                      onChange={(e) => setCoinName(e.target.value)}
                      placeholder="Bitcoin"
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Symbol <span className="text-slate-400">(e.g. BTC)</span>
                    </label>
                    <input
                      type="text"
                      value={coinSymbol}
                      onChange={(e) => setCoinSymbol(e.target.value)}
                      placeholder="BTC"
                      required
                      maxLength={10}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0.5"
                      required
                      min="0.000001"
                      step="any"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                      Buy price (USD)
                    </label>
                    <input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      placeholder="65000"
                      required
                      min="0.01"
                      step="any"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
                  >
                    {submitting ? "Adding..." : "Add trade"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setFormError(""); }}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Trade cards */}
          {trades.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No trades yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Add your first simulated trade to start tracking P&amp;L.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Add your first trade
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trades.map((trade) => (
                <TradeCard
                  key={trade._id}
                  trade={trade}
                  currentPrice={prices[trade.coinId] ?? 0}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}

// SSR — protected, fetches trades + live prices server-side
export async function getServerSideProps({ req, res }) {
  // 1. Check session
  const session = await getServerSession(req, res);
  if (!session) return redirectToSignIn("/portfolio");

  // 2. Fetch trades from MongoDB
  await dbConnect();
  const rawTrades = await Trade.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  // Serialize MongoDB docs (convert _id, dates to strings)
  const trades = rawTrades.map((t) => ({
    ...t,
    _id:       t._id.toString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  // 3. Fetch live prices for all unique coin IDs
  const uniqueCoinIds = [...new Set(trades.map((t) => t.coinId))];
  const prices        = await fetchCurrentPrices(uniqueCoinIds);

  // 4. Calculate summary stats server-side
  const totalInvested = trades.reduce((sum, t) => sum + t.invested, 0);
  const totalValue    = trades.reduce((sum, t) => sum + t.quantity * (prices[t.coinId] ?? 0), 0);
  const totalPL       = totalValue - totalInvested;
  const totalPLPct    = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  return {
    props: {
      session,
      trades,
      prices,
      totalInvested,
      totalValue,
      totalPL,
      totalPLPct,
    },
  };
}