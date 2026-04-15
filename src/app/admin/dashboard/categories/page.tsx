"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, X, Save, 
  AlertCircle, Loader2, Search, Info 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { httpRequest } from "@/config/axios/axios";
import { cn } from "@/lib/utils";
import CategoryCard from "@/features/admin/components/CategoryCard";
import { EmptyState } from "@/features/student-dashboard/components/EmptyState";
import { createCategoryByAdmin, deleteCategoryByAdmin, updateCategoryByAdmin } from "@/features/admin/services";

const CategoryManager = () => {
  const queryClient = useQueryClient();
  
  // Modal Visibility States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Data States
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form States
  const [catName, setCatName] = useState("");
  const [currentSub, setCurrentSub] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [errors, setErrors] = useState<{name?: string, subjects?: string}>({});

  const { data: categories, isLoading } = useApiQuery<{
    data: { id: string; name: string; subjects: string[] }[];
  }>(["fetch-categories"], "/api/shared/categories");

  const filteredList = useMemo(() => 
    categories?.data?.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())) || []
  , [categories, searchQuery]);

  const isDirty = useMemo(() => {
    if (!editingCategory) return catName.trim() !== "" || subjects.length > 0;
    const nameChanged = catName !== editingCategory.name;
    const subjectsChanged = JSON.stringify([...subjects].sort()) !== JSON.stringify([...editingCategory.subjects].sort());
    return nameChanged || subjectsChanged;
  }, [catName, subjects, editingCategory]);

  const resetForm = () => {
    setCatName(""); setSubjects([]); setCurrentSub(""); setEditingCategory(null); setErrors({});
  };

  const handleAddSubject = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentSub.trim()) {
      e.preventDefault();
      const val = currentSub.trim();
      if (subjects.includes(val)) return setErrors({ ...errors, subjects: "Already in list" });
      setSubjects([...subjects, val]);
      setCurrentSub("");
      setErrors({ ...errors, subjects: undefined });
    }
  };

  const removeSubject = (tagName: string) => {
    setSubjects(prev => prev.filter(s => s !== tagName));
  };

  // Shared Mutation Options
  const mutationOptions = (successMsg: string) => ({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-categories"] });
      setIsModalOpen(false);
      setIsDeleteOpen(false);
      resetForm();
      toast.success(successMsg);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Operation failed"),
  });

 const createMutation = useMutation({
    mutationFn: (data: any) => createCategoryByAdmin(data),
    ...mutationOptions("Category created"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) =>
      updateCategoryByAdmin(editingCategory!.id, data),
    ...mutationOptions("Changes saved"),
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      deleteCategoryByAdmin(editingCategory!.id),
    ...mutationOptions("Category deleted permanently"),
  });

  const validateAndSave = () => {
    const newErrors: any = {};
    if (catName.trim().length < 3) newErrors.name = "Minimum 3 characters required";
    if (subjects.length === 0) newErrors.subjects = "Add at least one subject tag";
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    const payload = { name: catName, subjects };
    editingCategory ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Curriculum</h1>
          <p className="text-zinc-500 font-medium text-sm md:text-base">Manage academic departments and subject tags.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Quick filter..." 
              className="pl-10 h-11 rounded-xl bg-zinc-100/50 dark:bg-zinc-900 border-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold">
            <Plus className="mr-2 w-5 h-5" /> New Category
          </Button>
        </div>
      </header>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-[24px] bg-zinc-100 dark:bg-zinc-800 animate-pulse" />)}
        </div>
      ) : filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredList.map((cat) => (
              <CategoryCard 
                key={cat.id} cat={cat} 
                onDelete={(c:any) => { setEditingCategory(c); setIsDeleteOpen(true); }}
                onEdit={(c:any) => { setEditingCategory(c); setCatName(c.name); setSubjects(c.subjects); setIsModalOpen(true); }}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState />
      )}

      {/* --- FORM MODAL (CREATE/UPDATE) --- */}
      <Dialog open={isModalOpen} onOpenChange={(o) => { if(!o) resetForm(); setIsModalOpen(o); }}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">{editingCategory ? "Edit" : "New"} Category</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Title</Label>
                <Input 
                  value={catName}
                  onChange={(e) => { setCatName(e.target.value); setErrors({...errors, name: undefined}); }}
                  placeholder="e.g. Computer Science"
                  className={cn("h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800", errors.name && "border-rose-500 ring-1 ring-rose-500")}
                />
                {errors.name && <p className="text-rose-500 text-[10px] font-bold flex items-center gap-1"><AlertCircle size={12}/> {errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Subjects (Enter to add)</Label>
                <Input 
                  value={currentSub}
                  onChange={(e) => setCurrentSub(e.target.value)}
                  onKeyDown={handleAddSubject}
                  placeholder="Type subject..."
                  className={cn("h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800", errors.subjects && "border-rose-500 ring-1 ring-rose-500")}
                />
                {errors.subjects && <p className="text-rose-500 text-[10px] font-bold flex items-center gap-1"><AlertCircle size={12}/> {errors.subjects}</p>}
                
                <div className="flex flex-wrap gap-2 pt-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence>
                    {subjects.map(s => (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} key={s}>
                        <Badge className="bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 pl-3 pr-1 py-1.5 rounded-lg font-bold flex items-center gap-2">
                          {s}
                          <button onClick={() => removeSubject(s)} className="p-0.5 hover:bg-rose-100 hover:text-rose-600 rounded-md transition-colors">
                            <X size={14} />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-100 dark:border-zinc-800 gap-4">
            <div className="flex items-center gap-2">
              {isDirty ? (
                <span className="text-[10px] font-bold uppercase text-amber-500 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md">
                  <Info size={12}/> Unsaved changes
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase text-zinc-400 px-2">Up to date</span>
              )}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1 sm:flex-none rounded-xl font-bold">Cancel</Button>
              <Button 
                onClick={validateAndSave}
                disabled={!isDirty || createMutation.isPending || updateMutation.isPending}
                className={cn(
                  "flex-1 sm:flex-none px-8 rounded-xl font-bold shadow-lg transition-all",
                  isDirty ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none"
                )}
              >
                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4 mr-2" />}
                {editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-rose-600">
              <AlertCircle size={20} /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete <span className="font-bold text-zinc-900 dark:text-zinc-100">"{editingCategory?.name}"</span>? 
              This action cannot be undone and will remove all associated subject tags.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="rounded-xl">Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteMutation.mutate()} 
              disabled={deleteMutation.isPending}
              className="rounded-xl font-bold px-6 shadow-lg shadow-rose-500/20"
            >
              {deleteMutation.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Trash2 size={16} className="mr-2" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
