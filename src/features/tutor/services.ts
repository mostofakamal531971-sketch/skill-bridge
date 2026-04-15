"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { addAvailabilityPayload, updateTutorProfilePayload } from "./types";

const API_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export const tutorOnboardingHandler = async (payload: unknown) => {
  try {
    const cookieString = await getCookieHeader();

    const response = await fetch(`${API_BASE}/api/tutor/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to complete onboarding");
    return result;
  } catch (error: unknown) {
    console.error("tutorOnboardingHandler error:", error);
    return { error: error instanceof Error ? error.message : "Something went wrong" };
  }
};

export async function updateTutorProfile(formData: updateTutorProfilePayload | unknown) {
  try {
    const cookieString = await getCookieHeader();

    const res = await fetch(`${API_BASE}/api/tutor/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString,
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    revalidatePath("/tutor/dashboard/profile");
    return result;
  } catch (error) {
    console.error("updateTutorProfile error:", error);
    return { error: "Something went wrong" };
  }
}

export const getAllSession = async () => {
  try {
    const cookieString = await getCookieHeader();

    const response = await fetch(`${API_BASE}/api/tutor/sessions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString,
      },
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to get sessions");
    return result;
  } catch (error) {
    console.error("getAllSession error:", error);
    return { data: [] };
  }
};

export const addAvailability = async (payload: addAvailabilityPayload) => {
  try {
    const cookieString = await getCookieHeader();

    const response = await fetch(`${API_BASE}/api/tutor/availability`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    revalidatePath("/tutor/dashboard/availability");
    return result;
  } catch (error) {
    console.error("addAvailability error:", error);
    return { error: "Failed to update availability" };
  }
};

export const getAllAvailability = async () => {
  try {
    const cookieString = await getCookieHeader();

    const response = await fetch(`${API_BASE}/api/tutor/availability`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString,
      },
      cache: "no-store",
    });

    const json = await response.json();
    return json?.data ?? json;
  } catch (error) {
    console.error("getAllAvailability error:", error);
    return [];
  }
};

export async function deleteAvailabilitySlot(slotId: string) {
  try {
    const cookieString = await getCookieHeader();
    const res = await fetch(`${API_BASE}/api/tutor/availability/${slotId}`, {
      method: "DELETE",
      headers: { cookie: cookieString },
    });
    const result = await res.json();
    revalidatePath("/tutor/dashboard/availability");
    return result;
  } catch (error) {
    console.error("deleteAvailabilitySlot error:", error);
    return { success: false, message: "Failed to delete slot" };
  }
}

export async function getTutorReviews(tutorId: string) {
  try {
    const cookieString = await getCookieHeader();
    const response = await fetch(`${API_BASE}/api/review/${tutorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString,
      },
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error("getTutorReviews error:", error);
    return { success: false, message: "Server connection failed", data: [] };
  }
}

export async function getTutorDashboardData() {
  try {
    const cookieString = await getCookieHeader();
    const response = await fetch(`${API_BASE}/api/tutor/get-dashboard-data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString,
      },
      cache: "no-store",
    });

    const json = await response.json();
    return json?.data ?? json;
  } catch (error) {
    console.error("getTutorDashboardData error:", error);
    return null;
  }
}

export async function getTutorEarnings() {
  try {
    const cookieString = await getCookieHeader();
    const response = await fetch(`${API_BASE}/api/tutor/earnings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString,
      },
      cache: "no-store",
    });
    const json = await response.json();
    return json?.data ?? json;
  } catch (error) {
    console.error("getTutorEarnings error:", error);
    return null;
  }
}

export async function updateSessionStatus(payload: {
  sessionId: string;
  body: { status: string };
}) {
  try {
    const cookieString = await getCookieHeader();
    const response = await fetch(
      `${API_BASE}/api/tutor/sessions/${payload.sessionId}/finish-session`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieString,
        },
        body: JSON.stringify(payload.body),
      }
    );

    const result = await response.json();
    revalidatePath("/tutor/dashboard/sessions");
    return result;
  } catch (error) {
    console.error("updateSessionStatus error:", error);
    return { success: false, message: "Server connection failed" };
  }
}

