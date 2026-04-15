import React from "react";
import { cn } from "@/lib/utils";

const SkeletonRow = () => {
  return (
    <tr className="border-b border-zinc-50 dark:border-zinc-900">
      {/* Tutor / Subject Skeleton */}
      <td className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse shrink-0" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
            <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-900 rounded-md animate-pulse" />
          </div>
        </div>
      </td>

      {/* Student Journey Skeleton */}
      <td className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse shrink-0" />
          <div className="space-y-2">
            <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
            <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-900 rounded-md animate-pulse" />
          </div>
        </div>
      </td>

      {/* Timing Skeleton */}
      <td className="p-6">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
          <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-md animate-pulse" />
        </div>
      </td>

      {/* Status Skeleton */}
      <td className="p-6 text-center">
        <div className="inline-block h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
      </td>

      {/* Revenue Skeleton */}
      <td className="p-6">
        <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
      </td>
    </tr>
  );
};

 const SessionManagerSkeleton = () => {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header & Stats Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="h-12 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-[24px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-950 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-zinc-950 rounded-[40px] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};export default SessionManagerSkeleton
