const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const getArtistArtworks = async (artistId, status = "active") => {
  const res = await fetch(
    `${baseUrl}/api/artworks?artistId=${artistId}&status=${status}`,
  );
  if (!res.ok) throw new Error("Failed to fetch artworks");
  return res.json();
};

export const updateArtwork = async (id, updatedData) => {
  const res = await fetch(`${baseUrl}/api/artworks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update artwork");
    }
    throw new Error("Failed to update artwork");
  }
  return res.json();
};

export const deleteArtwork = async (id) => {
  const res = await fetch(`${baseUrl}/api/artworks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete artwork");
    }
    throw new Error("Failed to delete artwork");
  }
  return res.json();
};
