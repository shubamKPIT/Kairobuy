// src/lib/api.js

// In-memory client cache (browser only). Lives until a full page reload.
const responseCache = new Map(); // url -> { promise?, data?, expires? }

export function clearApiCache(prefix = "") {
  for (const key of responseCache.keys()) {
    if (key.includes(`/api${prefix}`)) responseCache.delete(key);
  }
}

export async function apiRequest(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    token,
    headers = {},
    ttl = 0, // milliseconds; 0 = no client caching (default)
  } = options;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders = {
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  if (body && !isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  // Build absolute URL on the server
  let url = `/api${endpoint}`;
  const isServer = typeof window === "undefined";

  if (isServer) {
    const host =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL ||
      "http://localhost:3000";

    url = `${host}/api${endpoint}`;
  }

  // Only cache public GETs in the browser
  const canCache = !isServer && method === "GET" && !token && ttl > 0;

  // Let the browser/CDN use Cache-Control headers when caching is on
  const cache = options.cache ?? (canCache ? "default" : "no-store");

  if (canCache) {
    const hit = responseCache.get(url);
    if (hit) {
      if (hit.promise) return hit.promise; // same request already in flight
      if (hit.expires > Date.now()) return hit.data; // fresh cached data
    }
  }

  const run = async () => {
    let response;

    try {
      response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
        cache,
      });
    } catch {
      throw new Error(
        "Unable to connect to the server. Please check your internet connection."
      );
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong. Please try again.");
    }

    return data;
  };

  if (!canCache) {
    const data = await run();
    // Any successful write invalidates cached reads
    if (!isServer && method !== "GET") responseCache.clear();
    return data;
  }

  const promise = run()
    .then((data) => {
      responseCache.set(url, { data, expires: Date.now() + ttl });
      return data;
    })
    .catch((err) => {
      responseCache.delete(url); // never cache failures
      throw err;
    });

  responseCache.set(url, { promise });
  return promise;
}