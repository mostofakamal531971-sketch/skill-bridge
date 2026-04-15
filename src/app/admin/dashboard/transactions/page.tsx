"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Eye, Edit2, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { getAllTransactionns } from "@/services/admin.services";

// --- Types based on your Prisma Schema ---
enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

type Payment = {
  id: string;
  transactionId: string | null;
  createdAt: string;
  user: { name: string };
  paymentMethod: string;
  amount: number;
  status: PaymentStatus;
};

// --- Skeleton Loader Component ---
const TableSkeleton = () => {
  return (
    <>
      {[...Array(7)].map((_, i) => (
        <tr key={i} className="border-b border-border/50 animate-pulse">
          <td className="p-4"><div className="h-4 w-4 bg-muted rounded"></div></td>
          <td className="p-4"><div className="h-4 w-24 bg-muted rounded"></div></td>
          <td className="p-4"><div className="h-4 w-28 bg-muted rounded"></div></td>
          <td className="p-4"><div className="h-4 w-32 bg-muted rounded"></div></td>
          <td className="p-4"><div className="h-4 w-16 bg-muted rounded"></div></td>
          <td className="p-4"><div className="h-4 w-20 bg-muted rounded"></div></td>
          <td className="p-4"><div className="h-6 w-20 bg-muted rounded-full"></div></td>
          <td className="p-4 flex gap-2">
            <div className="h-8 w-8 bg-muted rounded-md"></div>
            <div className="h-8 w-8 bg-muted rounded-md"></div>
          </td>
        </tr>
      ))}
    </>
  );
};

// --- Main Content Component ---
const PaymentListContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "";

  const updateURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
    if (key !== "page") params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", page, status],
    queryFn: () => getAllTransactionns(page,10),
  });

  console.log(data);
  

  const payments: Payment[] = data?.data.data || [];
  const totalPages = data?.meta?.totalPages || 10;

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return <span className="px-3 py-1 text-xs font-medium bg-success/10 text-success border border-success/20 rounded-md">Approved</span>;
      case PaymentStatus.PENDING:
        return <span className="px-3 py-1 text-xs font-medium bg-warning/10 text-warning border border-warning/20 rounded-md">Pending</span>;
      case PaymentStatus.FAILED:
        return <span className="px-3 py-1 text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 rounded-md">Failed</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md">{status}</span>;
    }
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6 text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Customer Payment List</h1>
       
      </div>

      {/* Table Section Wrapper */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
              <tr>
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-border" /></th>
                <th className="p-4 font-medium">Invoice ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Payment Method</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
  
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <TableSkeleton />
              ) : payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.paymentId} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4"><input type="checkbox" className="rounded border-border" /></td>
                    <td className="p-4 font-medium">{payment.transactionId || `#S-${payment.paymentId.slice(0, 6)}`}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">{payment.user?.name || "Cody Fisher"}</td>
                    <td className="p-4 text-muted-foreground">{payment.paymentMethod || "Card"}</td>
                    <td className="p-4 font-medium text-foreground">${payment.amount.toFixed(2)}</td>
                    <td className="p-4">{getStatusBadge(payment.paymentStatus)}</td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground font-medium">
                    No payments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-card">
          <button
            disabled={page <= 1}
            onClick={() => updateURL("page", page - 1)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 8, 9, 10].map((p, i) => (
              <button
                key={i}
                onClick={() => typeof p === 'number' && updateURL("page", p)}
                className={`w-8 h-8 flex items-center justify-center text-sm rounded-md transition-colors ${page === p ? 'bg-muted font-bold text-foreground border border-border' : 'text-muted-foreground hover:bg-muted/50'} ${typeof p !== 'number' && 'cursor-default hover:bg-transparent'}`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => updateURL("page", page + 1)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="h-4 w-4" />
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
        <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
        <div className="h-24 w-full bg-muted rounded-xl animate-pulse"></div>
        <div className="h-96 w-full bg-muted rounded-xl animate-pulse"></div>
      </div>
    }>
      <PaymentListContent />
    </Suspense>
  );
}
