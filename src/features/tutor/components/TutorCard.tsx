"use client";

import React from 'react';
import { TutorListItem } from '../types';
import { motion } from "framer-motion";
import { Badge } from '@/components/ui/badge';
import { ArrowRight, GraduationCap, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TutorCard = ({ tutor }: { tutor: TutorListItem }) => {


  return (
    <motion.div 
      layout
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[40px] p-7 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500 flex flex-col justify-between h-full"
    >
      <div className="relative">
      
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col gap-2">
             <div className="h-20 w-20 rounded-[30px] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center font-black text-indigo-600 text-3xl uppercase shadow-inner overflow-hidden border-4 border-white dark:border-zinc-800 ring-1 ring-zinc-100 dark:ring-zinc-800">
              {tutor.profileAvater ? (
                <img src={tutor.profileAvater} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={tutor.name} />
              ) : (
                tutor.name.charAt(0)
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-1">Per Hour</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center justify-end gap-1">
              <span className="text-indigo-600 dark:text-indigo-400">$</span>
              {tutor.tutorProfile.hourlyRate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
           <div className={cn(
             "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-tight",
             tutor.avgRating > 0 ? "bg-amber-400/10 text-amber-600" : "bg-zinc-100 text-zinc-400"
           )}>
             <Star className={cn("w-3.5 h-3.5", tutor.avgRating > 0 && "fill-amber-500")} />
             {tutor.avgRating > 0 ? tutor.avgRating.toFixed(1) : "NEW"}
           </div>
        
        </div>

        <div className="space-y-4 mb-8">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
              {tutor.name}
            </h3>
            <p className="text-[10px] font-black text-zinc-500 flex items-center gap-2 uppercase tracking-[0.15em]">
              <GraduationCap size={14} className="text-indigo-500" /> 
              {tutor.tutorProfile.category || "General Education"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[70px] content-start">
            {tutor.tutorProfile.subjects.slice(0, 3).map((s, idx) => (
              <Badge key={idx} variant="secondary" className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 text-[10px] font-black py-1.5 px-3 border-none uppercase tracking-wider">
                {s}
              </Badge>
            ))}
            {tutor.tutorProfile.subjects.length > 3 && (
              <Badge variant="outline" className="text-[10px] border-zinc-200 dark:border-zinc-800 rounded-xl font-bold px-3">
                +{tutor.tutorProfile.subjects.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* --- CTA BUTTON --- */}
      <Link href={`/tutors/${tutor.id}`} className="block">
        <Button className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] h-14 group/btn transition-all hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white">
          Explore Profile 
          <ArrowRight className="ml-2 group-hover/btn:translate-x-2 transition-transform" size={16} />
        </Button>
      </Link>
    </motion.div>
  );
};

export default TutorCard;
