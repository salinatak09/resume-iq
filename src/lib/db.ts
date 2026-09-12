import { Db, MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

if (!DB_NAME) {
  throw new Error("DB_NAME is not defined");
}

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

// In development mode, use cached global variable to avoid creating multiple connections to the database
if (process.env.NODE_ENV === "development") {
  // If the cached connection is not available, create a new MongoClient and connect to the database
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }

  // Use the cached connection for subsequent requests
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDB(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(DB_NAME);
}
