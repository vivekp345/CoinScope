// src/scripts/seedDemo.js
// Run with: node src/scripts/seedDemo.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// ── Schemas (inline so we don't need path aliases) ────────────────────────────

const UserSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

const TradeSchema = new mongoose.Schema(
  {
    userId:     { type: String, required: true },
    coinId:     { type: String, required: true },
    coinName:   { type: String, required: true },
    coinSymbol: { type: String, required: true },
    quantity:   { type: Number, required: true },
    buyPrice:   { type: Number, required: true },
    invested:   { type: Number, required: true },
    note:       { type: String, default: "" },
  },
  { timestamps: true }
);

// ── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_USER = {
  name:     "Vivek Palakodeti",
  email:    "demo@coinscope.pro",
  password: "Demo@1234",
};

// Realistic trades — bought at different historical prices
// Current prices (approx) vs buy prices shows nice P&L
const DEMO_TRADES = [
  {
    coinId:     "bitcoin",
    coinName:   "Bitcoin",
    coinSymbol: "BTC",
    quantity:   0.05,
    buyPrice:   42000,    // bought when BTC was 42k
    invested:   2100,
  },
  {
    coinId:     "bitcoin",
    coinName:   "Bitcoin",
    coinSymbol: "BTC",
    quantity:   0.03,
    buyPrice:   38000,    // second BTC buy at dip
    invested:   1140,
  },
  {
    coinId:     "ethereum",
    coinName:   "Ethereum",
    coinSymbol: "ETH",
    quantity:   0.8,
    buyPrice:   2200,     // bought ETH at 2.2k
    invested:   1760,
  },
  {
    coinId:     "ethereum",
    coinName:   "Ethereum",
    coinSymbol: "ETH",
    quantity:   0.5,
    buyPrice:   2600,
    invested:   1300,
  },
  {
    coinId:     "solana",
    coinName:   "Solana",
    coinSymbol: "SOL",
    quantity:   12,
    buyPrice:   95,       // SOL bought at 95
    invested:   1140,
  },
  {
    coinId:     "solana",
    coinName:   "Solana",
    coinSymbol: "SOL",
    quantity:   8,
    buyPrice:   110,
    invested:   880,
  },
  {
    coinId:     "cardano",
    coinName:   "Cardano",
    coinSymbol: "ADA",
    quantity:   2000,
    buyPrice:   0.45,
    invested:   900,
  },
  {
    coinId:     "polkadot",
    coinName:   "Polkadot",
    coinSymbol: "DOT",
    quantity:   150,
    buyPrice:   6.5,
    invested:   975,
  },
  {
    coinId:     "chainlink",
    coinName:   "Chainlink",
    coinSymbol: "LINK",
    quantity:   80,
    buyPrice:   12,
    invested:   960,
  },
  {
    coinId:     "avalanche-2",
    coinName:   "Avalanche",
    coinSymbol: "AVAX",
    quantity:   25,
    buyPrice:   28,
    invested:   700,
  },
];

// ── Seed function ─────────────────────────────────────────────────────────────

async function seed() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to:", MONGODB_URI.split("/").pop().split("?")[0]);

  const User  = mongoose.models.User  || mongoose.model("User",  UserSchema);
  const Trade = mongoose.models.Trade || mongoose.model("Trade", TradeSchema);

  // ── Create or find demo user ──────────────────────────────────────────────
  let user = await User.findOne({ email: DEMO_USER.email });

  if (user) {
    console.log("👤 Demo user already exists — skipping creation");
  } else {
    const hashedPassword = await bcrypt.hash(DEMO_USER.password, 12);
    user = await User.create({
      name:     DEMO_USER.name,
      email:    DEMO_USER.email,
      password: hashedPassword,
    });
    console.log("✅ Demo user created:", DEMO_USER.email);
  }

  // ── Clear existing demo trades ────────────────────────────────────────────
  const deleted = await Trade.deleteMany({ userId: user._id.toString() });
  console.log(`🗑  Cleared ${deleted.deletedCount} existing trades`);

  // ── Insert demo trades with staggered dates ───────────────────────────────
  const trades = DEMO_TRADES.map((trade, i) => ({
    ...trade,
    userId: user._id.toString(),
    // Spread trades over the last 90 days
    createdAt: new Date(Date.now() - (90 - i * 8) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - (90 - i * 8) * 24 * 60 * 60 * 1000),
  }));

  await Trade.insertMany(trades);
  console.log(`✅ Inserted ${trades.length} demo trades`);

  // ── Summary ───────────────────────────────────────────────────────────────
  const totalInvested = trades.reduce((s, t) => s + t.invested, 0);
  console.log("\n📊 Demo Portfolio Summary:");
  console.log(`   Email:          ${DEMO_USER.email}`);
  console.log(`   Password:       ${DEMO_USER.password}`);
  console.log(`   Total trades:   ${trades.length}`);
  console.log(`   Total invested: $${totalInvested.toLocaleString()}`);
  console.log(`   Coins:          BTC, ETH, SOL, ADA, DOT, LINK, AVAX`);
  console.log("\n🎉 Done! Sign in with the demo account to see the data.");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});