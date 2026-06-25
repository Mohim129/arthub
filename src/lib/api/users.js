const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const getUserById = async (id) => {
  const res = await fetch(`${getBaseUrl()}/api/users/${id}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Artist not found");
    }
    throw new Error("Failed to fetch artist");
  }
  return res.json();
};

export const getUserPurchases = async (id) => {
  const res = await fetch(`${getBaseUrl()}/api/users/${id}/purchases`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch purchases");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.purchases || [];
};
