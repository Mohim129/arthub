import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // Forward to backend API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    const response = await fetch(`${baseUrl}/api/artists/${id}/sales`, {
      method: "GET"
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Sales history fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch sales history" },
      { status: err.statusCode || 500 }
    );
  }
}
