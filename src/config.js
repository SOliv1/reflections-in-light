const LOCAL_API_URL = "http://localhost:5000";

function normalizeUrls(rawValue) {
  return (rawValue || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

function getRuntimeFallbackUrls() {
  if (typeof window === "undefined") {
    return [LOCAL_API_URL];
  }

  const { hostname, origin } = window.location;
  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "74.220.49.0/24" ||
    hostname === "[::1]";

  if (isLocalHost) {
    return [LOCAL_API_URL];
  }

  return origin ? [origin] : [];
}

const configuredUrls = normalizeUrls(
  [
    process.env.REACT_APP_API_BASE_URL,
    process.env.REACT_APP_API_URLS,
    process.env.REACT_APP_API_URL,
  ]
    .filter(Boolean)
    .join(",")
);

export const API_BASE_URLS = [...new Set([...configuredUrls, ...getRuntimeFallbackUrls()])];

export const API_BASE_URL = API_BASE_URLS[0] || LOCAL_API_URL;

export default API_BASE_URL;
