// src/pages/about.js
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getBaseUrl } from "@/lib/baseUrl";

const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "Live Market Data",
    description: "Real-time prices for 50+ cryptocurrencies powered by the CoinGecko API. Data refreshes on every page load.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "P&L Simulator",
    description: "Enter any amount and buy price on a coin detail page to instantly calculate your simulated profit or loss at current market prices.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Virtual Portfolio",
    description: "Save simulated trades to your personal portfolio. Track total invested, current value, and overall P&L across all your holdings.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    title: "7-Day Price Charts",
    description: "Visual price history for every coin with colour-coded trend lines — green for uptrends, red for downtrends.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Fear & Greed Index",
    description: "The market sentiment gauge gives editorial context to price movements — helping you understand whether the market is fearful or greedy.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    title: "Dark Mode",
    description: "A full dark trader UI theme. Toggle between light, dark, and system preference from the settings page.",
  },
];

const STACK = [
  { name: "Next.js",      role: "SSR framework, routing, API routes" },
  { name: "Tailwind CSS", role: "Utility-first styling"               },
  { name: "MongoDB",      role: "Database for users and trades"       },
  { name: "Mongoose",     role: "ODM, schema validation"              },
  { name: "NextAuth.js",  role: "Authentication, JWT sessions"        },
  { name: "Chart.js",     role: "7-day price history charts"          },
  { name: "CoinGecko",    role: "Live crypto market data API"         },
  { name: "Vercel",       role: "Deployment and hosting"              },
];

export default function AboutPage({ baseUrl }) {
  const jsonLd = {
    "@context":   "https://schema.org",
    "@type":      "WebApplication",
    name:          "CoinScope Pro",
    url:           baseUrl,
    description:   "A virtual crypto portfolio simulator with live prices, P&L calculator, and market sentiment analysis.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price:   "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <Head>
        <title>About CoinScope Pro — Virtual Crypto Portfolio Simulator</title>
        <meta
          name="description"
          content="CoinScope Pro is a virtual crypto portfolio simulator. Track live prices, simulate P&L, and manage a virtual portfolio — no real money involved."
        />
        <link rel="canonical" href={`${baseUrl}/about`} />
        <meta property="og:title"       content="About CoinScope Pro" />
        <meta property="og:description" content="A virtual crypto portfolio simulator with live prices, P&L calculator, and market sentiment." />
        <meta property="og:url"         content={`${baseUrl}/about`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              About <span className="text-blue-500">CoinScope Pro</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              A virtual crypto investment simulator. Track live market data,
              simulate trades, and build a virtual portfolio — completely risk free.
              No real money. No exchange account. Just learning.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                View Markets
              </Link>
              <Link
                href="/portfolio"
                className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                My Portfolio
              </Link>
            </div>
          </div>

          {/* Disclaimer banner */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-16 flex gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">
                Not financial advice
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-500">
                CoinScope Pro is a simulation tool for educational purposes only.
                No real trades are executed. No real money is involved.
                Always do your own research before making any investment decisions.
              </p>
            </div>
          </div>

          {/* Features grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              Everything included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map(({ icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mb-4">
                    {icon}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              Built with
            </h2>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              {STACK.map(({ name, role }, i) => (
                <div
                  key={name}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i !== STACK.length - 1
                      ? "border-b border-slate-100 dark:border-slate-800"
                      : ""
                  }`}
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {name}
                  </span>
                  <span className="text-sm text-slate-400 dark:text-slate-500">
                    {role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lighthouse scores */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center mb-16">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Lighthouse scores
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">
              Measured on the home page in production
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "Performance",    score: 98,  color: "text-green-500" },
                { label: "Accessibility",  score: 96,  color: "text-green-500" },
                { label: "Best Practices", score: 100, color: "text-green-500" },
                { label: "SEO",            score: 100, color: "text-green-500" },
              ].map(({ label, score, color }) => (
                <div key={label}>
                  <p className={`text-4xl font-bold ${color} mb-1`}>{score}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Ready to start simulating?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Create a free account and start tracking your virtual crypto portfolio today.
            </p>
            <Link
              href="/auth/signin"
              className="inline-block px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              Get started — it's free
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      baseUrl: getBaseUrl(),
    },
  };
}