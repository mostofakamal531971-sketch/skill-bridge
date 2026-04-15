"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { 
  Sparkles, Loader2, DollarSign, 
  Check, Briefcase
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { tutorOnboardingHandler } from "../services";
import { generateAIContent } from "@/services/ai.services";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useApiQuery } from "@/hooks/useApiQuery";

const onboardingSchema = z.object({
  hourlyRate: z.number().min(10, "Minimum rate is $10").max(500, "Maximum rate is $500"),
  experience: z.string().min(1, "Minimum 1 year of experience required").max(50, "Experience cannot exceed 50 years"),
  category: z.string().min(1, "Please select a category"),
  categoryId: z.string().min(1, "Please select a category id"),
  subjects: z.array(z.string()).min(1, "Select at least one subject"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
});

const TutorOnboarding = () => {
  const router = useRouter();
  const [isGeneratingBio, setIsGeneratingBio] = React.useState(false);
  const handleOnboarding = useMutation({
    mutationFn: tutorOnboardingHandler,
    onSuccess: () => {
      toast.success("Your Profile Completed");
      router.refresh();
    },
    onError: (err) => {
      console.log(err);
    }
  });

  const { data: categories, isLoading, isSuccess } = useApiQuery<{
    data: {
      id: string,
      name: string,
      subjects: string[]
    }[]
  }>(["fetch-categories"], "/api/shared/categories", {
    staleTime: 60000,
  });

  const form = useForm({
    defaultValues: {
      hourlyRate: 10,
      experience: "",
      category: "",
      subjects: [] as string[],
      bio: "",
      categoryId: ""
    },
    validators: {
      onChange: onboardingSchema,
    },
    onSubmit: async ({ value }) => {
      await handleOnboarding.mutateAsync(value);
    },
  });

  const handleGenerateBio = async () => {
    const vals = form.state.values;
    if (!vals.category || vals.subjects.length === 0) {
      toast.error("Please select a category and subjects first");
      return;
    }
    setIsGeneratingBio(true);
    try {
      const res = await generateAIContent({
        mode: "resume",
        data: {
          target_role: "Tutor specializing in " + vals.category,
          skills: vals.subjects,
          experience: vals.experience + " years of teaching experience",
        },
      });
      if (res.success && res.data?.professional_summary) {
        form.setFieldValue("bio", res.data.professional_summary);
        toast.success("Bio generated successfully!");
      } else {
        toast.error("Failed to generate bio");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsGeneratingBio(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white/60 dark:bg-[#050505]/90 backdrop-blur-3xl" />

        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-[54px] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-zinc-100 dark:border-zinc-800 p-8 md:p-14 overflow-y-auto max-h-[90vh]"
        >
          <div className="text-center mb-10 space-y-3">
            <div className="mx-auto w-14 h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 mb-4">
              <Sparkles size={28} />
            </div>
            <h2 className="text-4xl font-black tracking-tighter">Tutor Setup</h2>
            <p className="text-zinc-500 font-medium text-sm italic">Complete your profile to start teaching</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field name="category">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Teaching Category</Label>
                    <Select onValueChange={(val) => {
                      field.handleChange(val.split("+")[0]);
                      form.setFieldValue("subjects", []);
                      form.setFieldValue("categoryId", val.split("+")[1]); 
                    }}
                    disabled={isLoading || !isSuccess}
                    >
                      <SelectTrigger className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none px-6 font-bold">
                        <SelectValue placeholder="Sector" />
                      </SelectTrigger>
                      <SelectContent className="z-[120]">
                        {categories?.data.map(cat => <SelectItem key={cat.id} value={`${cat.name}+${cat.id}`} className="font-bold">{cat.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>

              <form.Field name="hourlyRate">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Hourly Rate ($/hr)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input type="number" value={field.state.value} onChange={(e) => field.handleChange(Number(e.target.value))} className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none pl-12 font-bold" />
                    </div>
                    {field.state.meta.errors && <p className="text-[10px] text-red-500 font-bold ml-2">{field.state.meta.errors.map(e => e?.message)}</p>}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <form.Field name="experience">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Years of Experience</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input 
                        type="text" 
                        value={field.state.value} 
                        onChange={(e) => field.handleChange(e.target.value)} 
                        className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none pl-12 font-bold" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 uppercase tracking-tighter">Years</span>
                    </div>
                    {field.state.meta.errors && <p className="text-[10px] text-red-500 font-bold ml-2">{field.state.meta.errors.map(e => e?.message)}</p>}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="subjects">
              {(field) => (
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Select Subjects</Label>
                  {!form.getFieldValue("category") ? (
                    <div className="p-8 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[28px] text-center text-zinc-400 text-sm font-medium">
                      Please select a category first
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {categories?.data.find(c => c.name === form.getFieldValue("category"))?.subjects.map(sub => {
                        const isSelected = field.state.value.includes(sub);
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => {
                              const next = isSelected 
                                ? field.state.value.filter(s => s !== sub)
                                : [...field.state.value, sub];
                              field.handleChange(next);
                            }}
                            className={cn(
                              "px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2",
                              isSelected 
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200"
                            )}
                          >
                            {sub}
                            {isSelected && <Check size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {field.state.meta.errors && <p className="text-[10px] text-red-500 font-bold ml-2">{field.state.meta.errors.map(e => e?.message)}</p>}
                </div>
              )}
            </form.Field>

            <form.Field name="bio">
              {(field) => (
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Bio</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={handleGenerateBio}
                      disabled={isGeneratingBio}
                      className="h-6 px-3 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 flex items-center"
                    >
                      {isGeneratingBio ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                      Generate with AI
                    </Button>
                  </div>
                  <Textarea 
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Tell us about your background..." 
                    className="min-h-[120px] rounded-[28px] bg-zinc-50 dark:bg-zinc-900 border-none p-6 font-semibold leading-relaxed transition-all"
                  />
                  {field.state.meta.errors && <p className="text-[10px] text-red-500 font-bold ml-2">{field.state.meta.errors.map(e => e?.message)}</p>}
                </div>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <button 
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full h-18 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[32px] font-black text-xl py-6 transition-all active:scale-95 shadow-2xl shadow-indigo-500/20 flex items-center justify-center"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Complete Profile"}
                </button>
              )}
            </form.Subscribe>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TutorOnboarding;
