// src/lib/mongodb.js
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

let client;
let clientPromise;

// ✅ Don't throw at module level — check lazily
if (!MONGODB_URI) {
  // In production this will be caught when clientPromise is awaited
  console.warn("MONGODB_URI is not defined — check environment variables");
  clientPromise = Promise.reject(
    new Error("MONGODB_URI is not defined")
  );
} else if (process.env.NODE_ENV === "development") {
  // Cache client in dev to survive hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production — fresh client
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;