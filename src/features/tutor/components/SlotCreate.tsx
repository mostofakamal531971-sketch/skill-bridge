"use client";

import { addHours, format, isBefore, parse, startOfToday } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar as CalendarIcon, Loader2, Plus, Timer, Trash2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthHandlers } from "@/features/auth/auth-handler";
import { addAvailability } from "@/features/tutor/services";
import { useMutation } from "@tanstack/react-query";

const TIME_OPTIONS = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return {
    value: `${hour.toString().padStart(2, '0')}:${min}`,
    label: `${displayHour}:${min} ${ampm}`
  };
});

export default function CreateAvaliablity() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:30");
  const [error, setError] = useState("");

  const addAvailabilityMutation = useMutation({
    mutationFn:addAvailability
  });




  const validateAndAdd =async () => {
    setError("");
    if (!date) { setError("Please select a date."); return; }
    const start = parse(startTime, "HH:mm", new Date());
    const end = parse(endTime, "HH:mm", new Date());
    if (isBefore(end, addHours(start, 1))) {
      setError("Sessions must be at least 1 hour.");
      return;
    }
    const payload ={
      date,
      startTime: TIME_OPTIONS.find(t => t.value === startTime)?.label,
      endTime: TIME_OPTIONS.find(t => t.value === endTime)?.label,
    }

    const res = await addAvailabilityMutation.mutateAsync(payload)
    
console.log(res);

  
    setIsModalOpen(false);
    setDate(undefined);
  };

  return (
   
<div>
     <button 
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black px-5 py-3 rounded-full hover:opacity-90 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm font-bold">Add Slot</span>
          </button>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)} 
              className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.98 }} 
              className="relative bg-white dark:bg-zinc-950 w-full max-w-sm rounded-[40px] shadow-2xl border border-zinc-100 dark:border-zinc-800 p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">New Session</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                  <X size={20}/>
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest ml-1">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-14 justify-start text-base font-semibold rounded-2xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900">
                        <CalendarIcon className="mr-3 h-4 w-4 text-zinc-400" />
                        {date ? format(date, "PPP") : "Choose date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 rounded-3xl border-none shadow-2xl" align="center">
                      <Calendar mode="single" selected={date} onSelect={setDate} disabled={d => isBefore(d, startOfToday())} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest ml-1">Start</label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger className="h-14 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl shadow-xl">
                        {TIME_OPTIONS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest ml-1">End</label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger className="h-14 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl shadow-xl">
                        {TIME_OPTIONS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-[11px] font-bold bg-red-50 dark:bg-red-500/10 p-3 rounded-xl text-center">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <Button onClick={validateAndAdd} className="w-full h-14 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black rounded-2xl font-bold transition-all shadow-lg active:scale-[0.97]">
                 { addAvailabilityMutation.isPending ? "Creating Slot" : "Create Slot"} {addAvailabilityMutation.isPending && <Loader2 className="animate-spin ml-2"/>}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
