"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiQuery } from "@/hooks/useApiQuery";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Internal Skeleton Component ---
const CategoriesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="p-8 bg-card/50 rounded-[32px] border border-border animate-pulse">
        <div className="w-12 h-12 bg-muted rounded-2xl mb-6" />
        <div className="h-6 w-3/4 bg-muted rounded-md mb-3" />
        <div className="h-4 w-1/2 bg-muted/60 rounded-md" />
      </div>
    ))}
  </div>
);

const Categories = () => {
  const { data: categories, isLoading } = useApiQuery<{
    data: {
      id: string;
      name: string;
      subjects: string[];
    }[];
  }>(["fetch-categories"], "/api/shared/categories", {
    staleTime: 60000,
  });

  const categoryList = categories?.data || [];


  return (
    <section className="py-24 bg-muted/30 dark:bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-16 gap-6">
          <div className="text-center sm:text-left">
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-600 border-none font-bold">
              Explore Categories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Master Any Subject
            </h2>
            <p className="text-muted-foreground font-medium text-lg">
              Find specialized experts across {categoryList.length || 'dozens of'} fields.
            </p>
          </div>
          <Button 
          asChild
            variant="ghost" 
            className="font-black text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 p-4 rounded-2xl text-lg transition-all"
          >
          <Link href={"/tutors"}>
            View All <ArrowRight className="ml-2" size={20} /></Link>
          </Button>
        </div>

        {/* Dynamic Content Area */}
        {isLoading ? (
          <CategoriesSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {categoryList.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="p-8 bg-card rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm cursor-pointer group hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300"
                >
                 <Link href={`/tutors?category=${cat.id}`}>
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl mb-8 flex items-center justify-center text-indigo-600 group-hover:bg-white/20 group-hover:text-white transition-all">
                    {/* Using Box icon as a fallback, you could map specific icons to category names */}
                    <Box size={28} strokeWidth={2.5} />
                  </div>
                  
                  <h3 className="font-black text-2xl group-hover:text-white tracking-tight mb-2">
                    {cat.name}
                  </h3>
                  
                  <p className="text-muted-foreground font-bold text-sm group-hover:text-indigo-100 transition-colors uppercase tracking-widest">
                    {cat.subjects?.length || 0} Specialized Courses
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-indigo-600 group-hover:text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    Explore <ArrowRight size={16} />
                  </div>
                 </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

// Supporting Badge component if not already imported
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.15em]", className)}>
    {children}
  </span>
);

export default Categories;
