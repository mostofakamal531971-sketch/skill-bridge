"use client";

import React, { useState, useEffect } from "react";
import { CategoriesSkeleton, HeroSkeleton, StatsSkeleton, TutorSkeleton } from "./Skeletons";
import { StudentStatsSkelection } from "../student-dashboard/components/StudentStats";
import FeaturedTutors from "./FeaturedTutors";
import CTASection from "./CTASection";
import Footer from "@/components/layout/Footer";



const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API Fetch Delay
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
    
      <main>
        {isLoading ? <HeroSkeleton /> : <HeroSkeleton />}
        {isLoading ? <StatsSkeleton /> : <StudentStatsSkelection />}
        {isLoading ? <CategoriesSkeleton /> : <CategoriesSkeleton />}
        {/* <HowItWorks />  */}
        {isLoading ? <TutorSkeleton /> : <FeaturedTutors />}
        {!isLoading && <CTASection />}
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
