"use server";

import { serverFetch } from "@/lib/http/server-fetch";
import { parseJsonSafe, type ApiEnvelope } from "@/lib/http/parse";

/**
 * Current user profile (same shape as `/api/auth/me` success payload).
 */
export async function getSession(): Promise<ApiEnvelope<unknown> | null> {
  try {
    const res = await serverFetch("auth/me", { method: "GET" });
    const json = await parseJsonSafe<ApiEnvelope<unknown>>(res);
    if (!res.ok) return null;
    return json;
  } catch {
    return null;
  }
}

