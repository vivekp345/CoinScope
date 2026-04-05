// src/pages/api/trades/[id].js
import dbConnect from "@/lib/dbConnect";
import Trade from "@/models/Trade";
import { getServerSession } from "@/lib/getServerSession";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized — please sign in" });
  }

  const { id } = req.query;

  try {
    await dbConnect();

    // Find trade and make sure it belongs to this user
    const trade = await Trade.findOne({ _id: id, userId: session.user.id });

    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    await trade.deleteOne();

    return res.status(200).json({ message: "Trade deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/trades/[id] error:", err);
    return res.status(500).json({ error: "Failed to delete trade" });
  }
}