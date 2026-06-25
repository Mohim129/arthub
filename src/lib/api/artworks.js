const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

const normalizeArtworkArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.artworks && Array.isArray(data.artworks)) return data.artworks;
  return [];
};

export const getArtistArtworks = async (artistId, status = "active") => {
  const res = await fetch(
    `${baseUrl}/api/artworks?artistId=${artistId}&status=${status}`,
  );
  if (!res.ok) throw new Error("Failed to fetch artworks");
  const data = await res.json();
  return normalizeArtworkArray(data);
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

const normalizeArtworksResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      artworks: data,
      total: data.length,
      page: 1,
      pages: 1,
    };
  }

  return {
    artworks: data.artworks ?? [],
    total:
      data.total ?? (Array.isArray(data?.artworks) ? data.artworks.length : 0),
    page: data.page ?? 1,
    pages: data.pages ?? 1,
  };
};

export const getAllArtworks = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      query.append(key, value);
    }
  });
  const res = await fetch(`${baseUrl}/api/artworks?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch artworks");
  const data = await res.json();
  return normalizeArtworksResponse(data);
};

export const getArtwork = async (id) => {
  const res = await fetch(`${baseUrl}/api/artworks/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Artwork not found");
    throw new Error("Failed to fetch artwork");
  }
  return res.json();
};

export const getArtworkComments = async (artworkId) => {
  const res = await fetch(`${baseUrl}/api/artworks/${artworkId}/comments`);
  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }
  return res.json();
};

export const postArtworkComment = async (artworkId, text) => {
  const res = await fetch(`${baseUrl}/api/artworks/${artworkId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to post comment");
  }

  return res.json();
};