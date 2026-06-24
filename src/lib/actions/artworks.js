"use server";

import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const client = new MongoClient(process.env.MONGO_DB_URI);
let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  cachedClient = await client.connect();
  return cachedClient;
}

export const addArtwork = async (newArtworkData) => {
  // 1. Verify session (throws if not logged in)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("You must be logged in to add artworks.");
  }

  // 2. Connect to MongoDB
  const mongoClient = await getClient();
  const db = mongoClient.db(process.env.AUTH_DB_NAME || "arthub_db");
  const collection = db.collection("artworks");

  // 3. Build the artwork document
  const artwork = {
    title: newArtworkData.title,
    category: newArtworkData.category || "Generative Art",
    description: newArtworkData.description || "",
    price: newArtworkData.price, // number from the form
    image: newArtworkData.image || "",
    artistId: session.user.id, // string version of MongoDB _id
    status: "active",
    createdAt: new Date(),
  };

  const result = await collection.insertOne(artwork);

  // 4. Return a plain, serializable object
  return {
    id: result.insertedId.toString(), // convert ObjectId → string
    title: artwork.title,
    category: artwork.category,
    description: artwork.description,
    price: artwork.price,
    image: artwork.image,
    artistId: artwork.artistId,
    status: artwork.status,
    createdAt: artwork.createdAt.toISOString(), // Date → string
  };
};
