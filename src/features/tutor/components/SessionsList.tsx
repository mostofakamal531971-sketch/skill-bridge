"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StudentBooking } from "@/features/tutor/types";
import { BookingCard } from "./BookingCard";
import { EmptyState } from "@/features/student-dashboard/components/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Filter, SortAsc, SortDesc } from "lucide-react";

export function SessionList({ sessions }: { sessions: StudentBooking[] }) {
  const [filter, setFilter] = useState<"ALL" | StudentBooking["status"]>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const filteredAndSortedSessions = useMemo(() => {
    let result = [...sessions];

    if (filter !== "ALL") {
      result = result.filter((s) => s.status === filter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [sessions, filter, sortBy]);

  const filterOptions: ("ALL" | StudentBooking["status"])[] = [
    "ALL",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-6">
      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-800/20 p-2 rounded-3xl border border-zinc-100 dark:border-zinc-800/50">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1">
          {filterOptions.map((option) => (
            <Button
              key={option}
              variant="ghost"
              size="sm"
              onClick={() => setFilter(option)}
              className={cn(
                "rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                filter === option
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              {option}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-2">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mr-2 flex items-center gap-1">
            <Filter size={12} /> Filter
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
            className="rounded-xl border-zinc-200 dark:border-zinc-800 h-8 text-[10px] font-black uppercase tracking-widest gap-2"
          >
            {sortBy === "newest" ? <SortDesc size={14} /> : <SortAsc size={14} />}
            {sortBy === "newest" ? "Newest First" : "Oldest First"}
          </Button>
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedSessions.length > 0 ? (
            filteredAndSortedSessions.map((session) => (
              <BookingCard key={session.id} session={session} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
