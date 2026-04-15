"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, CreditCard, User, Calendar, Hash } from "lucide-react";
import { getUserPaymentHistory } from "@/services/payment.services";
import { useUser } from "@/context/UserContext";

// --- Types ---
enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

type Payment = {
  paymentId: string;
  transactionId: string | null;
  createdAt: string;
  user: { name: string };
  paymentMethod: string;
  amount: number;
  paymentStatus: PaymentStatus;
};

// --- Skeleton Loader (Adaptive) ---
const ResponsiveSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-full h-20 md:h-12 bg-muted/50 animate-pulse rounded-lg" />
      ))}
    </div>
  );
};

// --- Main Content Component ---
const PaymentListContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();
  
  const page = Number(searchParams.get("page")) || 1;

  const updateURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value.toString());
    else params.delete(key);
    if (key !== "page") params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", user?.id, page],
    queryFn: () => getUserPaymentHistory(user?.id as string, { page }),
    enabled: !!user?.id,
  });
  console.log(data);
  

  const payments: any[] = data?.paymentsList || [];
  const totalPages = data?.meta?.totalPages || 1;

  const getStatusBadge = (status: PaymentStatus) => {
    const styles = {
      [PaymentStatus.SUCCESS]: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      [PaymentStatus.PENDING]: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      [PaymentStatus.FAILED]: "bg-red-500/10 text-red-600 border-red-500/20",
    };
    return (
      <span className={`px-2.5 py-0.5 text-xs font-semibold border rounded-full ${styles[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-sm text-muted-foreground">Manage and review your recent payments</p>
        </div>
      </div>

      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Invoice / ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4 text-center">Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center"><ResponsiveSkeleton /></td></tr>
              ) : payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.paymentId} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4 font-medium text-foreground">
                      {payment.transactionId || `#S-${payment.id.slice(0, 6)}`}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">{payment.user?.name || "Anonymous"}</td>
                    <td className="p-4 text-center text-muted-foreground uppercase text-xs">{payment.paymentMethod || "Card"}</td>
                    <td className="p-4 font-semibold">${payment.amount.toFixed(2)}</td>
                    <td className="p-4">{getStatusBadge(payment.status)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-border/50">
          {isLoading ? (
            <div className="p-4"><ResponsiveSkeleton /></div>
          ) : payments.length > 0 ? (
            payments.map((payment) => (
              <div key={payment.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                      <Hash size={10} /> ID
                    </span>
                    <span className="text-sm font-bold">{payment.transactionId || `#S-${payment.id.slice(0, 6)}`}</span>
                  </div>
                  {getStatusBadge(payment.paymentStatus)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                      <Calendar size={10} /> Date
                    </span>
                    <p className="text-xs">{new Date(payment.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                      <User size={10} /> Customer
                    </span>
                    <p className="text-xs truncate">{payment.user?.name || "Anonymous"}</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-border/40">
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard size={14} />
                    <span className="text-xs uppercase">{payment.paymentMethod || "Card"}</span>
                   </div>
                   <span className="text-lg font-bold text-foreground">${payment.amount.toFixed(2)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground">No payments found.</div>
          )}
        </div>

        {/* Responsive Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-card">
          <button
            disabled={page <= 1}
            onClick={() => updateURL("page", page - 1)}
            className="p-2 border border-border rounded-md hover:bg-muted disabled:opacity-30 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Previous</span>
          </button>

          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground sm:hidden">
              Page {page} of {totalPages}
            </span>
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateURL("page", i + 1)}
                  className={`w-8 h-8 flex items-center justify-center text-xs rounded-md transition-all ${
                    page === i + 1 
                    ? 'bg-primary text-primary-foreground font-bold shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => updateURL("page", page + 1)}
            className="p-2 border border-border rounded-md hover:bg-muted disabled:opacity-30 transition-colors flex items-center gap-1"
          >
            <span className="hidden sm:inline text-sm">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Page Export with Suspense Boundary ---
export default function PaymentListPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-[400px] w-full bg-muted/20 rounded-xl animate-pulse" />
      </div>
    }>
      <PaymentListContent />
    </Suspense>
  );
}
