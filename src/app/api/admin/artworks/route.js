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

export async function GET(request) {
  try {
    // 1. Verify session & admin role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Access denied. Admin role required." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Fetch artworks with joined artist name
    const mongoClient = await getClient();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "arthub_db");
    const collection = db.collection("artworks");

    const pipeline = [
      {
        $addFields: {
          artistObjectId: {
            $convert: {
              input: "$artistId",
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "artistObjectId",
          foreignField: "_id",
          as: "artist",
        },
      },
      { $unwind: { path: "$artist", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          title: 1,
          price: 1,
          artistName: "$artist.name",
        },
      },
    ];

    const artworks = await collection.aggregate(pipeline).toArray();

    // Map _id to id
    const transformedArtworks = artworks.map((art) => ({
      id: art._id.toString(),
      title: art.title,
      price: art.price,
      artistName: art.artistName || "Unknown Artist",
    }));

    return new Response(JSON.stringify(transformedArtworks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch artworks for admin:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch artworks" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
