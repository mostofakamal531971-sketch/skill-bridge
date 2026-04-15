"use client"
import { useMemo, useState } from "react";
import { Review } from "./types";
import { AnimatePresence,motion } from "framer-motion";
import ReviewCard from "./ReviewCard";
import ReviewsEmptyState from "./EmptyState";

const ReviewDashboard = ({ reviews }: { reviews: Review[] }) => {
  const [filterRating, setFilterRating] = useState("all");

  const filteredData = useMemo(() => {
    let result = [...reviews];
    if (filterRating !== "all") {
      result = result.filter(r => r.rating === parseInt(filterRating));
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filterRating, reviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    return (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] p-6 md:p-12 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter">Reviews</h1>
            <p className="text-zinc-500 font-medium italic">Your impact on students, quantified.</p>
          </div>
          
          <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] shadow-sm">
             <div className="px-8 py-4 border-r border-zinc-100 dark:border-zinc-800 text-center">
                <p className="text-[10px] font-black text-zinc-400 uppercase">Avg Rating</p>
                <p className="text-2xl font-black">{averageRating} <span className="text-yellow-500 text-lg">★</span></p>
             </div>
             <div className="px-8 py-4 text-center">
                <p className="text-[10px] font-black text-zinc-400 uppercase">Total</p>
                <p className="text-2xl font-black">{reviews.length}</p>
             </div>
          </div>
        </header>
   

        {/* Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            { filteredData.length > 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6">
                {filteredData.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </motion.div>
            ) : (
              <ReviewsEmptyState key="empty" onClear={() => setFilterRating("all")} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};


export default ReviewDashboard
