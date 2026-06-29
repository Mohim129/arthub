import { MongoClient, ObjectId } from "mongodb";
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

    // 2. Fetch users
    const mongoClient = await getClient();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "arthub_db");
    const collection = db.collection("user");

    const users = await collection
      .find(
        {
          // Hide the primary admin account from the table
          $nor: [{ email: "admin@arthub.com", role: "admin" }],
        },
        {
          projection: {
            name: 1,
            email: 1,
            role: 1,
            tier: 1,
          },
        }
      )
      .toArray();

    // Map _id to id
    const transformedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || "user",
      tier: user.tier || "free",
    }));

    return new Response(JSON.stringify(transformedUsers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch users for admin:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch users" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PATCH(request) {
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

    // 2. Parse request body
    const { id, role } = await request.json();

    if (!id || !role) {
      return new Response(JSON.stringify({ error: "User ID and role are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate role value
    const validRoles = ["user", "artist", "admin"];
    if (!validRoles.includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role value." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Update role in MongoDB
    const mongoClient = await getClient();
    const db = mongoClient.db(process.env.AUTH_DB_NAME || "arthub_db");
    const collection = db.collection("user");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, message: "User role updated successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update user role:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update user role" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
