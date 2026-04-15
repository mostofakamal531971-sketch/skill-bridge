"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BookOpen, Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin, MessageCircle,
  ShieldCheck,
  Star
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBooking } from "../student-dashboard/services";
import { toast } from "sonner";

// --- Types ---
interface TutorProfileProps {
  data: any;
  student: {
    role: string
    id: string
  }
}

export default function PublicTutorProfile({ data: initialData, student }: TutorProfileProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState<"SELECT" | "SUCCESS">("SELECT");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState<string | null>(null);
  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (res) => {
      const checkoutUrl = res?.data?.checkoutUrl as string | undefined;
      if (checkoutUrl) {
        toast.success("Redirecting to secure checkout…");
        window.location.assign(checkoutUrl);
        return;
      }
      setBookingStep("SUCCESS");
      toast.success(res?.data?.message || res?.message || "Booking created");
    },
  });
  useEffect(() => {
    if (initialData) {
      const timer = setTimeout(() => setIsLoading(false), 100);
      console.log(initialData);

      return () => clearTimeout(timer);
    }
  }, [initialData]);

  if (isLoading) return <ProfileSkeleton />;

  const { tutor, reviews } = initialData;
  const avgRating = reviews.reduce((acc: any, rev: any) => acc + rev.rating, 0) / reviews.length || 0;



  // --- Booking Simulation ---
  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;


    const payload = {
      tutorId: tutor.id,
      availabilityId: selectedSlot,
    };
    await bookingMutation.mutateAsync(payload);

  };

  // বুকিং বাটন রেন্ডার করার লজিক (Role based)
  const renderBookButton = (className?: string) => {
    if (student.role !== "STUDENT" && student.role !== "USER") {
      return (
        <div className="space-y-2">
          <Button disabled className={cn("w-full opacity-50 cursor-not-allowed", className)}>
            Book Appointment <ArrowRight className="ml-2" />
          </Button>
          <p className="text-[10px] text-center font-bold text-indigo-200 uppercase tracking-tighter italic">
            Login as a Student to Book
          </p>
        </div>
      );
    }

    return (
      <Dialog onOpenChange={(open) => !open && setBookingStep("SELECT")}>
        <DialogTrigger asChild>
          <Button className={cn("group transition-all", className)}>
            Book Appointment <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
          <BookingModalContent
            tutor={tutor}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            isBooking={bookingMutation.isPending}
            step={bookingStep}
            onConfirm={handleConfirmBooking}
            setDateTime={setDateTime}
          />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-[#09090b] pb-20">
      {/* 1. Hero Section */}

      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <Avatar className="h-32 w-32 border-4 border-indigo-500/10 shadow-xl">
                <AvatarFallback className="text-3xl font-black bg-indigo-50 text-indigo-600">
                  {tutor.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black tracking-tighter">{tutor.user.name}</h1>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none flex gap-1 items-center font-bold">
                  <BadgeCheck size={14} /> Verified Tutor
                </Badge>
              </div>

              <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl font-medium leading-relaxed italic">
                {tutor.bio || "No bio available."}
              </p>

              <div className="flex flex-wrap gap-6 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={18} />
                  {avgRating.toFixed(1)} ({reviews.length} Reviews)
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-indigo-500" size={18} /> {tutor.category}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-indigo-500" size={18} /> {tutor.hourlyRate} USD / Hr
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              {renderBookButton("bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-8 font-black h-12")}
              <Button variant="outline" size="lg" className="rounded-2xl border-zinc-200 font-bold h-12">
                <MessageCircle className="mr-2" size={18} /> Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <BookOpen className="text-indigo-600" size={20} /> Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects.map((sub: string) => (
                <Badge key={sub} variant="secondary" className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-bold shadow-sm">
                  {sub}
                </Badge>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Calendar className="text-indigo-600" size={20} /> Availability Slots
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tutor.availability.map((slot: any) => (
                <Card key={slot.id} className={cn(
                  "border-none shadow-sm rounded-3xl transition-all",
                  slot.isBooked ? "opacity-60 bg-zinc-100" : "bg-indigo-50/50 border border-indigo-100"
                )}>
                  <CardContent className="p-5 flex justify-between items-center">
                    <div>
                      <p className="font-black text-zinc-900">{format(new Date(slot.date), "EEEE, MMM d")}</p>
                      <p className="text-sm font-bold text-indigo-600">{slot.startTime} - {slot.endTime}</p>
                    </div>
                    <Badge className={slot.isBooked ? "bg-zinc-200 text-zinc-500" : "bg-indigo-600"}>
                      {slot.isBooked ? "Reserved" : "Available"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Feedback Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Star className="text-indigo-600" size={20} /> Student Feedback
            </h3>
            <div className="space-y-4">
              {reviews.map((rev: any) => (
                <div key={rev.id} className="p-6 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800">
                  <div className="flex justify-between mb-4">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-black">
                        {rev.student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{rev.student.name}</p>
                        <p className="text-[10px] uppercase font-black text-zinc-400">Verified Student</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={cn(i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-200")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 italic font-medium">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-[40px] border-none shadow-2xl shadow-indigo-500/10 bg-indigo-600 p-8 text-white sticky top-10 overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-indigo-100 text-sm font-bold opacity-80 uppercase tracking-widest">Rate Per Hour</p>
                <h2 className="text-5xl font-black">{tutor.hourlyRate} <span className="text-xl font-bold">USD</span></h2>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-bold">
                  <ShieldCheck className="text-indigo-300" /> Secure Payment
                </li>
                <li className="flex items-center gap-3 text-sm font-bold">
                  <Clock className="text-indigo-300" /> Instant Confirmation
                </li>
              </ul>

              {renderBookButton("w-full bg-white text-indigo-600 hover:bg-zinc-100 h-14 rounded-2xl font-black text-lg shadow-xl")}
            </div>
            {/* Background design element */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Sub Component: Booking Modal Content ---

const BookingModalContent = ({ tutor, selectedSlot, setDateTime, setSelectedSlot, isBooking, step, onConfirm }: any) => {

  const router = useRouter()
  if (step === "SUCCESS") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 text-center flex flex-col items-center gap-4">
        <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="text-emerald-500" size={44} />
        </div>
        <h2 className="text-2xl font-black tracking-tight">Booking Successful!</h2>
        <p className="text-zinc-500 font-medium text-sm leading-relaxed px-4">
          Your session with <b>{tutor.user.name}</b> has been scheduled. Check your dashboard for details.
        </p>
        <Button className="mt-4 w-full rounded-2xl h-12 font-bold" variant="outline" onClick={() => router.push("/dashboard/bookings")}>
          View Booking
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="p-8 bg-zinc-900 text-white relative">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">Schedule Session</DialogTitle>
          <p className="text-zinc-400 text-sm font-medium">Select an available time slot below</p>
        </DialogHeader>
      </div>

      <div className="p-6 max-h-[350px] overflow-y-auto space-y-3 bg-zinc-50/50">
        {tutor.availability.length > 0 ? (
          tutor.availability.map((slot: any) => (
            <button
              key={slot.id}
              disabled={slot.isBooked}
              onClick={() => {
                setSelectedSlot(slot.id)
                setDateTime(`${slot.startTime}-${slot.endTime}`)
              }}
              className={cn(
                "w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all duration-200",
                slot.isBooked ? "bg-zinc-100 border-zinc-100 opacity-40 cursor-not-allowed" :
                  selectedSlot === slot.id ? "border-indigo-600 bg-indigo-50/80 shadow-md" : "border-white bg-white hover:border-indigo-200 shadow-sm"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-xl", selectedSlot === slot.id ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-500")}>
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="font-black text-zinc-900 text-sm">{format(new Date(slot.date), "EEE, MMM d")}</p>
                  <p className="text-xs font-bold text-indigo-600">{slot.startTime} - {slot.endTime}</p>
                </div>
              </div>
              {selectedSlot === slot.id && <CheckCircle2 className="text-indigo-600" size={20} />}
            </button>
          ))
        ) : (
          <div className="text-center py-10">
            <AlertCircle className="mx-auto text-zinc-300 mb-2" size={32} />
            <p className="text-zinc-500 font-bold">No slots available</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t bg-white space-y-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Fee per hour</span>
          <span className="text-2xl font-black text-zinc-900">{tutor.hourlyRate} USD</span>
        </div>
        <Button
          onClick={onConfirm}
          disabled={!selectedSlot || isBooking || !tutor.availability.filter((item:any) => item.isBooked !== true).length }
          className="w-full h-14 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-none"
        >
         
          {isBooking ? <Loader2 className="animate-spin" /> : "Confirm & Book"}
        </Button>
      </div>
    </div>
  );
};

// --- Skeleton Component ---
const ProfileSkeleton = () => (
  <div className="max-w-6xl mx-auto px-6 py-20 space-y-12 animate-pulse">
    <div className="flex gap-8 items-center">
      <div className="h-32 w-32 bg-zinc-200 rounded-full" />
      <div className="space-y-4 flex-1">
        <div className="h-10 w-1/3 bg-zinc-200 rounded-xl" />
        <div className="h-6 w-1/2 bg-zinc-200 rounded-lg" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-10">
      <div className="col-span-2 h-96 bg-zinc-200 rounded-[40px]" />
      <div className="h-96 bg-zinc-200 rounded-[40px]" />
    </div>
  </div>
);
