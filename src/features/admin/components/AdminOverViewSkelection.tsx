 const OverviewSkeleton = () => (
  <div className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto animate-pulse">
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="space-y-3">
        <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        <div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
      </div>
      <div className="h-12 w-40 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-40 rounded-[40px] bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800" />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-[450px] rounded-[44px] bg-zinc-100 dark:bg-zinc-900/50" />
      <div className="h-[450px] rounded-[44px] bg-zinc-100 dark:bg-zinc-900/50" />
    </div>
  </div>
);

export default OverviewSkeleton
