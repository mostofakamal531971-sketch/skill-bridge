"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Sparkles, ShieldCheck, Zap, Fingerprint } from "lucide-react";
import { SignInForm } from "@/features/auth/components/signInForm";


export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      
      {/* --- LEFT SIDE: Branding & Trust Signals (Desktop Only) --- */}
{/* --- LEFT SIDE: Modern Bento/Glassmorphism Section --- */}
<div className="relative hidden lg:flex lg:w-1/2 bg-[#09090b] p-16 flex-col justify-between overflow-hidden">
  
  {/* Modern Ambient Background */}
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[140px]" />
    <div className="absolute bottom-[-10%] right-[0%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
  </div>

  {/* Top Section: Logo */}
  <div className="relative z-10">
    <Link href="/" className="flex items-center gap-3 text-white font-black text-2xl tracking-tighter">
      <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <span>Learnzilla</span>
    </Link>
  </div>

  {/* Middle Section: Floating UI Feature Cards */}
  <div className="relative z-10 space-y-6">
    <div className="space-y-2">
      <span className="text-indigo-400 text-sm font-bold tracking-widest uppercase">Platform Core</span>
      <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
        Master new skills <br />
        <span className="text-zinc-500">without the friction.</span>
      </h2>
    </div>

    <div className="grid gap-4 mt-12">
      {/* Feature Card 1 */}
      <div className="group p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-white font-bold">Lightning Fast Matching</h4>
            <p className="text-zinc-400 text-sm">Find the perfect tutor in under 60 seconds.</p>
          </div>
        </div>
      </div>

      {/* Feature Card 2 */}
      <div className="group p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 ml-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-white font-bold">Verified Learning</h4>
            <p className="text-zinc-400 text-sm">100% money-back guarantee on all sessions.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Bottom Section: Modern Footer Info */}
  <div className="relative z-10 flex items-center justify-between">
    <div className="flex -space-x-3">
      {[1, 2, 3, 4].map((i) => (
        <img 
          key={i}
          className="h-10 w-10 rounded-full border-2 border-[#09090b] bg-zinc-800"
          src={`https://i.pravatar.cc/100?img=${i + 10}`}
          alt="User"
        />
      ))}
      <div className="h-10 w-10 rounded-full border-2 border-[#09090b] bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
        +2k
      </div>
    </div>
    <p className="text-zinc-500 text-xs font-medium">Joined by 20,000+ students globally</p>
  </div>
</div>

      {/* --- RIGHT SIDE: Login Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 relative">
        
        {/* Mobile Nav Header */}
        <div className="w-full max-w-[400px] flex items-center justify-between mb-12 lg:mb-16">
          <Link href="/" className="lg:hidden font-black text-xl tracking-tighter text-indigo-600">
            Learnzilla.
          </Link>
          <Link href="/" className="inline-flex items-center text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
              Sign in
            </h1>
            <p className="text-zinc-500 font-medium">
              New here?{" "}
              <Link href="/sign-up" className="text-indigo-600 hover:underline font-bold">
                Create a free account
              </Link>
            </p>
          </div>

    
          <SignInForm />

        

         
        </div>
      </div>
    </div>
  );
}
