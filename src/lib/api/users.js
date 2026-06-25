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
