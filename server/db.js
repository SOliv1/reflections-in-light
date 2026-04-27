import { MongoClient } from "mongodb";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || "Sandbox";

let client = null;
let db = null;
let connectionState = "idle";
let connectionError = null;
let connectPromise = null;

export async function connectToDb() {
  if (db) {
    return db;
  }

  if (!mongoUri) {
    connectionState = "error";
    connectionError = "Missing MONGODB_URI or MONGO_URI";
    throw new Error(connectionError);
  }

  if (!connectPromise) {
    connectionState = "connecting";
    client = new MongoClient(mongoUri);
    connectPromise = client
      .connect()
      .then(() => {
        db = client.db(dbName);
        connectionState = "connected";
        connectionError = null;
        console.log(`Connected to MongoDB database: ${dbName}`);
        return db;
      })
      .catch((error) => {
        connectionState = "error";
        connectionError = error.message;
        connectPromise = null;
        throw error;
      });
  }

  return connectPromise;
}

export async function connectToMongo() {
  return connectToDb();
}

export function getDb() {
  if (!db) {
    throw new Error("Database not connected yet");
  }

  return db;
}

export function getDbStatus() {
  return {
    state: connectionState,
    error: connectionError,
    dbName,
  };
}

export default client;
