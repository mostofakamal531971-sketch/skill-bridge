"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

const LOADING_MESSAGES = [
  "Connecting you with expert tutors…",
  "Preparing your dashboard…",
  "Syncing sessions and bookings…",
  "Almost ready…",
] as const;

const LOGO = {
  dark: "https://res.cloudinary.com/drngnsgwy/image/upload/v1774239280/blitz-analyzer/images/logos/dark-logo_b9ypum.svg",
  light:
    "https://res.cloudinary.com/drngnsgwy/image/upload/v1774239281/blitz-analyzer/images/logos/light-logo_jvaomw.svg",
} as const;

export default function AppLoader() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  const logoUrl = useMemo(() => {
    if (!mounted) return null;
    return resolvedTheme === "light" ? LOGO.light : LOGO.dark;
  }, [mounted, resolvedTheme]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/3 left-1/2 h-[min(70vh,520px)] w-[min(140vw,900px)] -translate-x-1/2 rounded-full bg-primary/[0.12] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[45vh] w-[70vw] translate-x-1/4 translate-y-1/4 rounded-full bg-accent/[0.08] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-8 px-6"
      >
        <div className="relative flex flex-col items-center gap-5">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-1 rounded-full border-2 border-transparent border-t-primary border-r-accent/80"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.35, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
              animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.92, 1.05, 0.92] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 ring-1 ring-white/10"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <GraduationCap className="h-7 w-7 text-primary-foreground" strokeWidth={1.75} />
            </motion.div>
          </div>

          <div className="flex min-h-[2.25rem] flex-col items-center gap-2 text-center">
            {mounted && logoUrl ? (
              <img
                src={logoUrl}
                alt="Learnzilla"
                className="h-8 w-auto max-w-[200px] object-contain select-none"
                draggable={false}
              />
            ) : (
              <span className="text-xl font-semibold tracking-tight text-foreground">
                Learnzilla
              </span>
            )}
            <div className="h-5 w-full max-w-[280px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22 }}
                  className="text-sm text-muted-foreground"
                >
                  {LOADING_MESSAGES[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.16,
                ease: "easeInOut",
              }}
              className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-primary to-accent"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

