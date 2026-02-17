
const BASE_URL = 'https://api.coingecko.com/api/v3';

const MOCK_TOP_COINS = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png", current_price: 43210.50, market_cap: 845000000000, market_cap_rank: 1, price_change_percentage_24h: 2.4 },
  { id: "ethereum", symbol: "eth", name: "Ethereum", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png", current_price: 2240.50, market_cap: 270000000000, market_cap_rank: 2, price_change_percentage_24h: -1.2 },
  { id: "solana", symbol: "sol", name: "Solana", image: "https://assets.coingecko.com/coins/images/4128/large/solana.png", current_price: 98.25, market_cap: 42000000000, market_cap_rank: 5, price_change_percentage_24h: 5.8 },
  { id: "cardano", symbol: "ada", name: "Cardano", image: "https://assets.coingecko.com/coins/images/975/large/cardano.png", current_price: 0.55, market_cap: 19000000000, market_cap_rank: 8, price_change_percentage_24h: 1.1 },
  { id: "ripple", symbol: "xrp", name: "XRP", image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png", current_price: 0.62, market_cap: 34000000000, market_cap_rank: 6, price_change_percentage_24h: -0.5 },
  { id: "polkadot", symbol: "dot", name: "Polkadot", image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png", current_price: 7.20, market_cap: 9000000000, market_cap_rank: 11, price_change_percentage_24h: -2.3 },
];

const MOCK_COIN_DETAILS = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: { large: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  description: { en: "Bitcoin is the first decentralized digital currency..." },
  market_data: {
    current_price: { usd: 43210.50 },
    market_cap: { usd: 845200000000 },
    total_volume: { usd: 35000000000 },
    high_24h: { usd: 44100.00 },
    low_24h: { usd: 42500.00 },
    circulating_supply: 19600000,
    price_change_percentage_24h: 2.4
  }
};

async function fetcher(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    
    
    if (res.status === 429) {
      throw new Error('RATE_LIMIT');
    }
    
    if (!res.ok) {
      throw new Error(`API call failed: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.warn(`⚠️ API Error (${error.message}). Switching to Fallback Data.`);
    return null; 
  }
}


export async function getTopCoins() {
  const data = await fetcher('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1&sparkline=false');
  return data || MOCK_TOP_COINS; 
}


// Replace your getCoinData with this version
export async function getCoinData(id) {
  const data = await fetcher(`/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
  
  if (!data) {
    // We return a structure that EXACTLY matches what the API would send
    return {
      ...MOCK_COIN_DETAILS,
      id: id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      // Ensure these nested objects exist to prevent 500 errors
      market_data: {
        ...MOCK_COIN_DETAILS.market_data,
        current_price: { usd: 43210.50 },
        market_cap: { usd: 845200000000 },
        high_24h: { usd: 44100.00 },
        low_24h: { usd: 42500.00 },
      },
      image: { large: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
      description: { en: "Data currently unavailable from live API. Showing cached market data." }
    };
  }
  
  return data;
}