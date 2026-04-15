"use server";


import { httpRequest } from "@/config/axios/axios";
import { cookies } from "next/headers";


export const updateUserStatus = async (id: string, status: string) => {
    const cookieStore = await cookies()

  const { data } = await httpRequest.patch(`/api/admin/users/${id}/status`, { status },{
     headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}

export const deleteUser = async (id: string) => {
    const cookieStore = await cookies()
  const { data } = await httpRequest.delete(`/admin/users/${id}`,{
     headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}

export const getAdminDashboardData = async ()=>{
    const cookieStore = await cookies()

  const {data} = await httpRequest.get("/api/admin/get-dashboard-data",{
headers: {
        "cookie": cookieStore.toString()
      }
  })
  console.log(data);
  
  return data
}
export const getAllTransactionns = async (page,limit)=>{
    const cookieStore = await cookies()

  const {data} = await httpRequest.get(`/api/payment/get-all-transactions?page=${page}&limit=${limit}`,{
headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}
export const getAllUsers = async (page,search)=>{
    const cookieStore = await cookies()

  const {data} = await httpRequest.get(`/admin/users?page=${page}&limit=10&search=${search}`,{
headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}
export const getAllPlans = async ()=>{
    const cookieStore = await cookies()

  const {data} = await httpRequest.get('/pricing',{
headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}
export const getAllTemplatePublic = async ()=>{
    const cookieStore = await cookies()

  const {data} = await httpRequest.get('/template',{
headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}
export const getAllTemplateDetailsPublic = async (id)=>{
    const cookieStore = await cookies()

  const {data} = await httpRequest.get(`/template/templateDetails/${id}`,{
headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}


