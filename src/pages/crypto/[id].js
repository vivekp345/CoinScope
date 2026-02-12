import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getCoinData } from '../../lib/api';

export default function CoinDetail({ coin }) {
  // 1. Safety Check: If the coin doesn't exist, show a clean error state.
  if (!coin) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Coin Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; Return to Market
          </Link>
        </div>
      </Layout>
    );
  }

  // 2. DYNAMIC SEO METADATA
  // We build the title and description using the real data from the API.
  const seoTitle = `${coin.name} (${coin.symbol.toUpperCase()}) Price Today | CoinScope`;
  const seoDescription = `Live ${coin.name} price is $${coin.market_data.current_price.usd.toLocaleString()}. Market cap: $${coin.market_data.market_cap.usd.toLocaleString()}. Get real-time charts and data.`;

  // 3. STRUCTURED DATA (JSON-LD)
  // This is the "Secret Sauce" for Google. It helps generate Rich Snippets.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": coin.name,
    "image": coin.image.large,
    "description": seoDescription,
    "brand": "CoinScope",
    "offers": {
      "@type": "Offer",
      "url": `https://coinscope-demo.vercel.app/crypto/${coin.id}`,
      "priceCurrency": "USD",
      "price": coin.market_data.current_price.usd,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <Layout>
      {/* Dynamic Head Tags for SEO */}
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        
        {/* OpenGraph Tags for Social Media */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={coin.image.large} />
        <meta property="og:type" content="website" />
        
        {/* Inject JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link> 
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-semibold">{coin.name}</span>
        </nav>

        {/* Header Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8">
          <img src={coin.image.large} alt={coin.name} className="w-24 h-24" />
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
              {coin.name} <span className="text-slate-400 text-2xl font-normal">({coin.symbol.toUpperCase()})</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
              <span className="text-5xl font-bold text-slate-900">
                ${coin.market_data.current_price.usd.toLocaleString()}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${coin.market_data.price_change_percentage_24h >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {coin.market_data.price_change_percentage_24h.toFixed(2)}% (24h)
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Market Cap" value={`$${coin.market_data.market_cap.usd.toLocaleString()}`} />
          <StatCard label="24h High" value={`$${coin.market_data.high_24h.usd.toLocaleString()}`} />
          <StatCard label="24h Low" value={`$${coin.market_data.low_24h.usd.toLocaleString()}`} />
          <StatCard label="Circulating Supply" value={coin.market_data.circulating_supply.toLocaleString()} />
        </div>

        {/* Description Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">About {coin.name}</h2>
          <div 
            className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: coin.description.en || `<p>No description available for ${coin.name}.</p>` }}
          />
        </div>
      </div>
    </Layout>
  );
}

// Helper Component for Stats
function StatCard({ label, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
      <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-900 truncate">{value}</p>
    </div>
  );
}

// 4. SERVER-SIDE RENDERING (SSR)
export async function getServerSideProps(context) {
  const { id } = context.params; // Get the ID from the URL (e.g., 'bitcoin')
  
  const coin = await getCoinData(id);

  if (!coin) {
    return {
      notFound: true, // Returns a 404 page if coin doesn't exist
    };
  }

  return {
    props: {
      coin,
    },
  };
}