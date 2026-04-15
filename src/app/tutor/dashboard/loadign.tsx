import React from 'react'


const DashboardSkeleton = () => (
  <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
    <div className="h-12 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-10" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
      <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
    </div>
  </div>
);

export default DashboardSkeleton
