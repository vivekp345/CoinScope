// src/pages/api/auth/register.js

// ✅ Force Node.js runtime — bcrypt and mongoose need it
export const runtime = "nodejs";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  // ── Basic validation ────────────────────────────────────────────────────────
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Name, email and password are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters",
    });
  }

  // ── DB + user creation ──────────────────────────────────────────────────────
  try {
    await dbConnect();

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    // Create user — password hashed automatically via pre("save") hook
    const user = await User.create({ name, email, password });

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id:    user._id.toString(),
        name:  user.name,
        email: user.email,
      },
    });

  } catch (err) {
    // ✅ Print exact error in terminal — check here first
    console.error("=== REGISTER ERROR ===", err);

    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages[0] });
    }

    // Duplicate key error (race condition on unique email)
    if (err.code === 11000) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    // ✅ Show real error in dev, generic message in prod
    return res.status(500).json({
      error: process.env.NODE_ENV === "development"
        ? `Server error: ${err.message}`
        : "Something went wrong. Please try again.",
    });
  }
}