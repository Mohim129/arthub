import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const nextHeaders = await headers();
    const session = await auth.api.getSession({ headers: nextHeaders });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role || "user",
    };

    const secret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
