const TutorCardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="h-[380px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] animate-pulse p-6">
        <div className="flex justify-between mb-8">
          <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded ml-auto" />
            <div className="h-6 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-8 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4 w-1/3 bg-zinc-100 dark:bg-zinc-800 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
            <div className="h-8 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
          </div>
          <div className="h-12 w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl mt-4" />
        </div>
      </div>
    ))}
  </div>
);
export default TutorCardSkeleton
