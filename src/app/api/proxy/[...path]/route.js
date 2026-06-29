import { NextResponse } from "next/server";
import { headers as nextHeaders } from "next/headers";
import { auth } from "@/lib/auth";
import { ensureArtworkHasDescription } from "@/lib/artwork-description";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

async function proxyRequest(req, { params }) {
  try {
    const { path } = await params;
    const pathSegments = Array.isArray(path) ? path.join("/") : path;
    const backendPath = `/${pathSegments}`;
    const method = req.method;

    let bodyText = null;
    if (method !== "GET" && method !== "HEAD") {
      bodyText = await req.text();
    }

    if (
      method === "POST" &&
      pathSegments === "api/stripe/create-purchase-session"
    ) {
      const session = await auth.api.getSession({
        headers: await nextHeaders(),
      });
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (session.user.role !== "user") {
        return NextResponse.json(
          { error: "Only collectors can purchase artwork" },
          { status: 403 },
        );
      }

      if (bodyText) {
        try {
          const { artworkId } = JSON.parse(bodyText);
          if (artworkId) await ensureArtworkHasDescription(artworkId);
        } catch (parseErr) {
          console.error("Purchase session body parse error:", parseErr);
        }
      }
    }

    const url = new URL(req.url);
    const targetUrl = `${BACKEND_URL}${backendPath}${url.search}`;

    const cookieHeader = req.headers.get("cookie");

    const headers = {};
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const contentType = req.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    const fetchOptions = { method, headers };
    if (bodyText !== null) {
      fetchOptions.body = bodyText;
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { error: err.message || "Proxy request failed" },
      { status: 500 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
