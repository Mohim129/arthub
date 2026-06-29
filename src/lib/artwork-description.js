import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  cachedClient = await client.connect();
  return cachedClient;
}

export function resolveArtworkDescription(artwork) {
  const trimmed = artwork?.description?.trim();
  if (trimmed) return trimmed;

  const title = artwork?.title?.trim();
  if (title) return `${title} – original digital artwork`;

  return "Original digital artwork";
}

export async function ensureArtworkHasDescription(artworkId) {
  const mongoClient = await getClient();
  const db = mongoClient.db(process.env.AUTH_DB_NAME || "arthub_db");
  const collection = db.collection("artworks");

  const artwork = await collection.findOne({ _id: new ObjectId(artworkId) });
  if (!artwork) return null;

  if (artwork.description?.trim()) return artwork.description.trim();

  const description = resolveArtworkDescription(artwork);
  await collection.updateOne(
    { _id: new ObjectId(artworkId) },
    { $set: { description } },
  );

  return description;
}
