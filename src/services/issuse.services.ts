"use server";



import { httpRequest } from "@/config/axios/axios";
import { cookies } from "next/headers";

export const getAllIssues = async (url) => {
    const cookieStore = await cookies()
    const result = await httpRequest.get(url, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}
export const createIssue = async (payload) => {
    const cookieStore = await cookies()
    const result = await httpRequest.post("/issue", payload, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}

export const deleteIssue = async (issueId) => {
    const cookieStore = await cookies()
    const result = await httpRequest.delete(`/issue/${issueId}`, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}

export const updateIssue = async (updatepayload,issueId) => {
    const cookieStore = await cookies()
    const result = await httpRequest.patch(`/issue/${issueId}`, updatepayload, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}



