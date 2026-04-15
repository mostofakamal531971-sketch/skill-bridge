import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, DollarSign, BookOpen, 
  UserCheck, MoreVertical, Trash2, ExternalLink, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMutation } from '@tanstack/react-query';
import { httpRequest } from '@/config/axios/axios';
import axios from 'axios';
import { cencelBooking } from '../services';

export const BookingCard = ({ booking }: { booking: any }) => {
  const { tutor, dateTime, status, id } = booking;
  const tutorUser = tutor.user;
 
   const updateCategoryMutation = useMutation({
    mutationFn:(data:{
      body:{
        status:string
      }
      bookingId:string
    })  => cencelBooking(data),
    onSuccess: () => {
     
       toast.success("Booking cancelled", { id });
    
    },
    onError: (e) => {
      toast.error("Failed to cancel booking")


    },
  });

  


  const handleCancelBooking = async () => {
    const payload = {
      body:{
            status:"CANCELLED"
      },bookingId:id
    }
  await updateCategoryMutation.mutateAsync(payload)
    
  };

  const eventDate = new Date(dateTime).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative group overflow-hidden transition-all duration-300",
        "rounded-[2rem] p-6 shadow-xl",
        // Light Mode: Soft white glass, subtle border
        "bg-white/70 backdrop-blur-md border border-zinc-200/50 shadow-zinc-200/50",
        // Dark Mode: Deep zinc glass, sharper border
        "dark:bg-zinc-900/50 dark:border-white/10 dark:shadow-none dark:hover:border-cyan-500/30"
      )}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start mb-6">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
          status === 'CONFIRMED'
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
            : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
        )}>
          <span className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            status === 'CONFIRMED' ? "bg-emerald-500" : "bg-amber-500"
          )} />
          {status}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10">
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl">
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-zinc-100 dark:focus:bg-white/5 py-2.5">
              <Link href={`/dashboard/bookings/${id}`} className="flex items-center gap-2 font-medium">
                <ExternalLink size={16} className="text-blue-500" /> View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleCancelBooking}
              disabled={ status === "COMPLETED" || updateCategoryMutation.isSuccess || status === 'CANCELLED'}
              className="rounded-xl cursor-pointer focus:bg-red-50 dark:focus:bg-red-500/10 py-2.5 text-red-600 dark:text-red-400 font-medium"
            >
              {updateCategoryMutation.isSuccess ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Cancel Booking
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tutor Profile */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20">
            <div className="w-full h-full rounded-[14px] bg-white dark:bg-zinc-950 overflow-hidden">
              {tutorUser.profileAvater ? (
                <img src={tutorUser.profileAvater} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-zinc-400">{tutorUser.name[0]}</div>
              )}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg ring-2 ring-white dark:ring-zinc-900">
            <UserCheck size={10} />
          </div>
        </div>

        <div className="overflow-hidden">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white truncate">
            {tutorUser.name}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs flex items-center gap-1.5 truncate">
            <BookOpen size={12} className="text-cyan-500" />
            {tutor.subjects[0]} • {tutor.category}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-100 dark:border-white/5 mb-6">
        <div className="space-y-1">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter font-bold">Schedule</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <Calendar size={14} className="text-blue-500" />
            {eventDate}
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter font-bold">Hourly Rate</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <DollarSign size={14} className="text-emerald-500" />
            <span className="font-mono">{tutor.hourlyRate}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">ID: #{id.slice(0, 6)}</span>
        <div className="flex gap-2">
          <Button asChild size="sm" className="h-9 px-4 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all font-bold text-xs">
            <Link href={`/dashboard/bookings/${id}`}>View Details</Link>
          </Button>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />
    </motion.div>
  );
};
