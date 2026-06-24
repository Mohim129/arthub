export const getArtistArtworks = async (artistId, status = "active") => {
  const res = await fetch(
    `/api/artworks?artistId=${artistId}&status=${status}`,
  );
  if (!res.ok) throw new Error("Failed to fetch artworks");
  return res.json();
};
