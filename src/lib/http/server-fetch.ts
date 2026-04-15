"use server";

import { cookies } from "next/headers";
import { getBackendUrl } from "./env";
import { parseJsonSafe, type ApiEnvelope } from "./parse";
import { setAuthCookie } from "@/lib/cookie";

type ServerFetchInit = RequestInit & { skipRefresh?: boolean };

/**
 * Server-only fetch to the Express API with Next cookie jar.
 * On 401, attempts one refresh-token rotation and retries (syncs cookies via setAuthCookie).
 */
export async function serverFetch(path: string, init: ServerFetchInit = {}): Promise<Response> {
  const backend = getBackendUrl();
  const url = `${backend}/api/${path.replace(/^\//, "")}`;
  const { skipRefresh, ...rest } = init;

  const cookieStore = await cookies();
  let cookieHeader = cookieStore.toString();

  const buildHeaders = (cookie: string): Headers => {
    const h = new Headers(rest.headers);
    if (cookie) h.set("cookie", cookie);
    return h;
  };

  let res = await fetch(url, {
    ...rest,
    headers: buildHeaders(cookieHeader),
    cache: "no-store",
  });

  if (res.status === 401 && !skipRefresh && !path.includes("auth/refresh-token")) {
    const refreshRes = await fetch(`${backend}/api/auth/refresh-token`, {
      method: "POST",
      headers: buildHeaders(cookieHeader),
      cache: "no-store",
    });

    if (refreshRes.ok) {
      const json = (await parseJsonSafe<ApiEnvelope>(refreshRes)) as ApiEnvelope<{
        accessToken?: string;
        refreshToken?: string;
        sessionToken?: string;
      }>;
      const d = json?.data;
      if (d?.accessToken && d?.refreshToken && d?.sessionToken) {
        await setAuthCookie(d.accessToken, d.sessionToken, d.refreshToken);
      }
      const jar = await cookies();
      cookieHeader = jar.toString();
      res = await fetch(url, {
        ...rest,
        headers: buildHeaders(cookieHeader),
        cache: "no-store",
      });
    }
  }

  return res;
}

export async function serverFetchJson<T>(path: string, init?: ServerFetchInit): Promise<T> {
  const res = await serverFetch(path, init);
  const body = await parseJsonSafe<T>(res);
  return body as T;
}

