"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera, Loader2, Mail, Save, X, MapPin, Phone, Briefcase } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateAvatar } from "@/features/auth/services";
import { useApiQuery } from "@/hooks/useApiQuery";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTutorProfile } from "../services";
import { generateAIContent } from "@/services/ai.services";
import { tutorProfileType } from "../types";
import { useRefetchQueries } from "@/lib/react-query";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TutorProfilePage({ tutor }: { tutor: tutorProfileType }) {
  const { data: categoriesData, isLoading: isCatsLoading } = useApiQuery<{
    data: { id: string; name: string; subjects: string[] }[];
  }>(["fetch-categories"], "/api/shared/categories", { staleTime: 60000 });
  console.log(tutor);

  const categories = categoriesData?.data || [];
  const { refetchQueries } = useRefetchQueries();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Differentiate between "Initial" (Saved) and "Draft" (Typing) state
  const initialData = useMemo(() => ({
    name: tutor.name || "",
    bio: tutor.tutorProfile.bio || "",
    categoryId: tutor.tutorProfile.categoryId || "",
    subjects: tutor.tutorProfile.subjects || [],
    hourlyRate: tutor.tutorProfile.hourlyRate || 0,
    experience: tutor.tutorProfile.experience || "",
    location: tutor.location || "",
    phoneNumber: tutor.phoneNumber || "",
  }), [tutor]);

  // Draft state (what the user sees in input fields)
  const [draft, setDraft] = useState(initialData);
  // Preview state for the image only (local blob URL)
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
  const [profileAvater, setProfileAvater] = useState<string | null>(tutor.profileAvater);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  // 2. Check if anything (text or image) has changed
  const isDirty = useMemo(() => {
    const textChanged = JSON.stringify({ ...draft, avatar: "" }) !== JSON.stringify({ ...initialData, avatar: "" });
  
    return textChanged;
  }, [draft, initialData]);

  // Mutations
  const profileMutation = useMutation({
    mutationFn: updateTutorProfile,
    onSuccess: () => toast.success("Profile updated successfully!"),
  });

  const avatarMutation = useMutation({
    mutationFn: updateAvatar,
      onSuccess: (res) => {
    console.log(res);
    
      setProfileAvater(res?.data?.profileAvater)
      setLocalImagePreview(null);
      toast.success("Photo uploaded successfully!");
      refetchQueries("user-profile")

    },
    onError: () => toast.error("Photo upload failed")
  });

  // 3. Unified Save Handler
  const handlePushChanges = async () => {
    try {
 


      const { name, location, phoneNumber, ...others } = draft;
      const payload = { user: { name, location, phoneNumber }, ...others }
      await profileMutation.mutateAsync(payload);
      refetchQueries("user-profile");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const availableSubjects = useMemo(() => {
    const selectedCat = categories.find((c) => c.id === draft.categoryId);
    return selectedCat ? selectedCat.subjects : [];
  }, [draft.categoryId, categories]);

  const toggleSubject = (sub: string) => {
    setDraft((prev) => {
      const exists = prev.subjects.includes(sub);
      return {
        ...prev,
        subjects: exists ? prev.subjects.filter((s) => s !== sub) : [...prev.subjects, sub],
      };
    });
  };

  const handleGenerateBio = async () => {
    if (!draft.categoryId || draft.subjects.length === 0) {
      toast.error("Please select a category and subjects first");
      return;
    }
    const cat = categories.find(c => c.id === draft.categoryId);
    setIsGeneratingBio(true);
    try {
      const res = await generateAIContent({
        mode: "resume",
        data: {
          name: draft.name,
          target_role: "Expert Tutor in " + (cat?.name || "General"),
          skills: draft.subjects,
          experience: draft.experience + " years of teaching",
        },
      });
      if (res.success && res.data?.professional_summary) {
        setDraft(prev => ({ ...prev, bio: res.data.professional_summary }));
        toast.success("Bio generated beautifully!");
      } else {
        toast.error("Failed to generate bio");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setIsGeneratingBio(false);
    }
  };

const confirmUpload = async () => {
  if (!selectedImage) return;

  // console.log("Selected file:", selectedFile);

  const filename = `${toast.name}-profileAvatar`;

  // Create FormData
  const formData = new FormData();

  formData.append("file", selectedImage, filename);

  // Append extra details (metadata)
  formData.append("title", "Profile Avatar");
  formData.append("description", "User profile picture");

  await avatarMutation.mutateAsync(formData)
  
};
    return (
      <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <Badge variant="outline" className="rounded-full px-3 py-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold text-[10px]">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2 animate-pulse" />
                TUTOR DASHBOARD
              </Badge>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight uppercase">Edit Identity</h1>
            </div>
            <Button
              onClick={handlePushChanges}
              disabled={profileMutation.isPending || avatarMutation.isPending || !isDirty}
              className={cn(
                "w-full md:w-auto h-14 px-10 rounded-2xl font-black transition-all active:scale-95 shadow-xl",
                isDirty ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
              )}
            >
              {profileMutation.isPending || avatarMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
              Save Changes
            </Button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar: Uses INITIAL data so it doesn't change while typing */}
            <aside className="lg:col-span-4 space-y-6">
              <Card className="rounded-[40px] border-none bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[48px] overflow-hidden ring-8 ring-zinc-50 dark:ring-zinc-800 shadow-inner">
                      {/* Show local preview if selected, otherwise saved avatar */}
                      <img src={profileAvater || ""} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3.5 rounded-2xl shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-zinc-900"
                    >
                      <Camera size={20} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setSelectedImage(f);
                          setLocalImagePreview(URL.createObjectURL(f));
                        }
                      }}
                    />
                  </div>
                  {/* Displaying INITIAL name here prevents update-on-type in sidebar */}
                  <h2 className="text-2xl font-black tracking-tight">{initialData.name}</h2>
                  <div className="flex flex-col gap-2 mt-4 w-full">
                    <div className="flex items-center justify-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                      <Mail size={12} className="text-indigo-500" /> {tutor.email}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                      <MapPin size={12} className="text-rose-500" /> {initialData.location || "Earth"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[32px] border-none bg-indigo-600 p-6 text-white shadow-lg shadow-indigo-500/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black opacity-70 uppercase tracking-[0.2em]">Hourly Rate</p>
                    <p className="text-2xl font-black">${initialData.hourlyRate}</p>
                  </div>
                  <div className="h-10 w-px bg-white/20" />
                  <div>
                    <p className="text-[10px] font-black opacity-70 uppercase tracking-[0.2em]">Experience</p>
                    <p className="text-2xl font-black">{initialData.experience} Yrs</p>
                  </div>
                </div>
              </Card>
            </aside>

            {/* Main Form: Uses DRAFT state */}
            <main className="lg:col-span-8 space-y-8">
              <Card className="rounded-[40px] border-none bg-white dark:bg-zinc-900 p-6 md:p-10 shadow-xl">
                <div className="space-y-10">
                  <section className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Essential Info</h3>
                      <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Display Name</Label>
                        <Input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none px-6 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Phone Connection</Label>
                        <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                          <Input placeholder="+1 234..." type="text" value={draft.phoneNumber} onChange={e => setDraft({ ...draft, phoneNumber: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none pl-12 pr-6 font-bold" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Physical Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                          <Input placeholder="City, Country" value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none pl-12 pr-6 font-bold" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Years of Practice</Label>
                        <div className="relative">
                          <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                          <Input type="text" value={draft.experience} onChange={e => setDraft({ ...draft, experience: e.target.value || "" })} className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none pl-12 pr-6 font-bold" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Expertise & Rate</h3>
                      <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Tutor Category</Label>
                        <Select value={draft.categoryId} onValueChange={val => setDraft({ ...draft, categoryId: val, subjects: [] })}>
                          <SelectTrigger className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none px-6 font-bold">
                            <SelectValue placeholder={isCatsLoading ? "Detecting..." : "Choose Niche"} />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-none shadow-2xl">
                            {categories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id} className="rounded-xl font-bold py-3">{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Hourly Rate ($)</Label>
                        <Input type="number" value={draft.hourlyRate} onChange={e => setDraft({ ...draft, hourlyRate: parseInt(e.target.value) || 0 })} className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none px-6 font-bold" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase ml-2 text-zinc-400">Active Subjects</Label>
                      <div className="flex flex-wrap gap-2 p-4 rounded-[24px] bg-zinc-50 dark:bg-zinc-800/40 min-h-[60px]">
                        <AnimatePresence mode="popLayout">
                          {draft.subjects.length > 0 ? draft.subjects.map(sub => (
                            <motion.div key={sub} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
                              <Badge className="pl-3 pr-1 py-1.5 rounded-xl bg-indigo-600 text-white border-none text-[10px] font-black uppercase tracking-wider">
                                {sub} <button onClick={() => toggleSubject(sub)} className="ml-2 p-1 hover:bg-white/20 rounded-md transition-colors"><X size={12} /></button>
                              </Badge>
                            </motion.div>
                          )) : (
                            <p className="text-xs font-bold text-zinc-400 italic m-auto">Select subjects from below...</p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {draft.categoryId && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {availableSubjects.map(sub => (
                          <button
                            key={sub}
                            onClick={() => toggleSubject(sub)}
                            className={cn(
                              "p-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 text-center",
                              draft.subjects.includes(sub)
                                ? "border-indigo-600 bg-indigo-600/5 text-indigo-600"
                                : "border-transparent bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            )}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="space-y-3">
                    <div className="flex items-center justify-between ml-2">
                      <Label className="text-[10px] font-black uppercase text-zinc-400">Professional Bio</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={handleGenerateBio}
                        disabled={isGeneratingBio}
                        className="h-7 px-3 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20"
                      >
                        {isGeneratingBio ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                        Sparkle / Generate
                      </Button>
                    </div>
                    <Textarea
                      value={draft.bio}
                      onChange={e => setDraft({ ...draft, bio: e.target.value })}
                      placeholder="Tell your story..."
                      className="min-h-[180px] rounded-[32px] bg-zinc-50 dark:bg-zinc-800 border-none p-8 font-bold leading-relaxed focus:ring-2 ring-indigo-500/20"
                    />
                  </section>
                </div>
              </Card>
            </main>
          </div>
        </div>

        {/* --- Avatar Modal --- */}
      <Dialog open={!!localImagePreview} onOpenChange={() => setLocalImagePreview(null)}>
        <DialogContent className="rounded-[40px] border-none bg-white dark:bg-zinc-950 p-10 shadow-3xl max-w-sm">
          <DialogHeader><DialogTitle className="text-center font-black uppercase tracking-tighter text-2xl">Confirm Avatar</DialogTitle></DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-44 h-44 rounded-[56px] overflow-hidden ring-8 ring-indigo-50 dark:ring-indigo-900/20 shadow-2xl mb-6">
              <img src={localImagePreview!} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs font-bold text-zinc-400 text-center uppercase tracking-widest">Update your professional visual identity?</p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" className="flex-1 rounded-2xl font-bold" onClick={() => setLocalImagePreview(null)}>Cancel</Button>
            <Button className="flex-1 rounded-2xl font-black bg-indigo-600 text-white" onClick={confirmUpload} disabled={avatarMutation.isPending}>
              {avatarMutation.isPending ? <Loader2 className="animate-spin" /> : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      </div>
    );
  }
