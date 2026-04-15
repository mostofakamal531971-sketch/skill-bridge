"use server";

import { httpRequest } from "@/config/axios/axios";
import { cookies } from "next/headers";

export const getUserDashboardData = async () => {
  const cookieStore = await cookies()

  const { data } = await httpRequest.get("/api/user/dashboard/kpis", {
    headers: {
      "cookie": cookieStore.toString()
    }
  })
  return data
}


export const handleClaimFreeCredit = async (payload) => {
    const cookieStore = await cookies()
    const response = await httpRequest.post("/api/wallet/claim-free-credit", payload, {
      headers: {
        "cookie": cookieStore.toString(),
       timeout:30000
      }
    });
     // Create a clean,
    const cleanResponse = {
      success: true,
      data: response.data?.secure_url || response.data?.url || response.data,
      status: response.status,
      message: response.data?.message || "Upload successful"
    };
    // Verify it's serializable
    JSON.stringify(cleanResponse);
    return cleanResponse;
}
