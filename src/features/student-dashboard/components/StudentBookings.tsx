"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";


import { BookingCard } from "./BookingCard";
import { BookingSkeleton } from "./BookingSkeleton";
import { EmptyState } from "./EmptyState";



export default function StudentBookings({data}:{data:any}) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="p-4 md:p-8  mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-sm text-zinc-500">Manage and track sessions</p>
        </div>
      </div>

      <AnimatePresence>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <BookingSkeleton key={i} />)
          : data?.length > 0
          ? data.map((b:any) => <BookingCard key={b.id} booking={b} />)
          : <EmptyState />
        }
      </AnimatePresence>
  
    </div>
  );
}

