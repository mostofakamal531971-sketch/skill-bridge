/**
 * Server-side backend origin (no trailing slash).
 * Prefer API_URL for server; fall back to NEXT_PUBLIC_API_URL for local dev.
 */
export function getBackendUrl(): string {
  const base =
    process.env.API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000";
  return base;
}

/** Browser → Next.js BFF (same origin). */
export function getBrowserProxyPrefix(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/api/proxy`;
}

