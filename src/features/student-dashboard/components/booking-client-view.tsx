"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, ShieldCheck, 
  Star, CheckCircle2, ChevronLeft, X, MessageSquare, 
  ArrowRight, MapPin, BadgeCheck
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createReview } from "../services";

export default function BookingClientView({ booking }: { booking: any }) {
  console.log(booking);
  
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      toast.success("Review submitted successfully");
      setIsReviewOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit review");
    }
  });

  const tutor = booking.data.tutorProfile || booking.data.availability?.tutor;
  const student = booking.data.student;
  const review = booking.data.review;
  const sessionDate = new Date(booking.data.dateTime);

  const handleCreateReview = async () => {
    if (rating === 0) return toast.error("Please select a rating");
    const payload = {
      rating,
      comment,
      bookingId: booking.data.id,
      studentId: student.id,
      tutorId: booking.data.tutorId,
    };
    await reviewMutation.mutateAsync(payload);
  };

  console.log(booking);
  
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans antialiased">
      {/* --- HEADER --- */}
      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/bookings">
            <Button variant="outline" size="icon" className="rounded-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Transaction #{booking.data.id.slice(0, 8)}</p>
            <h1 className="text-xl font-black tracking-tight uppercase">Booking Portal</h1>
          </div>
        </div>
        <Badge className={cn(
          "rounded-xl px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-none shadow-sm",
          booking.data.status === "COMPLETED" ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"
        )}>
          {booking.data.status}
        </Badge>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            {/* --- CONNECTION CARD --- */}
            <Card className="p-8 md:p-10 border-none bg-white dark:bg-zinc-900 rounded-[40px] shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                        <div className="w-24 h-24 rounded-[32px] ring-8 ring-zinc-50 dark:ring-zinc-800/50 overflow-hidden shadow-inner bg-zinc-100">
                            <img src={tutor?.user.profileAvater!} className="w-full h-full object-cover" alt="Tutor" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Expert Tutor</p>
                            <h3 className="text-xl font-black">{tutor?.user.name}</h3>
                            <p className="text-xs font-bold text-zinc-400">{tutor?.category}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300">
                            <ArrowRight className="animate-pulse" />
                        </div>
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent my-2" />
                    </div>

                    <div className="flex flex-col items-center md:items-end text-center md:text-right gap-4">
                        <div className="w-24 h-24 rounded-[32px] ring-8 ring-zinc-50 dark:ring-zinc-800/50 overflow-hidden shadow-inner bg-zinc-100">
                            <img src={student?.profileAvater} className="w-full h-full object-cover" alt="Student" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Verified Student</p>
                            <h3 className="text-xl font-black">{student?.name}</h3>
                            <p className="text-xs font-bold text-zinc-400 flex items-center gap-1 justify-center md:justify-end">
                                <MapPin size={12} /> {student?.location || "Global"}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* --- SESSION DETAILS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="p-8 rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Scheduled Date</p>
                        <p className="text-lg font-black">{format(sessionDate, "MMMM dd, yyyy")}</p>
                    </div>
                </section>

                <section className="p-8 rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Time Window</p>
                        <p className="text-lg font-black">{booking.data.availability?.startTime} — {booking.data.availability?.endTime}</p>
                    </div>
                </section>
            </div>

            {/* --- REVIEW DISPLAY --- */}
            {review && (
              <section className="space-y-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Client Feedback</h3>
                    <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <Card className="p-8 border-none rounded-[32px] bg-indigo-600 text-white shadow-xl shadow-indigo-500/20">
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} className={cn(i < review.rating ? "fill-amber-400 text-amber-400" : "text-indigo-400")} />
                            ))}
                        </div>
                        <BadgeCheck className="text-indigo-200" />
                    </div>
                    <p className="text-xl font-medium italic leading-relaxed">
                      "{review.comment || "The student left a perfect rating without a written comment."}"
                    </p>
                  </div>
                </Card>
              </section>
            )}
          </div>

          {/* --- SIDEBAR --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <Card className="p-8 border-none bg-zinc-900 dark:bg-white dark:text-zinc-950 text-white rounded-[40px] shadow-2xl space-y-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Investment</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{tutor?.hourlyRate || 0}</span>
                    <span className="text-sm font-bold opacity-60">/ session</span>
                  </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-bold opacity-80">
                        <ShieldCheck size={16} className="text-emerald-500" /> Secure Payment Processed
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold opacity-80">
                        <BadgeCheck size={16} className="text-emerald-500" /> Session Insurance Active
                    </div>
                </div>
                
                {booking.data.status === "COMPLETED" && !review && (
                    <Button 
                      onClick={() => setIsReviewOpen(true)}
                      className="w-full h-16 rounded-[24px] font-black uppercase text-[10px] tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white border-none transition-all active:scale-95"
                    >
                      <Star className="mr-2 fill-white" size={16} /> Submit Feedback
                    </Button>
                )}
              </Card>

              <div className="p-6 rounded-[32px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-2">
                <p className="text-xs font-bold text-zinc-400">Need assistance with this booking?</p>
                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:underline">Contact Support</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- REVIEW MODAL --- */}
      <AnimatePresence>
        {isReviewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[48px] p-10 shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
              <button onClick={() => setIsReviewOpen(false)} className="absolute top-8 right-8 p-3 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">
                <X size={20} />
              </button>

              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tight uppercase">Rate Session</h3>
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Share your experience with {tutor?.name}</p>
                </div>

                <div className="flex justify-between px-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="group relative">
                      <Star 
                        size={48} 
                        className={cn(
                            "transition-all duration-300", 
                            rating >= star ? "fill-amber-400 text-amber-400 scale-110" : "text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-300"
                        )} 
                      />
                      {rating === star && (
                          <motion.div layoutId="glow" className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <textarea 
                    onChange={(e) => setComment(e.target.value)} 
                    placeholder="Tell us about the teaching style, clarity, and overall vibe..." 
                    className="w-full h-40 p-6 rounded-[32px] bg-zinc-50 dark:bg-zinc-800/50 border-none outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none transition-all font-medium" 
                  />
                  <Button 
                    disabled={reviewMutation.isPending || rating === 0}
                    className="w-full h-16 rounded-[24px] bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all active:scale-95" 
                    onClick={handleCreateReview}
                  >
                    {reviewMutation.isPending ? "Syncing..." : "Publish Review"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
