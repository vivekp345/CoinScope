// src/pages/profile.js
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getServerSession, redirectToSignIn } from "@/lib/getServerSession";
import dbConnect from "@/lib/dbConnect";
import Trade from "@/models/Trade";
import User from "@/models/User";

async function fetchCurrentPrices(coinIds) {
  if (!coinIds.length) return {};
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd`
    );
    if (!res.ok) throw new Error("Rate limited");
    const data = await res.json();
    return Object.fromEntries(
      Object.entries(data).map(([id, val]) => [id, val.usd])
    );
  } catch {
    return coinIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
  }
}

export default function ProfilePage({
  session,
  trades,
  prices,
  totalInvested,
  totalValue,
  totalPL,
  totalPLPct,
  joinedAt,
}) {
  const isProfit   = totalPL >= 0;
  const initials   = session.user.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  // Group trades by coin for summary
  const coinSummary = trades.reduce((acc, trade) => {
    if (!acc[trade.coinId]) {
      acc[trade.coinId] = {
        coinId:     trade.coinId,
        coinName:   trade.coinName,
        coinSymbol: trade.coinSymbol,
        totalQty:   0,
        totalInvested: 0,
      };
    }
    acc[trade.coinId].totalQty       += trade.quantity;
    acc[trade.coinId].totalInvested  += trade.invested;
    return acc;
  }, {});

  const holdings = Object.values(coinSummary).map((h) => ({
    ...h,
    currentValue: h.totalQty * (prices[h.coinId] ?? 0),
    pl:           h.totalQty * (prices[h.coinId] ?? 0) - h.totalInvested,
  }));

  return (
    <>
      <Head>
        <title>Profile — CoinScope Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Profile header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="h-16 w-16 rounded-full border-2 border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {initials}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                  {session.user.name ?? "Trader"}
                </h1>
                <p className="text-sm text-slate-400 dark:text-slate-500 truncate">
                  {session.user.email}
                </p>
                {joinedAt && (
                  <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                    Member since {joinedAt}
                  </p>
                )}
              </div>

              {/* Settings link */}
              <Link
                href="/settings"
                className="shrink-0 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Edit profile
              </Link>
            </div>
          </div>

          {/* Portfolio summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Total trades</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {trades.length}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Coins held</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {holdings.length}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Total invested</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${totalInvested.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`rounded-2xl border p-5 ${
              isProfit
                ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900"
                : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900"
            }`}>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Total P&amp;L</p>
              <p className={`text-2xl font-bold ${isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {isProfit ? "+" : ""}${Math.abs(totalPL).toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </p>
              <p className={`text-xs mt-0.5 ${isProfit ? "text-green-500" : "text-red-500"}`}>
                {isProfit ? "+" : ""}{totalPLPct.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Holdings summary */}
          {holdings.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Holdings summary
                </h2>
              </div>
              {holdings.map((h, i) => {
                const up = h.pl >= 0;
                return (
                  <div
                    key={h.coinId}
                    className={`flex items-center gap-4 px-6 py-4 ${
                      i !== holdings.length - 1
                        ? "border-b border-slate-100 dark:border-slate-800"
                        : ""
                    }`}
                  >
                    {/* Coin avatar */}
                    <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                      {h.coinSymbol.slice(0, 3)}
                    </div>

                    {/* Name + qty */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {h.coinName}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {h.totalQty.toFixed(6)} {h.coinSymbol}
                      </p>
                    </div>

                    {/* Invested */}
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-400 dark:text-slate-500">Invested</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        ${h.totalInvested.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Current value */}
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-400 dark:text-slate-500">Value</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        ${h.currentValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* P&L */}
                    <div className="text-right">
                      <p className="text-xs text-slate-400 dark:text-slate-500">P&amp;L</p>
                      <p className={`text-sm font-semibold ${up ? "text-green-500" : "text-red-500"}`}>
                        {up ? "+" : ""}${h.pl.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Link to coin */}
                    <Link
                      href={`/crypto/${h.coinId}`}
                      className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full trade history */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Purchase history
              </h2>
              <Link
                href="/portfolio"
                className="text-xs text-blue-500 hover:underline"
              >
                Manage trades →
              </Link>
            </div>

            {trades.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
                  No trades yet. Start simulating!
                </p>
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  Browse markets
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="text-left px-6 py-3 text-xs font-medium text-slate-400 dark:text-slate-500">Coin</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 dark:text-slate-500">Quantity</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 dark:text-slate-500">Buy price</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 dark:text-slate-500">Invested</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 dark:text-slate-500">Current</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 dark:text-slate-500">P&amp;L</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-slate-400 dark:text-slate-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade, i) => {
                      const currentValue = trade.quantity * (prices[trade.coinId] ?? 0);
                      const pl           = currentValue - trade.invested;
                      const plPct        = trade.invested > 0 ? (pl / trade.invested) * 100 : 0;
                      const up           = pl >= 0;

                      return (
                        <tr
                          key={trade._id}
                          className={`${
                            i !== trades.length - 1
                              ? "border-b border-slate-100 dark:border-slate-800"
                              : ""
                          } hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors`}
                        >
                          {/* Coin */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                                {trade.coinSymbol.slice(0, 3)}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">
                                  {trade.coinName}
                                </p>
                                <p className="text-xs text-slate-400">{trade.coinSymbol}</p>
                              </div>
                            </div>
                          </td>

                          {/* Quantity */}
                          <td className="px-4 py-4 text-right text-slate-700 dark:text-slate-300">
                            {trade.quantity.toFixed(6)}
                          </td>

                          {/* Buy price */}
                          <td className="px-4 py-4 text-right text-slate-700 dark:text-slate-300">
                            ${trade.buyPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                          </td>

                          {/* Invested */}
                          <td className="px-4 py-4 text-right text-slate-700 dark:text-slate-300">
                            ${trade.invested.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                          </td>

                          {/* Current value */}
                          <td className="px-4 py-4 text-right text-slate-700 dark:text-slate-300">
                            ${currentValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                          </td>

                          {/* P&L */}
                          <td className="px-4 py-4 text-right">
                            <span className={`font-semibold ${up ? "text-green-500" : "text-red-500"}`}>
                              {up ? "+" : ""}${Math.abs(pl).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                            </span>
                            <span className={`block text-xs ${up ? "text-green-400" : "text-red-400"}`}>
                              {up ? "+" : ""}{plPct.toFixed(2)}%
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-right text-xs text-slate-400 dark:text-slate-500">
                            {new Date(trade.createdAt).toLocaleDateString("en-US", {
                              day:   "numeric",
                              month: "short",
                              year:  "numeric",
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}

// SSR — protected, fetches trades + live prices server-side
export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res);
  if (!session) return redirectToSignIn("/profile");

  await dbConnect();

  const rawTrades = await Trade.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const trades = rawTrades.map((t) => ({
    ...t,
    _id:       t._id.toString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  // Fetch live prices for all unique coin IDs
  const uniqueCoinIds = [...new Set(trades.map((t) => t.coinId))];
  const prices        = await fetchCurrentPrices(uniqueCoinIds);

  // Summary stats
  const totalInvested = trades.reduce((s, t) => s + t.invested, 0);
  const totalValue    = trades.reduce((s, t) => s + t.quantity * (prices[t.coinId] ?? 0), 0);
  const totalPL       = totalValue - totalInvested;
  const totalPLPct    = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  // Member since date
  const rawUser = await User.findById(session.user.id).lean();
  const joinedAt = rawUser?.createdAt
    ? new Date(rawUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year:  "numeric",
      })
    : null;

  return {
    props: {
      session,
      trades,
      prices,
      totalInvested,
      totalValue,
      totalPL,
      totalPLPct,
      joinedAt,
    },
  };
}