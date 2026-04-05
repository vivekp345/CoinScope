// src/lib/mongodb.js
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development, cache the client on global to survive hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a fresh client
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export default clientPromise;