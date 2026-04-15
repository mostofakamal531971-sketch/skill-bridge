import {motion} from "framer-motion"
import { Review } from "./types";
import { Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";
const ReviewCard = ({ review }: { review: Review }) => {
  const date = new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <motion.div layout className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 flex gap-6">
      <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-600 shrink-0">
        {review.student.name.charAt(0)}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">{review.student.name}</h3>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={cn(i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-200")} />
            ))}
          </div>
        </div>
        <p className="text-zinc-500 text-sm italic">"{review.comment}"</p>
        <div className="text-[10px] text-zinc-400 flex items-center gap-1 uppercase font-bold tracking-wider">
          <Calendar size={12} /> {date}
        </div>
      </div>
    </motion.div>
  );
};


export default ReviewCard
