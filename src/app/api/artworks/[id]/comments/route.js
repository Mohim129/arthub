import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // Forward to backend API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/artworks/${id}/comments`, {
      method: "GET"
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Comments fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch comments" },
      { status: err.statusCode || 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 }
      );
    }

    // Forward to backend API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/artworks/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.user.id}`,
        "x-user-id": session.user.id
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Comment post error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to post comment" },
      { status: err.statusCode || 500 }
    );
  }
}
