import React from 'react'

const SessionWidgetSkelection = () => {
  return (
<div className="bg-white dark:bg-zinc-950 rounded-[32px] border border-zinc-100 dark:border-zinc-900 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-10 animate-pulse">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
          <div className="h-2 w-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-full" />
        </div>
        <div className="h-4 w-16 bg-zinc-50 dark:bg-zinc-900 rounded-md" />
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 rounded-2xl border border-zinc-50 dark:border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-1.5 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900" />
              <div className="space-y-2">
                <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
                <div className="h-2 w-48 bg-zinc-50 dark:bg-zinc-900/60 rounded-full" />
              </div>
            </div>
            <div className="h-8 w-16 bg-zinc-50 dark:bg-zinc-900 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SessionWidgetSkelection
