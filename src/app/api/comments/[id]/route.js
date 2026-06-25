import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function PUT(req, { params }) {
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

    // Forward to backend API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    const response = await fetch(`${baseUrl}/api/comments/${id}`, {
      method: "PUT",
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
    console.error("Comment update error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update comment" },
      { status: err.statusCode || 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Forward to backend API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    const response = await fetch(`${baseUrl}/api/comments/${id}`, {
      method: "DELETE",
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
    console.error("Comment delete error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete comment" },
      { status: err.statusCode || 500 }
    );
  }
}
