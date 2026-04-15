"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ImagePlus, Loader2,
  Mail,
  MapPin, Phone,
  Save,
  User,
  X
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { updateProfile } from "../services";
import { updateAvatar } from "@/features/auth/services";
import { useRefetchQueries } from "@/lib/react-query";

interface UserProps {
  userData: {
    name: string;
    email: string;
    profileAvater: string;
    phoneNumber?: string;
    location?: string;
 
  };
}

export default function StudentProfileForm({ userData }: UserProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refetchQueries } = useRefetchQueries();

  const [formData, setFormData] = useState({
    name: userData?.name || "",
    phoneNumber: userData?.phoneNumber || "",
    location: userData?.location || "",
   
  });


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const [profileAvatar, setProfileAvater] = useState<string | null>(userData.profileAvater);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user-session"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const avatarMutation = useMutation({
    mutationFn: updateAvatar,
    onSuccess: (res) => {
      setProfileAvater(res?.data?.profileAvater);
      setIsModalOpen(false);
      setTempPreview(null);
      toast.success(res.message);
      refetchQueries("user-profile");
    },
    onError: () => toast.error("Upload failed"),
  });

  const isDirty = useMemo(() => {
    return (
      formData.name !== userData.name ||
      formData.phoneNumber !== (userData.phoneNumber || "") ||
      formData.location !== (userData.location || "") 
    );
  }, [formData, userData]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempPreview(reader.result as string);
      setIsModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleAvaterUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile, `${userData.name}-profileAvatar`);
    await avatarMutation.mutateAsync(formData);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-[#09090b] p-4 sm:p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6 md:y-10">
        
        <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />

        {/* Responsive Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
          <div className="space-y-2 text-left">
            <Badge variant="outline" className="rounded-full px-4 py-1.5 bg-indigo-500/10 text-indigo-500 border-indigo-500/20 font-black text-[10px] tracking-widest">
              STUDENT PROFILE
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter">Account Settings</h1>
          </div>
          <Button 
            onClick={() => isDirty && profileMutation.mutate(formData)} 
            disabled={!isDirty || profileMutation.isPending} 
            className={cn(
              "w-full sm:w-auto h-12 md:h-14 px-10 rounded-2xl font-black transition-all active:scale-95 shadow-xl",
              isDirty ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
            )}
          >
            {profileMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
            Save Changes
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Sidebar - Profile Picture */}
          <aside className="lg:col-span-4 order-1 lg:order-1">
            <Card className="rounded-[30px] md:rounded-[40px] border-none bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
              <CardContent className="p-6 md:p-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  {/* Smaller avatar on mobile, larger on desktop */}
                  <div 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] md:rounded-[48px] overflow-hidden ring-4 md:ring-8 ring-zinc-50 dark:ring-zinc-800 shadow-inner cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Avatar className="h-full w-full rounded-none">
                      <AvatarImage src={profileAvatar!} className="object-cover" />
                      <AvatarFallback className="text-3xl md:text-4xl bg-indigo-600 text-white font-black">
                        {userData.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImagePlus className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-zinc-900"
                  >
                    <ImagePlus size={18} className="md:w-5 md:h-5" />
                  </button>
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">{userData.name}</h2>
                <div className="flex items-center gap-2 mt-2 text-zinc-400 font-bold text-xs truncate max-w-full">
                  <Mail size={12} className="text-indigo-500 shrink-0" /> 
                  <span className="truncate">{userData.email}</span>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Form Area */}
          <main className="lg:col-span-8 order-2 lg:order-2 space-y-6">
            <Card className="rounded-[30px] md:rounded-[40px] border-none bg-white dark:bg-zinc-900 p-6 md:p-12 shadow-xl">
              <div className="space-y-8 md:space-y-10">
                
                {/* Section: Basic Info */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 whitespace-nowrap">Personal Details</h3>
                    <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <Input 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none pl-12 font-bold focus-visible:ring-2 focus-visible:ring-indigo-500" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <Input 
                          value={formData.phoneNumber} 
                          onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                          placeholder="+880 1XXX-XXXXXX"
                          className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none pl-12 font-bold focus-visible:ring-2 focus-visible:ring-indigo-500" 
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section: Location & Hobbies */}
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 whitespace-nowrap">Address & Background</h3>
                    <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Current Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <Input 
                        value={formData.location} 
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        placeholder="e.g. Dhaka, Bangladesh"
                        className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none pl-12 font-bold focus-visible:ring-2 focus-visible:ring-indigo-500" 
                      />
                    </div>
                  </div>

                 
                </section>
              </div>
            </Card>
          </main>
        </div>
      </div>

      {/* Avatar Modal - Mobile Optimized */}
      <Dialog open={isModalOpen} onOpenChange={(val) => !avatarMutation.isPending && setIsModalOpen(val)}>
        <DialogContent className="rounded-3xl md:rounded-[40px] border-none bg-white dark:bg-zinc-950 p-6 md:p-10 shadow-3xl max-w-[90vw] sm:max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center font-black uppercase tracking-tighter text-xl md:text-2xl">New Avatar</DialogTitle>
            <DialogDescription className="text-center font-bold text-zinc-500 text-xs md:text-sm">Confirm your professional identity update.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4 md:py-6">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] md:rounded-[56px] overflow-hidden ring-4 md:ring-8 ring-indigo-50 dark:ring-indigo-900/20 shadow-2xl mb-4 md:mb-6">
              {isModalOpen && <img src={tempPreview || ""} className="w-full h-full object-cover" alt="Preview" />}
            </div>
          </div>
          <DialogFooter className="grid grid-cols-2 gap-3">
            <Button variant="ghost" className="rounded-xl md:rounded-2xl font-bold h-10 md:h-12 text-xs md:text-base" onClick={() => setIsModalOpen(false)} disabled={avatarMutation.isPending}>
              Cancel
            </Button>
            <Button className="rounded-xl md:rounded-2xl font-black bg-indigo-600 text-white h-10 md:h-12 text-xs md:text-base" onClick={handleAvaterUpload} disabled={avatarMutation.isPending}>
              {avatarMutation.isPending ? <Loader2 className="animate-spin" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
