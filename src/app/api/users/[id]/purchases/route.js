import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const incomingHeaders = req.headers;
    const session = await auth.api.getSession({ headers: incomingHeaders });
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Forward to backend API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    const cookieHeader = incomingHeaders.get("cookie");
    const response = await fetch(`${baseUrl}/api/users/${id}/purchases`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Authorization": `Bearer ${session.user.id}`,
        "x-user-id": session.user.id,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Purchases backend error:", {
        id,
        status: response.status,
        body: data,
      });
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Purchases fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch purchases" },
      { status: err.statusCode || 500 }
    );
  }
}
