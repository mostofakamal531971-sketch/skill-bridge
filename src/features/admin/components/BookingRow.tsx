import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, Clock, MoreHorizontal, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const BookingRow = ({ session }: { session: any }) => {
  return (
    <tr className="group hover:bg-zinc-50/80 dark:hover:bg-indigo-500/[0.02] transition-colors">
      {/* Tutor Profile */}
      <td className="px-8 py-6">
        <Link href={`/tutors/${session.tutor?.id}`} className="inline-flex items-center gap-4 group/tutor">
          <div className="relative">
            <div className="w-14 h-14 rounded-[20px] bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center overflow-hidden">
               {session.tutor?.user.image ? (
                  <img src={session.tutor.user.image} className="w-full h-full object-cover" alt="" />
               ) : (
                  <span className="text-white dark:text-zinc-900 font-bold text-xl">{session.tutor?.user.name[0]}</span>
               )}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
          </div>
          <div>
            <p className="font-black text-zinc-900 dark:text-zinc-100 group-hover/tutor:text-indigo-600 transition-colors">
              {session.tutor?.user.name}
            </p>
            <div className="flex items-center gap-1">
               <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">
                {session.tutor?.subjects?.[0]}
              </span>
              <CheckCircle2 size={10} className="text-indigo-400" />
            </div>
          </div>
        </Link>
      </td>

      {/* Student Profile */}
      <td className="px-8 py-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-white dark:border-zinc-700 overflow-hidden shrink-0">
              <img src={session.student?.profileAvater} className="w-full h-full object-cover" alt="" />
            </div>
            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              {session.student?.name}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium mt-1 ml-8">
            {session.student?.email}
          </span>
        </div>
      </td>

      {/* Schedule Info */}
      <td className="px-8 py-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
            <Calendar size={14} className="text-indigo-500" />
            {format(new Date(session.dateTime), "eee, MMM dd")}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
            <Clock size={12} />
            {session.availability?.startTime} — {session.availability?.endTime}
          </div>
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-8 py-6 text-center">
        <div className={cn(
          "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.05em] uppercase border",
          session.status === "COMPLETED" && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20",
          session.status === "PENDING" && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20",
          session.status === "CANCELLED" && "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20"
        )}>
          <span className={cn(
            "w-1.5 h-1.5 rounded-full mr-2 animate-pulse",
            session.status === "COMPLETED" ? "bg-emerald-500" : session.status === "PENDING" ? "bg-amber-500" : "bg-rose-500"
          )} />
          {session.status}
        </div>
      </td>

      {/* Pricing */}
      <td className="px-8 py-6 text-right font-mono font-bold text-lg tracking-tighter text-zinc-900 dark:text-zinc-100">
        <span className="text-zinc-400 text-xs mr-1">৳</span>
        {session.tutor?.hourlyRate}
      </td>

     
    </tr>
  );
};

export default BookingRow;
