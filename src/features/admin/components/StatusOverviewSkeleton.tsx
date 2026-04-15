import { cn } from "@/lib/utils";

const StatusOverviewSkeleton = () => {

  const skeletonCards = Array.from({ length: 4 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {skeletonCards.map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 shadow-sm relative overflow-hidden"
        >
    
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-500/5 dark:via-white/5 to-transparent" />

          <div className="flex justify-between items-start mb-4 relative">

            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            
    
            <div className="h-4 w-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg animate-pulse" />
          </div>

    
          <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-2 animate-pulse" />
          
      
          <div className="h-8 w-24 bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default StatusOverviewSkeleton;
