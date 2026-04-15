"use server";

import { cookies } from "next/headers";
import { updateProfilePayload } from "./types";
import { revalidatePath } from "next/cache";
import { envVeriables } from "@/config/envVariables";
import { httpRequest } from "@/config/axios/axios";

export async function getToken() {
  const cookieStore = await cookies();

  return cookieStore.toString();
}

export async function getSavedTutors() {
  try {
    const token = await getToken();
    const res = await httpRequest.get(`/api/student/get-tutors`,{
 headers: {
        "Content-Type": "application/json",
        cookie: token,
      },
    })
    const data = await res.data
    return data
  } catch (error: any) { 
    console.error("getSavedTutors error:", error);
    return { error: error.message }
  } 
}
export async function unSaveTutor(tutorId) {
  try {
    const token = await getToken();
    const res = await httpRequest.post(`/api/student/un-savedTutor/${tutorId}`,{
 headers: {
        "Content-Type": "application/json",
        cookie: token,
      },
    })
    const data = await res.data
    return data
  } catch (error: any) { 
    console.error("getSavedTutors error:", error);
    return { error: error.message }
  } 
}

export async function getDashboardStats(id:string) {
  try {
    const token = await getToken();
    const res = await fetch(`${process.env.API_URL}/api/student/${id}/dashboard/stats`, {
      headers: { cookie: token },
    });
    const data = await res.json();
    return { data };
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return { error: "Failed to fetch dashboard stats" };
  }
}

export async function getStudentBookings() {
  try {
    const token = await getToken();
    const res = await fetch(`http://localhost:5000/api/booking`, {
      headers: { cookie: token },
    });
    return await res.json();
  } catch (error) {
    console.error("getStudentBookings error:", error);
    return { error: "Failed to fetch bookings" };
  }
}

export async function updateProfile(formData: updateProfilePayload) {
  try {
    const token = await getToken();
    const res = await fetch(`${process.env.API_URL}/api/student/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: token,
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    revalidatePath("/dashboard/profile");
    return result;
  } catch (error) {
    console.error("updateProfile error:", error);
    return { error: "Something went wrong while updating profile" };
  }
}


export const changePassword = async (data: any) => {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.API_URL}/api/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: token,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to update password");
    return result;
  } catch (error) {
    console.error("changePassword error:", error);
    throw error;
  }
};

export const createBooking = async (data: any) => {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.API_URL}/api/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: token,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to create booking");
    
    revalidatePath(`/tutors/${data.tutorId}`);
    revalidatePath("/dashboard/bookings");
    return result;
  } catch (error) {
    console.error("createBooking error:", error);
    throw error;
  }
};
export const cencelBooking = async (data: any) => {
  try {
    const token = await getToken();
    const response = await httpRequest.patch(`/api/booking/${data.bookingId}/cancel-booking`,data.body,{
        headers: {
        "Content-Type": "application/json",
        cookie: token,
      },
    })
    
    const result = await response.data
    if (response.status !== 200) throw new Error(result.message || "Failed to Cancel booking");
    revalidatePath(`/tutors/${data.tutorId}`);
    revalidatePath("/dashboard/bookings");
    return result;
  } catch (error) {
    console.error("cancel Booking error:", error);
    throw error;
  }
};

export const getBookingDetails = async (bookingId: string) => {
  try {
    const token = await getToken();
    const response = await httpRequest.get(`/api/booking/${bookingId}`,{
 headers: {
        "Content-Type": "application/json",
        cookie: token,
      },
    })
  

    return await response.data
  } catch (error) {
    console.error("getBookingDetails error:", error);
    return { error: "Failed to fetch booking details" };
  }
};

export const createReview = async (payload: any) => {
  try {
    const token = await getToken();
    const response = await fetch(`${process.env.API_URL}/api/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: token,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    revalidatePath(`/dashboard/bookings/${payload.bookingId}`);
    return result;
  } catch (error) {
    console.error("createReview error:", error);
    return { error: "Failed to submit review" };
  }
};
