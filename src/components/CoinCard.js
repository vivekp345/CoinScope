import Link from 'next/link';

export default function CoinCard({ coin }) {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <Link href={`/crypto/${coin.id}`} className="block group">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
        
        {/* Header: Icon & Name */}
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={coin.image} 
            alt={coin.name} 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {coin.name}
            </h3>
            <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">
              {coin.symbol}
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-2">
          <p className="text-3xl font-extrabold text-slate-900">
            {/* FORCE 'en-US' to fix Hydration Error in India */}
            ${coin.current_price.toLocaleString('en-US')}
          </p>
          
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
            </span>
            <span className="text-slate-400 text-xs font-medium">
              (24h)
            </span>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-slate-50">
          <span className="text-blue-600 text-sm font-bold group-hover:underline">
            View Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}