import { MongoClient, ObjectId } from "mongodb";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { resolveArtworkDescription } from "@/lib/artwork-description";

const client = new MongoClient(process.env.MONGO_DB_URI);
let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  cachedClient = await client.connect();
  return cachedClient;
}

export async function GET(request, { params }) {
  try {
    const awaitedParams = await params;
    const { id } = awaitedParams;
    const mongoClient = await getClient();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "arthub_db");
    const collection = db.collection("artworks");

    const artwork = await collection.findOne({ _id: new ObjectId(id) });
    if (!artwork) {
      return new Response(JSON.stringify({ error: "Artwork not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ ...artwork, id: artwork._id.toString() }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to fetch artwork:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch artwork" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const awaitedParams = await params;
    const { id } = awaitedParams;
    const updatedData = await request.json();

    // Remove MongoDB _id and id fields if they exist in body to prevent updating the immutable _id field
    delete updatedData._id;
    delete updatedData.id;

    if ("description" in updatedData) {
      updatedData.description = resolveArtworkDescription(updatedData);
    }

    const mongoClient = await getClient();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "arthub_db");
    const collection = db.collection("artworks");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Artwork not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ id, ...updatedData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update artwork:", error);
    return new Response(JSON.stringify({ error: "Failed to update artwork" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const awaitedParams = await params;
    const { id } = awaitedParams;

    // 1. Verify session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Access denied. Login required." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const mongoClient = await getClient();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "arthub_db");
    const collection = db.collection("artworks");

    // 2. Fetch the artwork to verify ownership
    const artwork = await collection.findOne({ _id: new ObjectId(id) });
    if (!artwork) {
      return new Response(JSON.stringify({ error: "Artwork not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Admin can delete any artwork, artist can only delete their own artwork
    if (session.user.role !== "admin" && artwork.artistId !== session.user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized operation." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Artwork not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Artwork deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to delete artwork:", error);
    return new Response(JSON.stringify({ error: "Failed to delete artwork" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
