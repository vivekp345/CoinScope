import { useState } from 'react';
import Layout from '../components/Layout'; // <--- This brings back the Home/About buttons!
import CoinCard from '../components/CoinCard'; // <--- Uses the reusable card
import { getTopCoins } from '../lib/api'; // <--- Uses the crash-proof API

export default function Home({ coins }) {
  // 1. YOUR SEARCH LOGIC
  const [search, setSearch] = useState('');

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Real-Time Cryptocurrency <span className="text-blue-600">Insights</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
          Track live prices, market trends, and detailed analytics for top cryptocurrencies.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative px-4 sm:px-0">
          <input 
            type="text"
            placeholder="Search cryptocurrency..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Search Icon */}
          <div className="absolute left-7 sm:left-4 top-3.5 text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Crypto Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin) => (
              // We use the reusable CoinCard component here
              <CoinCard key={coin.id} coin={coin} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-gray-400 font-medium">No coins found matching "{search}"</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

// SERVER-SIDE RENDERING (SSR)
export async function getServerSideProps() {
  // We use our helper function which handles 429 Errors automatically
  const coins = await getTopCoins();

  return {
    props: {
      coins,
    },
  };
}