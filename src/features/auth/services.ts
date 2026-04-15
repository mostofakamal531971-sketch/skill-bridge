"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/http/env";
import { getSession } from "@/lib/auth/session";
import { signOutAction } from "@/lib/auth/actions";

/** @deprecated Prefer `getSession` from `@/lib/auth/session`. */
export const getProfile = async (): Promise<{ user: { data: unknown }; cookies: string } | null> => {
  const session = await getSession();
  if (!session?.data) return null;
  const cookieStore = await cookies();
  return {
    user: { data: session.data },
    cookies: cookieStore.toString(),
  };
};

export const getCookies = async (): Promise<string> => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export const logoutUser = async () => {
  return signOutAction();
};

export const updateAvatar = async (formData: FormData) => {
  try {
    const cookieString = await getCookies();
    const response = await fetch(`${getBackendUrl()}/api/auth/profile/change-avater`, {
      method: "PUT",
      headers: { cookie: cookieString },
      body: formData,
    });
    const result = await response.json();
    revalidatePath("/tutor/dashboard/profile");
    revalidatePath("/dashboard/profile");
    return result;
  } catch (error) {
    console.error("updateAvatar error:", error);
    return { error: "Failed to update avatar" };
  }
};

