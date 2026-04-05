// src/pages/crypto/[id].js
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PLSimulator from "@/components/PLSimulator";
import { fetchCoinDetail, fetchPriceHistory } from "@/lib/api";
import { getBaseUrl } from "@/lib/baseUrl";

// Dynamic import — Chart.js uses window internally, must be client-only
const PriceChart = dynamic(() => import("@/components/PriceChart"), {
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 h-64 flex items-center justify-center">
      <p className="text-sm text-slate-400">Loading chart...</p>
    </div>
  ),
});

// ── Page component ────────────────────────────────────────────────────────────

export default function CoinDetailPage({
  coin,
  history,
  currentPrice,
  baseUrl,
}) {
  const priceChange = coin.market_data.price_change_percentage_24h ?? 0;
  const isUp        = priceChange >= 0;
  const coinUrl     = `${baseUrl}/crypto/${coin.id}`;

  // JSON-LD — FinancialProduct schema
  const jsonLd = {
    "@context":  "https://schema.org",
    "@type":     "FinancialProduct",
    name:         coin.name,
    description:  coin.description?.en
      ? coin.description.en.replace(/<[^>]*>/g, "").split(".")[0] + "."
      : `${coin.name} live price and portfolio simulator.`,
    url:          coinUrl,
    image:        coin.image?.large,
    offers: {
      "@type":        "Offer",
      priceCurrency:  "USD",
      price:           currentPrice.toString(),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",    item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Markets", item: baseUrl },
        { "@type": "ListItem", position: 3, name: coin.name, item: coinUrl },
      ],
    },
  };

  return (
    <>
      <Head>
        {/* Primary SEO */}
        <title>
          {coin.name} ({coin.symbol.toUpperCase()}) Price Today — CoinScope Pro
        </title>
        <meta
          name="description"
          content={`${coin.name} (${coin.symbol.toUpperCase()}) is trading at $${currentPrice.toLocaleString()} today. Track live price, market cap, volume and simulate your P&L on CoinScope Pro.`}
        />
        <link rel="canonical" href={coinUrl} />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content={`${coin.name} Price Today — CoinScope Pro`} />
        <meta property="og:description" content={`${coin.name} is trading at $${currentPrice.toLocaleString()}. Simulate your P&L on CoinScope Pro.`} />
        <meta property="og:image"       content={coin.image?.large} />
        <meta property="og:url"         content={coinUrl} />

        {/* Twitter */}
        <meta name="twitter:card"        content="summary" />
        <meta name="twitter:title"       content={`${coin.name} Price — CoinScope Pro`} />
        <meta name="twitter:description" content={`$${currentPrice.toLocaleString()} · ${isUp ? "+" : ""}${priceChange.toFixed(2)}% 24h`} />
        <meta name="twitter:image"       content={coin.image?.large} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-6"
          >
            <Link
              href="/"
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/"
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Markets
            </Link>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300">
              {coin.name}
            </span>
          </nav>

          {/* Coin header */}
          <div className="flex items-center gap-4 mb-8">
            {coin.image?.large && (
              <img
                src={coin.image.large}
                alt={`${coin.name} logo`}
                className="h-14 w-14 rounded-full"
              />
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {coin.name}
                </h1>
                <span className="text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg">
                  {coin.symbol.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-semibold text-slate-900 dark:text-white">
                  ${currentPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isUp ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isUp ? "▲" : "▼"} {Math.abs(priceChange).toFixed(2)}% (24h)
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Market cap",
                value: "$" + (coin.market_data.market_cap.usd / 1e9).toFixed(2) + "B",
              },
              {
                label: "24h volume",
                value: "$" + (coin.market_data.total_volume.usd / 1e9).toFixed(2) + "B",
              },
              {
                label: "Circulating supply",
                value: (coin.market_data.circulating_supply / 1e6).toFixed(2) + "M",
              },
              {
                label: "All-time high",
                value: "$" + coin.market_data.ath.usd.toLocaleString(),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
              >
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">
                  {label}
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Two-column layout — chart + simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PriceChart history={history} coinName={coin.name} />
            <PLSimulator coin={coin} currentPrice={currentPrice} />
          </div>

          {/* Description */}
          {coin.description?.en && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
                About {coin.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
                {coin.description.en.replace(/<[^>]*>/g, "")}
              </p>
            </div>
          )}

        </div>
      </main>
    </>
  );
}

// SSR — fetches coin data + price history server-side
export async function getServerSideProps({ params }) {
  const [coin, history] = await Promise.all([
    fetchCoinDetail(params.id),
    fetchPriceHistory(params.id),
  ]);

  // Coin not found — 404
  if (!coin || !coin.id) {
    return { notFound: true };
  }

  const currentPrice = coin.market_data?.current_price?.usd ?? 0;
  const baseUrl      = getBaseUrl(); // ✅ dynamic base URL

  return {
    props: {
      coin,
      history,
      currentPrice,
      baseUrl,
    },
  };
}