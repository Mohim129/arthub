import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Forward to backend API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/stripe/session/${sessionId}`, {
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
    console.error("Session retrieval error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to retrieve session" },
      { status: err.statusCode || 500 }
    );
  }
}
