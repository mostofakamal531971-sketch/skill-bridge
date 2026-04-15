"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Quote, Sparkles, CheckCircle2 } from "lucide-react";
import SignUpForm from "@/features/auth/components/signUpForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      {/* --- LEFT SIDE: Branding & Social Proof --- */}
      {/* Hidden on mobile, appearing at lg (1024px) breakpoint */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-zinc-900 p-12 flex-col justify-between overflow-hidden">
        {/* Decorative Blurs */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500 rounded-full blur-[120px]" />
        </div>

        {/* Desktop Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            Learnzilla.
          </Link>
        </div>

        {/* Testimonial Section */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <Quote className="h-10 w-10 text-indigo-500 opacity-50" />
            <h2 className="text-4xl font-black text-white leading-tight lg:text-5xl">
              "This platform changed how I approach learning. I found a mentor in minutes."
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                 <img src="https://i.pravatar.cc/150?u=9" alt="User" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-bold">Alex Rivera</p>
                <p className="text-zinc-500 text-sm font-medium">Senior Developer @ Vercel</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-12 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 text-indigo-500" /> Vetted Tutors
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 text-indigo-500" /> 1-on-1 Sessions
            </div>
          </div>
        </div>

        <div className="relative z-10 text-zinc-500 text-xs font-bold uppercase tracking-widest">
          © 2026 Learnzilla Global Inc.
        </div>
      </div>

      {/* --- RIGHT SIDE: The Form Container --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-5 py-10 sm:px-12 relative overflow-y-auto">
        
        {/* Top Navigation Row (Mobile/Tablet Friendly) */}
        <div className="w-full max-w-[440px] flex items-center justify-between mb-8 lg:justify-start">
          <Link href="/" className="lg:hidden font-black text-xl tracking-tighter text-indigo-600">
            Learnzilla.
          </Link>
          <Link href="/" className="inline-flex items-center text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Back to home</span>
          </Link>
        </div>

        <div className="w-full max-w-[440px] space-y-8">
          {/* Header Text */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Create an account
            </h1>
            <p className="text-zinc-500 font-medium text-sm sm:text-base">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-indigo-600 hover:underline font-bold transition-all">
                Log in
              </Link>
            </p>
          </div>

          {/* Form Component */}
          <div className="relative">
            <SignUpForm />
          </div>

          {/* Footer Terms */}
          <p className="text-center text-[11px] sm:text-xs text-zinc-400 px-4 sm:px-8 leading-relaxed">
            By clicking continue, you agree to our{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-indigo-600 transition-colors">Terms of Service</Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-indigo-600 transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
