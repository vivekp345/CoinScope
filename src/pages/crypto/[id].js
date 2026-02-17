import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getCoinData } from '../../lib/api';

export default function CoinDetail({ coin }) {
  // 1. Safety Check: If the coin doesn't exist
  if (!coin) {
    return (
      <Layout title="Coin Not Found | CoinScope">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Coin Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; Return to Market
          </Link>
        </div>
      </Layout>
    );
  }

  // 2. DYNAMIC SEO METADATA (with safety checks)
  const coinPrice = coin.market_data?.current_price?.usd?.toLocaleString() || '0.00';
  const marketCap = coin.market_data?.market_cap?.usd?.toLocaleString() || '0.00';
  
  const seoTitle = `${coin.name} (${coin.symbol?.toUpperCase()}) Price Today | CoinScope`;
  const seoDescription = `Live ${coin.name} price is $${coinPrice}. Market cap: $${marketCap}. Get real-time charts and data.`;

  // 3. STRUCTURED DATA (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": coin.name,
    "image": coin.image?.large,
    "description": seoDescription,
    "brand": "CoinScope",
    "offers": {
      "@type": "Offer",
      "url": `https://coin-scope-chi.vercel.app/crypto/${coin.id}`,
      "priceCurrency": "USD",
      "price": coin.market_data?.current_price?.usd || 0,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <Layout title={seoTitle} description={seoDescription}>
      <Head>
        {/* Structured Data injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* OpenGraph Tags */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {coin.image?.large && (
          <meta property="og:image" content={coin.image.large} />
        )}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://coin-scope-chi.vercel.app/crypto/${coin.id}`} />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={coin.image?.large} />
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
          {coin.image?.large && (
            <img src={coin.image.large} alt={coin.name} className="w-24 h-24" />
          )}
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
              {coin.name} <span className="text-slate-400 text-2xl font-normal">({coin.symbol?.toUpperCase()})</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
              <span className="text-5xl font-bold text-slate-900">
                ${coinPrice}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${ (coin.market_data?.price_change_percentage_24h || 0) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {coin.market_data?.price_change_percentage_24h?.toFixed(2) || '0.00'}% (24h)
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Market Cap" value={`$${marketCap}`} />
          <StatCard label="24h High" value={`$${coin.market_data?.high_24h?.usd?.toLocaleString() || '0.00'}`} />
          <StatCard label="24h Low" value={`$${coin.market_data?.low_24h?.usd?.toLocaleString() || '0.00'}`} />
          <StatCard label="Circulating Supply" value={coin.market_data?.circulating_supply?.toLocaleString() || '0'} />
        </div>

        {/* Description Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">About {coin.name}</h2>
          <div 
            className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: coin.description?.en || `<p>No description available for ${coin.name}.</p>` }}
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
  const { id } = context.params; 
  const coin = await getCoinData(id);

  if (!coin) {
    return { notFound: true };
  }

  return {
    props: { coin },
  };
}