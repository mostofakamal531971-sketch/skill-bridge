"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Command, ShieldCheck } from "lucide-react";

const LOADING_MESSAGES = [
  "Building your bridge...",
  "Securing connection...",
  "Optimizing your path...",
  "Verifying identity...",
];

export const LearnzillaLoader = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/70 dark:bg-zinc-950/80 backdrop-blur-2xl"
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05] 
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Main Icon Squircle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative z-10 w-24 h-24 bg-indigo-600 dark:bg-indigo-500 rounded-[32px] flex items-center justify-center shadow-[0_20px_50px_rgba(79,70,229,0.3)] dark:shadow-[0_20px_50px_rgba(79,70,229,0.15)]"
        >
          <Command className="text-white w-12 h-12" />
          
          {/* Floating Accents */}
          <motion.div 
            animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-4 p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-800"
          >
            <Sparkles className="text-amber-500 w-4 h-4 fill-amber-500" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-2 -left-6 p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-800"
          >
            <ShieldCheck className="text-emerald-500 w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* The "Bridge" Progress Bar */}
        <div className="mt-16 w-64 h-1.5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full overflow-hidden relative border border-zinc-100 dark:border-zinc-900">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
          />
        </div>

        {/* Textual Feedback */}
        <div className="mt-10 text-center h-12">
          <motion.h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">
            Learnzilla
          </motion.h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400 mt-2"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
