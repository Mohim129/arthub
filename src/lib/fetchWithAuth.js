/**
 * Helper to make authenticated fetch requests
 * Should be called from within a component that has access to user session
 * @param {string} url - Full URL or just the endpoint path
 * @param {string} userId - Current user ID from authClient.useSession()
 * @param {object} options - Fetch options
 */
export async function fetchWithAuth(url, userId, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(userId && { 'x-user-id': userId }),
    ...(userId && { 'Authorization': `Bearer ${userId}` })
  };

  return fetch(url, {
    ...options,
    headers
  });
}

/**
 * Helper to fetch from backend API
 * @param {string} endpoint - API endpoint (e.g., '/api/artworks/featured')
 * @param {string} userId - Current user ID from authClient.useSession()
 * @param {object} options - Fetch options
 */
export async function fetchAPI(endpoint, userId, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
  return fetchWithAuth(`${baseUrl}${endpoint}`, userId, options);
}

