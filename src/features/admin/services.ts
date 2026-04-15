"use server";

import { revalidatePath } from "next/cache";
import { getToken } from "../student-dashboard/services";

const API_URL = process.env.API_URL;

export const getAllUsersByAdmin = async (page,status,q) => {
  try {
    const cookieString = await getToken(); // Returns cookieStore.toString()
    if (!cookieString) throw new Error("Unauthorized: No cookies found");

    const res = await fetch(`${API_URL}/api/admin/users?page=${page}&status=${status}&q=${q}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString, // Changed from Authorization to cookie
      },
      next: { revalidate: 0 },
    });

    return await res.json();
  } catch (error) {
    console.error("getAllUsersByAdmin error:", error);
    return { error: "Could not retrieve users list" };
  }
};
export const getLatestUsers = async () => {
  try {
    const cookieString = await getToken(); // Returns cookieStore.toString()
    if (!cookieString) throw new Error("Unauthorized: No cookies found");

    const res = await fetch(`${API_URL}/api/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString, // Changed from Authorization to cookie
      },
      next: { revalidate: 0 },
    });

    const result = await res.json()
    return result?.data.slice(0,3)
  } catch (error) {
    console.error("get users error:", error);
    return { error: "Could not retrieve users list" };
  }
};

export const updateUserStatus = async (payload: { userId: string; body: { status: string } }) => {
  try {
    const cookieString = await getToken();
    if (!cookieString) throw new Error("Unauthorized: No cookies found");

    const res = await fetch(
      `${API_URL}/api/admin/users/${payload.userId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieString, // Changed from Authorization to cookie
        },
        body: JSON.stringify(payload.body),
      }
    );

    const result = await res.json();
   
    
    // Revalidate the users list so the admin sees the status change immediately
    revalidatePath("/admin/dashboard/users");
    
    return result;
  } catch (error) {
    console.error("updateUserStatus error:", error);
    return { error: "Failed to update user status" };
  }
};

export const getAllBookingsByAdmin = async (page,status) => {
  try {
    const cookieString = await getToken();
    if (!cookieString) throw new Error("Unauthorized: No cookies found");
console.log(`${API_URL}/api/admin/bookings?page=${page}&status=${status}`);

    const res = await fetch(`${API_URL}/api/admin/bookings?page=${page}&status=${status}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString, // Changed from Authorization to cookie
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch bookings");
    }

    return await res.json();
  } catch (error) {
    console.error("getAllBookingsByAdmin error:", error);
    return { error: "Could not retrieve bookings list" };
  }
};
export const getLatestBooking = async () => {
  try {
    const cookieString = await getToken();
    if (!cookieString) throw new Error("Unauthorized: No cookies found");

    const res = await fetch(`${API_URL}/api/admin/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString, // Changed from Authorization to cookie
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch bookings");
    }
       const result = await res.json()
    return result?.data.slice(0,3)
  } catch (error) {
    console.error("getAllBookingsByAdmin error:", error);
    return { error: "Could not retrieve bookings list" };
  }
};

export const getDashboardOverviewStars = async () => {
  try {
    const cookieString = await getToken();
    if (!cookieString) throw new Error("Unauthorized: No cookies found");

    const res = await fetch(`${API_URL}/api/admin/get-dashboard-data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString, // Changed from Authorization to cookie
      },
      credentials:"include",
      cache:"default"
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch bookings");
    }
       const result = await res.json()
    return result
  } catch (error) {
    console.error("getAllBookingsByAdmin error:", error);
    return { error: "Could not retrieve bookings list" };
  }
};

export const createCategoryByAdmin = async (data: any) => {
  try {
    const cookieString = await getToken();
    if (!cookieString) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/api/admin/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to create category");

    return await res.json();
  } catch (error) {
    console.error("createCategoryByAdmin error:", error);
    throw error;
  }
};

export const updateCategoryByAdmin = async (
  id: string,
  data: any
) => {
  try {
    const cookieString = await getToken();
    if (!cookieString) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieString,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to update category");

    return await res.json();
  } catch (error) {
    console.error("updateCategoryByAdmin error:", error);
    throw error;
  }
};

export const deleteCategoryByAdmin = async (id: string) => {
  try {
    const cookieString = await getToken();
    if (!cookieString) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        cookie: cookieString,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to delete category");

    return await res.json();
  } catch (error) {
    console.error("deleteCategoryByAdmin error:", error);
    throw error;
  }
};

