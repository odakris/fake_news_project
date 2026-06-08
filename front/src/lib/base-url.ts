/**
 * Returns the base URL of the API.
 *
 * - In the browser, we always use the current origin (window.location.origin)
 *   so that calls from a tunneled domain (e.g. ngrok) hit the same origin
 *   instead of trying to reach localhost, which is blocked as loopback.
 * - On the server (SSR / Node), we can fall back to an env var or localhost.
 */
export const getBaseUrl = () => {
  // Browser: use the page origin (works for localhost and ngrok)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server-side: allow override via env in case you proxy or deploy elsewhere
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Default dev fallback
  return "http://localhost:3000";
};
