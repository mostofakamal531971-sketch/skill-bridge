"use client";

import { parseJsonSafe, ApiRequestError, getErrorMessage } from "./parse";

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${window.location.origin}/api/proxy/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export type ClientFetchOptions = RequestInit & {
  /** Skip automatic refresh on 401 (e.g. login/register). */
  skipRefresh?: boolean;
};

/**
 * Browser fetch via same-origin BFF `/api/proxy/*` so Set-Cookie from the backend reaches the browser.
 */
export async function clientFetch(path: string, init: ClientFetchOptions = {}): Promise<Response> {
  const { skipRefresh, ...rest } = init;
  const clean = path.replace(/^\//, "");
  const url = `/api/proxy/${clean}`;

  const opts: RequestInit = {
    ...rest,
    credentials: "include",
    headers: {
      ...(rest.headers as Record<string, string>),
    },
  };

  let res = await fetch(url, opts);

  if (
    res.status === 401 &&
    !skipRefresh &&
    !clean.startsWith("auth/refresh-token") &&
    !clean.startsWith("auth/login") &&
    !clean.startsWith("auth/register")
  ) {
    const ok = await refreshSession();
    if (ok) {
      res = await fetch(url, opts);
    }
  }

  return res;
}

export async function clientFetchJson<T>(path: string, init?: ClientFetchOptions): Promise<T> {
  const res = await clientFetch(path, init);
  const body = await parseJsonSafe<T>(res);
  if (!res.ok) {
    throw new ApiRequestError(getErrorMessage(body), res.status, body);
  }
  return body as T;
}

