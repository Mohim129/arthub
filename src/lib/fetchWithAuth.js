let jwtToken = null;

export const setJwtToken = (token) => {
  jwtToken = token;
};

const BASE_URL = "/api/proxy";

export async function fetchWithAuth(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (jwtToken) {
    headers["Authorization"] = `Bearer ${jwtToken}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
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
    ...(jwtToken ? { "Authorization": `Bearer ${jwtToken}` } : (userId ? { "Authorization": `Bearer ${userId}` } : {})),
    ...options.headers,
  };
  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });
}

