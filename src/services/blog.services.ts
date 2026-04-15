"use server";

import { httpRequest } from "@/config/axios/axios";
import { cookies } from "next/headers";


export const getAllBlogs = async (url:string) => {
    const cookieStore = await cookies()
    const fullUrl = url.startsWith("/api") ? url : `/api${url.startsWith("/") ? "" : "/"}${url}`;
    const result = await httpRequest.get(fullUrl, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });

    return result.data

}
export const getBlogDetails = async (id) => {
    const cookieStore = await cookies()
    const result = await httpRequest.get(`/api/blog/${id}`, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });

    return result.data

}
export const createBlog = async (payload) => {
    const cookieStore = await cookies()
    const result = await httpRequest.post("/api/blog", payload, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    console.log(result);
    
    return result.data
}

export const deleteBlog = async (blogId) => {
    const cookieStore = await cookies()
    const result = await httpRequest.delete(`/api/blog/${blogId}`, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}



