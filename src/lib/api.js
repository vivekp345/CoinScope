// src/lib/api.js

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function safeFetch(url, fallback) {
  try {
    const res = await fetch(url, {
      // Uncomment if you have a CoinGecko API key:
      // headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY },
    });
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("CoinGecko fetch failed, using fallback:", err.message);
    return fallback;
  }
}

// ── Coin list (home page) ─────────────────────────────────────────────────────

export async function fetchCoins(page = 1, perPage = 50) {
  const url =
    `${COINGECKO_BASE}/coins/markets` +
    `?vs_currency=usd` +
    `&order=market_cap_desc` +
    `&per_page=${perPage}` +
    `&page=${page}` +
    `&sparkline=false`;

  return safeFetch(url, MOCK_COINS);
}

// ── Coin detail ───────────────────────────────────────────────────────────────

export async function fetchCoinDetail(id) {
  const url =
    `${COINGECKO_BASE}/coins/${id}` +
    `?localization=false` +
    `&tickers=false` +
    `&community_data=false` +
    `&developer_data=false`;

  return safeFetch(url, MOCK_COIN_DETAIL);
}

// ── 7-day price history ───────────────────────────────────────────────────────

export async function fetchPriceHistory(id) {
  const url =
    `${COINGECKO_BASE}/coins/${id}/market_chart` +
    `?vs_currency=usd` +
    `&days=7` +
    `&interval=daily`;

  const data = await safeFetch(url, { prices: MOCK_PRICE_HISTORY });

  return (data.prices ?? []).map(([ts, price]) => ({
    date:  new Date(ts).toLocaleDateString("en-US", {
      weekday: "short",
      month:   "short",
      day:     "numeric",
    }),
    price: Math.round(price * 100) / 100,
  }));
}

// ── Current prices (portfolio) ────────────────────────────────────────────────

export async function fetchCurrentPrices(coinIds = []) {
  if (!coinIds.length) return {};

  const url =
    `${COINGECKO_BASE}/simple/price` +
    `?ids=${coinIds.join(",")}` +
    `&vs_currencies=usd`;

  const data = await safeFetch(url, {});

  return Object.fromEntries(
    Object.entries(data).map(([id, val]) => [id, val?.usd ?? 0])
  );
}

// ── Fear & Greed sentiment ────────────────────────────────────────────────────

export async function fetchSentiment() {
  // Free public API — no key required
  // Docs: https://alternative.me/crypto/fear-and-greed-index/
  const data = await safeFetch(
    "https://api.alternative.me/fng/?limit=1",
    { data: [{ value: "50", value_classification: "Neutral", timestamp: "" }] }
  );

  const entry = data?.data?.[0];

  return {
    value:     parseInt(entry?.value ?? "50", 10),
    label:     entry?.value_classification ?? "Neutral",
    updatedAt: entry?.timestamp
      ? new Date(parseInt(entry.timestamp, 10) * 1000).toLocaleDateString(
          "en-US",
          { day: "numeric", month: "short", year: "numeric" }
        )
      : null,
  };
}

// ── Mock data fallbacks ───────────────────────────────────────────────────────

export const MOCK_COINS = [
  {
    id:                               "bitcoin",
    symbol:                           "btc",
    name:                             "Bitcoin",
    image:                            "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price:                    65000,
    market_cap:                       1270000000000,
    market_cap_rank:                  1,
    total_volume:                     28000000000,
    price_change_percentage_24h:      2.4,
    circulating_supply:               19700000,
  },
  {
    id:                               "ethereum",
    symbol:                           "eth",
    name:                             "Ethereum",
    image:                            "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price:                    3200,
    market_cap:                       385000000000,
    market_cap_rank:                  2,
    total_volume:                     14000000000,
    price_change_percentage_24h:      -1.2,
    circulating_supply:               120000000,
  },
  {
    id:                               "solana",
    symbol:                           "sol",
    name:                             "Solana",
    image:                            "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price:                    145,
    market_cap:                       63000000000,
    market_cap_rank:                  5,
    total_volume:                     3200000000,
    price_change_percentage_24h:      3.8,
    circulating_supply:               435000000,
  },
];

export const MOCK_COIN_DETAIL = {
  id:     "bitcoin",
  symbol: "btc",
  name:   "Bitcoin",
  image:  { large: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  market_data: {
    current_price:                { usd: 65000 },
    market_cap:                   { usd: 1270000000000 },
    total_volume:                  { usd: 28000000000 },
    price_change_percentage_24h:  2.4,
    circulating_supply:           19700000,
    ath:                          { usd: 73738 },
  },
  description: {
    en: "Bitcoin is the first decentralized cryptocurrency, originally described by Satoshi Nakamoto in a 2008 whitepaper.",
  },
};

export const MOCK_PRICE_HISTORY = Array.from({ length: 8 }, (_, i) => [
  Date.now() - (7 - i) * 86400000,
  63000 + Math.random() * 4000,
]);