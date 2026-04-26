import { API_BASE_URL, API_BASE_URLS } from "./config";

function buildUrl(baseUrl, path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function fetchFromApi(path, options) {
  const candidates = API_BASE_URLS.length > 0 ? API_BASE_URLS : [API_BASE_URL];
  let lastError;

  for (const baseUrl of candidates) {
    const requestUrl = buildUrl(baseUrl, path);

    try {
      const response = await fetch(requestUrl, options);

      if (response.ok) {
        return response;
      }

      if (response.status < 500 && response.status !== 404) {
        return response;
      }

      lastError = new Error(`Request failed with status ${response.status} for ${requestUrl}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error(`All API endpoints failed for ${path}`);
}
