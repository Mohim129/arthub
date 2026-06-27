const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function fetchWithAuth(endpoint, options = {}) {
  // Get the current user's id from the session (client‑side)
  let userId = "";
  try {
    const sessionRes = await import("@/lib/auth-client").then((m) =>
      m.authClient.getSession(),
    );
    userId = sessionRes?.data?.user?.id || "";
  } catch (e) {
    // not critical – public endpoints don't need it
  }

  const headers = {
    "Content-Type": "application/json",
    ...(userId ? { "x-user-id": userId } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // sends the session cookie too
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchAPI(endpoint, userId, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(userId ? { "x-user-id": userId } : {}),
    ...(userId ? { "Authorization": `Bearer ${userId}` } : {}),
    ...options.headers,
  };
  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });
}


