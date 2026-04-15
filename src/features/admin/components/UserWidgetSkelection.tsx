
import React from 'react';
import { cn } from "@/lib/utils";

const UserWidgetSkeleton = () => {
  // Common shimmer class
  const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-zinc-800/20 before:to-transparent";

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-[32px] border border-zinc-100 dark:border-zinc-900 p-8 shadow-sm">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-10">
        <div className={cn("h-6 w-32 bg-zinc-100 dark:bg-zinc-900 rounded-xl", shimmer)} />
        <div className={cn("h-4 w-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg", shimmer)} />
      </div>

      {/* List Item Skeletons */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar Squircle */}
              <div className={cn("w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900", shimmer)} />
              
              <div className="space-y-2">
                {/* Name */}
                <div className={cn("h-3 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-full", shimmer)} />
                {/* Email */}
                <div className={cn("h-2 w-36 bg-zinc-50 dark:bg-zinc-900/60 rounded-full", shimmer)} />
              </div>
            </div>

            {/* Role Badge */}
            <div className={cn("h-6 w-14 bg-zinc-50 dark:bg-zinc-900 rounded-lg", shimmer)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserWidgetSkeleton;
