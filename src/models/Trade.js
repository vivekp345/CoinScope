// src/models/Trade.js
import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema(
  {
    // Links the trade to a NextAuth user by their JWT sub (user ID)
    userId: {
      type: String,
      required: [true, "userId is required"],
      index: true,
    },

    // CoinGecko coin ID e.g. "bitcoin", "ethereum"
    coinId: {
      type: String,
      required: [true, "coinId is required"],
      lowercase: true,
      trim: true,
    },

    // Human-readable name e.g. "Bitcoin"
    coinName: {
      type: String,
      required: [true, "coinName is required"],
      trim: true,
    },

    // Coin symbol e.g. "BTC"
    coinSymbol: {
      type: String,
      required: [true, "coinSymbol is required"],
      uppercase: true,
      trim: true,
    },

    // Number of coins the user "bought"
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
      min: [0.000001, "quantity must be greater than 0"],
    },

    // Price per coin at time of simulated buy (USD)
    buyPrice: {
      type: Number,
      required: [true, "buyPrice is required"],
      min: [0, "buyPrice must be positive"],
    },

    // Total USD invested (quantity × buyPrice — stored for convenience)
    invested: {
      type: Number,
      required: [true, "invested is required"],
      min: [0, "invested must be positive"],
    },

    // Optional note the user can attach to the trade
    note: {
      type: String,
      trim: true,
      maxlength: [280, "note cannot exceed 280 characters"],
      default: "",
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Compound index for fast per-user + per-coin lookups
TradeSchema.index({ userId: 1, coinId: 1 });

// Prevent model recompilation during hot reload
export default mongoose.models.Trade || mongoose.model("Trade", TradeSchema);