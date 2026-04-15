"use client";

import { motion } from "framer-motion";
import { 
  Calendar as CalendarIcon, Clock, Star, 
  CheckCircle2, XCircle, 
  Loader2, ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StudentBooking } from "@/features/tutor/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSessionStatus } from "../services";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
};

export function BookingCard({ session }: { session: StudentBooking }) {
  const queryClient = useQueryClient();

  const sessionStatusMutation = useMutation({
    mutationFn: updateSessionStatus,
    onSuccess: (res) => {
      toast.success(`Session marked as ${res.data.status.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ["tutor-bookings"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update session status");
    }
  });

  const handleSessionStatus = async (tutorId: string, sessionId: string, status: string) => {
    const payload = { body: { tutorId, status }, sessionId };
    await sessionStatusMutation.mutateAsync(payload);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-zinc-100 dark:border-zinc-800/50 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none transition-all rounded-[24px] md:rounded-[32px] bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="p-5 md:p-8 flex flex-col gap-6 md:gap-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row flex-1 items-start sm:items-center gap-4 md:gap-6 w-full">
              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl ring-4 ring-zinc-50 dark:ring-zinc-800/50 shrink-0">
                  <AvatarImage src={session.tutor.user.profileAvater!} className="object-cover" />
                  <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-xs">T</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-[9px] md:text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1">Tutor</p>
                  <h3 className="font-black text-zinc-900 dark:text-zinc-50 truncate tracking-tight text-sm md:text-base">{session.tutor.user.name}</h3>
                </div>
              </div>

              <div className="hidden sm:flex flex-1 justify-center max-w-[40px]">
                <ArrowRight size={16} className="text-zinc-300" />
              </div>

              <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl ring-4 ring-zinc-50 dark:ring-zinc-800/50 shrink-0">
                  <AvatarImage src={session.student.profileAvater} className="object-cover" />
                  <AvatarFallback className="bg-emerald-50 text-emerald-600 font-bold text-xs">S</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Student</p>
                  <h3 className="font-black text-zinc-900 dark:text-zinc-50 truncate tracking-tight text-sm md:text-base">{session.student.name}</h3>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t border-zinc-50 dark:border-zinc-800 md:border-none pt-4 md:pt-0">
               {session.review && (
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-500/20 shrink-0">
                  <Star size={12} className="fill-amber-500 text-amber-500" />
                  <span className="text-[10px] font-black text-amber-700 dark:text-amber-500">{session.review.rating.toFixed(1)}</span>
                </div>
              )}
              <StatusBadge status={session.status} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-6 border-t border-zinc-50 dark:border-zinc-800/50">
            <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-8 w-full lg:w-auto">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest">Date</span>
                <div className="flex items-center gap-2 text-xs md:text-sm font-black italic tracking-tight">
                  <CalendarIcon size={14} className="text-indigo-500 shrink-0" />
                  <span className="truncate">{formatDate(session.availability.date)}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest">Time Slot</span>
                <div className="flex items-center gap-2 text-xs md:text-sm font-black italic tracking-tight">
                  <Clock size={14} className="text-purple-500 shrink-0" />
                  <span className="truncate">{session.availability.startTime} - {session.availability.endTime}</span>
                </div>
              </div>
            </div>

            {session.status === "CONFIRMED" && (
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Button
                  variant="ghost"
                  className="rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 h-11 transition-colors w-full sm:w-auto"
                  onClick={() => handleSessionStatus(session.tutor.id, session.id, "CANCELLED")}
                  disabled={sessionStatusMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-xl md:rounded-2xl h-11 px-6 md:px-8 text-[10px] font-black uppercase tracking-widest bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:scale-[1.02] active:scale-95 transition-all shadow-lg w-full sm:w-auto"
                  onClick={() => handleSessionStatus(session.tutor.id, session.id, "COMPLETED")}
                  disabled={sessionStatusMutation.isPending}
                >
                  {sessionStatusMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark Complete"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: StudentBooking["status"] }) {
  const configs = {
    CONFIRMED: { styles: "bg-blue-500 text-white shadow-blue-500/10", icon: Clock },
    COMPLETED: { styles: "bg-emerald-500 text-white shadow-emerald-500/10", icon: CheckCircle2 },
    CANCELLED: { styles: "bg-zinc-400 text-white shadow-zinc-400/10", icon: XCircle },
    PENDING: { styles: "bg-amber-500 text-white shadow-amber-500/10", icon: Clock },
  };

  const config = configs[status as keyof typeof configs] || configs.PENDING;
  const { styles, icon: Icon } = config;

  return (
    <Badge className={cn(styles, "border-none rounded-full px-3 md:px-4 py-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md shrink-0")}>
      <Icon size={12} strokeWidth={3} /> {status}
    </Badge>
  );
}
