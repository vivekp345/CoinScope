// src/pages/index.js
import { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SentimentGauge from "@/components/SentimentGauge";
import { fetchCoins, fetchSentiment } from "@/lib/api";

// ── Coin row component ────────────────────────────────────────────────────────

function CoinRow({ coin, rank }) {
  const isUp = coin.price_change_percentage_24h >= 0;

  return (
    <Link
      href={`/crypto/${coin.id}`}
      className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
    >
      {/* Rank */}
      <span className="text-xs text-slate-400 dark:text-slate-500 w-6 text-right shrink-0">
        {rank}
      </span>

      {/* Icon + name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={coin.image}
          alt={coin.name}
          className="h-8 w-8 rounded-full shrink-0"
          loading="lazy"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {coin.name}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase">
            {coin.symbol}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          ${coin.current_price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className={`text-xs font-medium ${isUp ? "text-green-500" : "text-red-500"}`}>
          {isUp ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </p>
      </div>

      {/* Market cap — hidden on mobile */}
      <div className="text-right shrink-0 hidden sm:block w-28">
        <p className="text-xs text-slate-400 dark:text-slate-500">Market cap</p>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          ${(coin.market_cap / 1e9).toFixed(2)}B
        </p>
      </div>

      {/* Volume — hidden on mobile */}
      <div className="text-right shrink-0 hidden lg:block w-24">
        <p className="text-xs text-slate-400 dark:text-slate-500">Volume</p>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          ${(coin.total_volume / 1e9).toFixed(2)}B
        </p>
      </div>
    </Link>
  );
}

// ── Page component ────────────────────────────────────────────────────────────

export default function HomePage({ coins, sentiment }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all"); // "all" | "gainers" | "losers"

  // Client-side filtering — SSR data stays intact, no re-fetch needed
  const filtered = useMemo(() => {
    let result = coins;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q)
      );
    }

    if (filter === "gainers") {
      result = result.filter((c) => c.price_change_percentage_24h >= 0);
    } else if (filter === "losers") {
      result = result.filter((c) => c.price_change_percentage_24h < 0);
    }

    return result;
  }, [coins, search, filter]);

  // JSON-LD — ItemList of top coins for Google rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    name:       "Top Cryptocurrencies by Market Cap",
    url:        "https://yourdomain.com",
    itemListElement: coins.slice(0, 10).map((coin, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       coin.name,
      url:        `https://yourdomain.com/crypto/${coin.id}`,
    })),
  };

  return (
    <>
      <Head>
        {/* Primary SEO */}
        <title>CoinScope Pro — Live Crypto Prices & Portfolio Simulator</title>
        <meta
          name="description"
          content="Track live cryptocurrency prices, simulate your P&L, and manage a virtual portfolio. Real-time data for Bitcoin, Ethereum, Solana and 50+ coins."
        />
        <link rel="canonical" href="https://yourdomain.com" />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content="CoinScope Pro — Live Crypto Prices & Portfolio Simulator" />
        <meta property="og:description" content="Track live crypto prices and simulate your P&L. Real-time data for 50+ coins." />
        <meta property="og:url"         content="https://yourdomain.com" />
        <meta property="og:image"       content="https://yourdomain.com/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="CoinScope Pro — Live Crypto Prices" />
        <meta name="twitter:description" content="Track live crypto prices and simulate your P&L." />
        <meta name="twitter:image"       content="https://yourdomain.com/og-image.png" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Hero */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Live Crypto Markets
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl">
              Real-time prices for 50+ cryptocurrencies. Click any coin to simulate
              your profit and loss, then save it to your virtual portfolio.
            </p>
          </div>

          {/* Sentiment gauge */}
          <div className="mb-8">
            <SentimentGauge
              value={sentiment.value}
              label={sentiment.label}
              updatedAt={sentiment.updatedAt}
            />
          </div>

          {/* Search + filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Bitcoin, ETH, SOL..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
              {["all", "gainers", "losers"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Coin table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">

            {/* Table header */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 w-6 text-right shrink-0">#</span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex-1">Coin</span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 text-right shrink-0">Price / 24h</span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 text-right shrink-0 hidden sm:block w-28">Market cap</span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 text-right shrink-0 hidden lg:block w-24">Volume</span>
            </div>

            {/* Coin rows */}
            {filtered.length > 0 ? (
              filtered.map((coin, i) => (
                <CoinRow key={coin.id} coin={coin} rank={i + 1} />
              ))
            ) : (
              <div className="py-16 text-center">
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  No coins match &ldquo;{search}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <p className="mt-6 text-xs text-slate-400 dark:text-slate-600 text-center">
            Data from CoinGecko · Prices update on page refresh · Not financial advice
          </p>

        </div>
      </main>
    </>
  );
}

// SSR — coins + sentiment fetched in parallel on the server
// Page renders fully populated — zero client loading states
export async function getServerSideProps() {
  const [coins, sentiment] = await Promise.all([
    fetchCoins(),
    fetchSentiment(),
  ]);

  return {
    props: {
      coins,
      sentiment,
    },
  };
}