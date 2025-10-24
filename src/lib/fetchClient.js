// src/lib/fetchClient.js

export async function fetchClient(endpoint, options = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text(); // fallback for plain text or HTML
  } catch (error) {
    console.error("fetchClient error:", error);
    throw error;
  }
}