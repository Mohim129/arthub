import { NextResponse } from "next/server";
import { headers as nextHeaders } from "next/headers";
import { auth } from "@/lib/auth";
import { ensureArtworkHasDescription } from "@/lib/artwork-description";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await nextHeaders(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "user") {
      return NextResponse.json(
        { error: "Only collectors can purchase artwork" },
        { status: 403 },
      );
    }

    const { artworkId } = await req.json();

    if (!artworkId) {
      return NextResponse.json(
        { error: "Artwork ID is required" },
        { status: 400 },
      );
    }

    await ensureArtworkHasDescription(artworkId);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    const response = await fetch(
      `${baseUrl}/api/stripe/create-purchase-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.id}`,
          "x-user-id": session.user.id,
        },
        body: JSON.stringify({ artworkId }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Purchase session error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session" },
      { status: err.statusCode || 500 },
    );
  }
}
