import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Forward to backend API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    const response = await fetch(`${baseUrl}/api/admin/transactions`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session.user.id}`,
        "x-user-id": session.user.id
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Transactions fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch transactions" },
      { status: err.statusCode || 500 }
    );
  }
}
