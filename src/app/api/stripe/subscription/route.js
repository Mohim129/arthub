import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { tier } = await req.json();

    if (!tier) {
      return NextResponse.json(
        { error: "Subscription tier is required" },
        { status: 400 }
      );
    }

    // Forward to backend API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/stripe/create-subscription-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.user.id}`,
        "x-user-id": session.user.id
      },
      body: JSON.stringify({ tier })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Subscription session error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create subscription session" },
      { status: err.statusCode || 500 }
    );
  }
}
