// src/lib/dbConnect.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// ✅ Don't throw at module level — throw only when actually connecting
// Throwing at module level crashes Vercel build
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // ✅ Throw here instead — only when a DB call is actually made
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined — add it to Vercel environment variables"
    );
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default dbConnect;