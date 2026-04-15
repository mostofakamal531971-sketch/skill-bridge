"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-[80]">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className={cn(
              "group relative flex h-12 w-12 items-center justify-center rounded-2xl",
              "bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.4)]",
              "transition-colors hover:bg-indigo-700 focus:outline-none"
            )}
            aria-label="Scroll to top"
          >
            {/* Pulsing Ring Effect */}
            <span className="absolute inset-0 animate-ping rounded-2xl bg-indigo-400/30 group-hover:hidden" />
            
            <ArrowUp className="h-6 w-6 transition-transform group-hover:-translate-y-1" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollToTop;
