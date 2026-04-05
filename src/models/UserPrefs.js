// src/models/UserPrefs.js
import mongoose from "mongoose";

const UserPrefsSchema = new mongoose.Schema(
  {
    // NextAuth user ID — one prefs doc per user
    userId: {
      type: String,
      required: [true, "userId is required"],
      unique: true,
      index: true,
    },

    // "dark" | "light" | "system"
    theme: {
      type: String,
      enum: ["dark", "light", "system"],
      default: "system",
    },

    // Display currency for prices e.g. "usd", "eur", "inr"
    currency: {
      type: String,
      enum: ["usd", "eur", "inr", "gbp", "jpy"],
      default: "usd",
      lowercase: true,
    },

    // User's display name override (optional — NextAuth provides one too)
    displayName: {
      type: String,
      trim: true,
      maxlength: [50, "displayName cannot exceed 50 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.UserPrefs ||
  mongoose.model("UserPrefs", UserPrefsSchema);