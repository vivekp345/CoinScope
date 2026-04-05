// src/pages/api/trades/index.js
import dbConnect from "@/lib/dbConnect";
import Trade from "@/models/Trade";
import { getServerSession } from "@/lib/getServerSession";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized — please sign in" });
  }

  await dbConnect();

  // ── GET — fetch all trades for this user ──────────────────────────────────
  if (req.method === "GET") {
    try {
      const trades = await Trade.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({ trades });
    } catch (err) {
      console.error("GET /api/trades error:", err);
      return res.status(500).json({ error: "Failed to fetch trades" });
    }
  }

  // ── POST — create a new trade ─────────────────────────────────────────────
  if (req.method === "POST") {
    const { coinId, coinName, coinSymbol, quantity, buyPrice } = req.body;

    if (!coinId || !coinName || !coinSymbol || !quantity || !buyPrice) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (quantity <= 0 || buyPrice <= 0) {
      return res.status(400).json({ error: "Quantity and buy price must be greater than 0" });
    }

    try {
      const trade = await Trade.create({
        userId:     session.user.id,
        coinId,
        coinName,
        coinSymbol,
        quantity:   parseFloat(quantity),
        buyPrice:   parseFloat(buyPrice),
        invested:   parseFloat(quantity) * parseFloat(buyPrice),
      });

      return res.status(201).json({ trade });
    } catch (err) {
      console.error("POST /api/trades error:", err);

      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: messages[0] });
      }

      return res.status(500).json({ error: "Failed to create trade" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}