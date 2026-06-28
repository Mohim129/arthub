import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

async function proxyRequest(req, { params }) {
  try {
    const { path } = await params;
    const pathSegments = Array.isArray(path) ? path.join("/") : path;
    const backendPath = `/${pathSegments}`;

    const url = new URL(req.url);
    const targetUrl = `${BACKEND_URL}${backendPath}${url.search}`;

    const cookieHeader = req.headers.get("cookie");
    const method = req.method;

    const headers = {};
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const contentType = req.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    const fetchOptions = { method, headers };

    if (method !== "GET" && method !== "HEAD") {
      fetchOptions.body = await req.text();
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
