import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Forward to backend API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/artists/top`, {
      method: "GET"
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Top artists fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch top artists" },
      { status: err.statusCode || 500 }
    );
  }
}
