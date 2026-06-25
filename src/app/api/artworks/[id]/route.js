import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  cachedClient = await client.connect();
  return cachedClient;
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
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
    const { id } = params;
    const updatedData = await request.json();

    // Remove MongoDB _id and id fields if they exist in body to prevent updating the immutable _id field
    delete updatedData._id;
    delete updatedData.id;

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
    const { id } = params;

    const mongoClient = await getClient();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "arthub_db");
    const collection = db.collection("artworks");

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
