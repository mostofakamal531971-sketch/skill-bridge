import { Button } from "@/components/ui/button";
import {motion} from "framer-motion"
import { Layers, Pencil, Trash2 } from "lucide-react";
const CategoryCard = ({ cat, onEdit, onDelete }: any) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
    className="group bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:rotate-12 transition-transform duration-300">
          <Layers size={22} />
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight truncate">{cat.name}</h3>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
            {cat.subjects.length} Specializations
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={() => onEdit(cat)} className="h-8 w-8 rounded-lg text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50"><Pencil size={14}/></Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(cat)} className="h-8 w-8 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50"><Trash2 size={14}/></Button>
      </div>
    </div>
    <div className="mt-5 flex flex-wrap gap-1.5">
      {cat.subjects.map((sub: string) => (
        <span key={sub} className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">{sub}</span>
      ))}
    </div>
  </motion.div>
);

export default CategoryCard
