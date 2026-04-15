"use server";

import { revalidatePath } from "next/cache";
import { getBackendUrl } from "@/lib/http/env";
import { parseJsonSafe, type ApiEnvelope } from "@/lib/http/parse";
import { setAuthCookie } from "@/lib/cookie";
import { deleteCookie } from "@/lib/cookie";
import { serverFetch } from "@/lib/http/server-fetch";

export type SignInPayload = { email: string; password: string };
export type SignUpPayload = { name: string; email: string; password: string; role: string };

export type AuthActionResult =
  | { success: true; message?: string; user?: unknown }
  | { success: false; message: string; errors?: unknown };

export async function signInAction(payload: SignInPayload): Promise<AuthActionResult> {
  const res = await fetch(`${getBackendUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json = await parseJsonSafe<ApiEnvelope & { errors?: unknown }>(res);

  if (!res.ok) {
    return {
      success: false,
      message: (json as { message?: string })?.message || "Login failed",
      errors: (json as { errors?: unknown }).errors,
    };
  }

  const data = json?.data as {
    accessToken?: string;
    refreshToken?: string;
    sessionToken?: string;
    user?: unknown;
  };

  if (data?.accessToken && data?.refreshToken && data?.sessionToken) {
    await setAuthCookie(data.accessToken, data.sessionToken, data.refreshToken);
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: json?.message,
    user: data?.user,
  };
}

export async function signUpAction(payload: SignUpPayload): Promise<AuthActionResult> {
  const res = await fetch(`${getBackendUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json = await parseJsonSafe<ApiEnvelope & { errors?: unknown }>(res);

  if (!res.ok) {
    return {
      success: false,
      message: (json as { message?: string })?.message || "Registration failed",
      errors: (json as { errors?: unknown }).errors,
    };
  }

  revalidatePath("/", "layout");
  return { success: true, message: json?.message, user: json?.data };
}

export async function signOutAction(): Promise<AuthActionResult> {
  try {
    const res = await serverFetch("auth/logout", {
      method: "POST",
      skipRefresh: true,
    });

    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    await deleteCookie("better-auth.session_token");

    revalidatePath("/", "layout");

    if (!res.ok) {
      return { success: true, message: "Signed out locally" };
    }

    const json = await parseJsonSafe<ApiEnvelope>(res);
    return { success: true, message: json?.message };
  } catch {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    await deleteCookie("better-auth.session_token");
    revalidatePath("/", "layout");
    return { success: true, message: "Signed out" };
  }
}

