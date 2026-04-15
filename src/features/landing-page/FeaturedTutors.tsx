"use client";

import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/useApiQuery";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import FeaturedTutorSkelection from "../public-pages/FeaturedTutorSkelection";

interface TutorListItem {
  id: string;
  name: string;
  email: string;
  profileAvater: string | null;
  role: string;
  status: string;
  createdAt: string;
  tutorProfile: {
    hourlyRate: number;
    subjects: string[];
    category: string;
  };
}



const FeaturedTutors = () => {
  const { data: tutorResponse, isLoading } = useApiQuery<{ data: TutorListItem[] }>(
    ["tutors"],
    "/api/tutors"
  );

  // Take only the first 3 tutors
  const tutors = tutorResponse?.data?.slice(0, 3) || [];

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          Featured Experts
        </h2>
        <p className="text-muted-foreground font-medium text-lg max-w-xl">
          Learn from industry leaders and academic experts vetted for quality and experience.
        </p>
      </div>

      {isLoading ? (
        <FeaturedTutorSkelection />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence>
            {tutors.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card border border-zinc-100 dark:border-zinc-900 p-4 rounded-[40px] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
              >
                {/* Avatar / Image Container */}
                <div className="aspect-[4/3] rounded-[32px] overflow-hidden mb-6 relative">
                  <img
                    src={t.profileAvater || `https://i.pravatar.cc/400?u=${t.id}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={t.name}
                  />
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="font-black text-sm">4.9</span>
                  </div>
                  {t.status === "ACTIVE" && (
                    <div className="absolute bottom-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
                      <CheckCircle2 size={12} /> Online
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="px-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-2xl font-black tracking-tight group-hover:text-indigo-600 transition-colors">
                      {t.name}
                    </h3>
                  </div>
                  
                  <p className="text-indigo-600 font-bold text-sm mb-4 uppercase tracking-wide italic">
                    {t.tutorProfile?.category || "Expert Tutor"}
                  </p>

                  {/* Subjects Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {t.tutorProfile?.subjects?.slice(0, 2).map((sub) => (
                      <span key={sub} className="px-3 py-1 bg-muted rounded-lg text-xs font-bold text-muted-foreground">
                        {sub}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-zinc-50 dark:border-zinc-900">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Rate</p>
                      <p className="font-black text-2xl tracking-tight">
                        $ {t.tutorProfile?.hourlyRate}
                        <span className="text-muted-foreground text-xs font-medium">/hr</span>
                      </p>
                    </div>
                    <Button  asChild className="rounded-2xl h-12 px-6 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white font-black hover:bg-indigo-600 hover:text-white transition-all duration-300">
                 <Link href={`/tutors/${t.id}`}>
                      Book Now
                 </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default FeaturedTutors;
