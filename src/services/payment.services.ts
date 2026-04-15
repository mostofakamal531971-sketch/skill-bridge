"use server";

import { httpRequest } from "@/config/axios/axios";
import { cookies } from "next/headers";

export type PaymentHistorySummary = {
  totalPaid: number;
  totalTransactions: number;
  successfulCount: number;
  pendingCount: number;
  failedCount: number;
};

export type UserPaymentHistoryMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  summary: PaymentHistorySummary;
};

export type UserPaymentRecord = {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  transactionId: string | null;
  invoiceUrl: string | null;
  createdAt: string;
  updatedAt?: string;
  user?: { id: string; name?: string; email?: string };
};

export type UserPaymentHistoryResult = {
  meta: UserPaymentHistoryMeta;
  paymentsList: UserPaymentRecord[];
};

export type UserPaymentHistoryQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export const getPaymentDetails = async (id: string) => {
  const cookieStore = await cookies();
  const result = await httpRequest.get(`/api/payment/${id}`, {
    headers: {
      cookie: cookieStore.toString(),
    },
  });
  return result.data;
};

export const getUserPaymentHistory = async (
  userId: string,
  params: UserPaymentHistoryQuery = {}
): Promise<UserPaymentHistoryResult> => {
  const cookieStore = await cookies();
  const { page = 1 } = params;

  const result = await httpRequest.get(`/api/payment/user/${userId}/transactions?page=${page}`,{
    headers: {
        cookie: cookieStore.toString(),
      },
  })

  const envelope = result.data;
  const payload = envelope?.data ?? envelope;
  return payload as UserPaymentHistoryResult;
};

