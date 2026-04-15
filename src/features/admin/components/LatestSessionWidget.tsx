import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Clock, Circle } from 'lucide-react';
import React from 'react';
import { getLatestBooking } from '../services';

const LatestSessionWidget = async () => {
  const latestSessions = await getLatestBooking();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'COMPLETED': 
        return { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' };
      case 'CANCELLED': 
        return { dot: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' };
      case 'PENDING': 
        return { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' };
      default: 
        return { dot: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' };
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-[32px] border border-zinc-100 dark:border-zinc-900 p-8 shadow-sm h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Recent Activity</h3>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Live Feed</p>
        </div>
        <Button variant="outline" className="text-[10px] h-8 font-bold uppercase tracking-widest border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900">
          History
        </Button>
      </div>

      <div className="space-y-3">
        {latestSessions?.map((session: any) => {
          const style = getStatusStyles(session.status);
          return (
            <div key={session.id} className="p-4 rounded-[24px] bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 transition-all group">
              <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-xs uppercase">
                        {session.tutor?.category?.charAt(0) || 'S'}
                    </div>
                </div>
                
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 leading-none mb-1.5">
                    {session.tutor?.category || "General Session"}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium uppercase tracking-tight">
                    <span className="text-zinc-500 dark:text-zinc-400">{session.student?.name}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="flex items-center gap-1"><Clock size={10} /> {session.availability?.startTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={cn("hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-transparent transition-colors", style.bg, style.text)}>
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", style.dot)} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{session.status}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LatestSessionWidget;
