"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Eye, EyeOff, Loader2, KeyRound, Sparkles, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/features/student-dashboard/services";

export default function ChangePasswordPage() {
  const [showPass, setShowPass] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Security credentials updated!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const isMatch = passwords.newPassword === passwords.confirmPassword;
  const isValidLength = passwords.newPassword.length >= 6;
  const canSubmit = passwords.currentPassword && isMatch && isValidLength;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords((p) => ({ ...p, [e.target.id]: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    mutate({
      oldPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
  };

  return (
    // Responsive outer padding: p-4 for mobile, p-8 for desktop
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-none rounded-2xl md:rounded-3xl overflow-hidden">
          <CardHeader className="pt-6 pb-4 px-5 sm:px-8 space-y-1 border-b border-zinc-100 dark:border-zinc-900 mb-4 md:mb-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                <KeyRound className="text-indigo-600 dark:text-indigo-400 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <CardTitle className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Authentication
                </CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400 text-[10px] md:text-xs">
                  Update your security settings
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={onSubmit}>
            {/* Adjusted padding for mobile: px-5 */}
            <CardContent className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5 md:space-y-6">
              
              {/* Current Password */}
              <div className="space-y-1.5">
                <Label className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold ml-1">
                  Current Password
                </Label>
                <div className="relative group">
                  <Input
                    id="currentPassword"
                    type={showPass ? "text" : "password"}
                    value={passwords.currentPassword}
                    onChange={handleChange}
                    className="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 pl-10 h-11 md:h-12 rounded-xl focus-visible:ring-indigo-500 transition-all placeholder:text-zinc-400 text-sm md:text-base"
                    placeholder="Current password"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                </div>
              </div>

              {/* Password Grid: Stacks on mobile, Side-by-side on md+ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-1.5">
                  <Label className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold ml-1">
                    New Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="newPassword"
                      type={showPass ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={handleChange}
                      className="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 pl-10 h-11 md:h-12 rounded-xl focus-visible:ring-indigo-500 transition-all placeholder:text-zinc-400 text-sm md:text-base"
                      placeholder="Min. 6 chars"
                    />
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold ml-1">
                    Confirm New
                  </Label>
                  <div className="relative group">
                    <Input
                      id="confirmPassword"
                      type={showPass ? "text" : "password"}
                      value={passwords.confirmPassword}
                      onChange={handleChange}
                      className={`bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 pl-10 pr-10 h-11 md:h-12 rounded-xl focus-visible:ring-indigo-500 transition-all text-sm md:text-base ${
                        !isMatch && passwords.confirmPassword ? "border-red-500 ring-1 ring-red-500/20" : ""
                      }`}
                      placeholder="Repeat new"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error/Validation Info */}
              <div className="min-h-[16px]">
                {!isMatch && passwords.confirmPassword && (
                  <p className="text-[10px] md:text-xs text-red-500 font-medium ml-1 flex items-center gap-1.5">
                    <X size={12} /> Passwords do not match
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!canSubmit || isPending}
                  className={`w-full h-11 md:h-12 rounded-xl font-bold transition-all duration-300 shadow-lg ${
                    canSubmit
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/25 active:scale-[0.98]"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed shadow-none"
                  }`}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <span className="flex items-center gap-2 text-sm md:text-base">
                      <Sparkles size={16} /> Update Password
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
