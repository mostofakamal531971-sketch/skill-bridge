"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Command, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ToggleTheme from "../shared/toggleTheme";
import ProfileAvater from "@/features/auth/components/ProfileAvater";
import { useAuthHandlers } from "@/features/auth/auth-handler";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/features/auth/services";

const navLinks = [
  { id: 1, name: "Find Tutors", path: "/tutors" },
  { id: 2, name: "Become a Tutor", path: "/sign-up" },
  { id: 3, name: "About Us", path: "/about-us" },
];

export default function Header() {
  const currentPath = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);


const {data,isLoading,isError} = useQuery({
  queryFn:getProfile,
  queryKey:["user-profile"]
})


 
    
    const isSideTrgiggerShow =   currentPath.includes("/dashboard") || currentPath.includes("/tutor/dashboard") || currentPath.includes("/admin")
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/70">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Left Side: Logo & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          {isSideTrgiggerShow && (
            <SidebarTrigger className="h-9 w-9 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900" />
          )}
          
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Command className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Learnzilla
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav 
          className="hidden md:flex items-center gap-1"
          onMouseLeave={() => setHoveredPath(null)}
        >
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.id}
                href={link.path}
                onMouseEnter={() => setHoveredPath(link.path)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors duration-300",
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                )}
              >
                {link.name}
                <AnimatePresence>
                  {hoveredPath === link.path && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 -z-10 rounded-lg bg-zinc-100 dark:bg-zinc-900"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center">
            <ToggleTheme />
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />

          <ProfileAvater data={
            {
              user:data?.user.data,
              isLoading,
            isError}
          } />

          {/* Mobile Menu Drawer */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              {!isSideTrgiggerShow && <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>}
              <SheetContent side="right" className="w-[300px] p-4 sm:w-[400px]">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Command className="h-5 w-5 text-indigo-600" />
                    Learnzilla
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        currentPath === link.path 
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" 
                          : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800 sm:hidden">
                    <div className="flex items-center justify-between px-4">
                      <span className="text-sm text-zinc-500">Theme Mode</span>
                      <ToggleTheme />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
