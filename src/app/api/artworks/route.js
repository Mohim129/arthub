import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  cachedClient = await client.connect();
  return cachedClient;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const artistId = searchParams.get("artistId");
    const status = searchParams.get("status") || "active";

    const mongoClient = await getClient();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "arthub_db");
    const collection = db.collection("artworks");

    const query = {};
    if (artistId) query.artistId = artistId;
    if (status) query.status = status;

    const artworks = await collection.find(query).toArray();
    
    // Transform MongoDB documents to include id field
    const transformedArtworks = artworks.map((artwork) => ({
      ...artwork,
      id: artwork._id.toString(),
    }));

    return new Response(JSON.stringify(transformedArtworks), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to fetch artworks:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch artworks." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function POST(request) {
  try {
    const artwork = await request.json();
    const mongoClient = await getClient();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "arthub_db");
    const collection = db.collection("artworks");
    const result = await collection.insertOne({
      ...artwork,
      createdAt: new Date(),
    });

    const savedArtwork = {
      ...artwork,
      id: result.insertedId.toString(),
    };

    return new Response(JSON.stringify(savedArtwork), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to save artwork:", error);
    return new Response(
      JSON.stringify({ error: "Failed to save artwork." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
