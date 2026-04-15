import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
const EmptyState = ({ query }: { query: string }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900/40 rounded-[32px] border-2 border-dashed border-zinc-200 dark:border-zinc-800"
  >
    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 mb-4">
      <Inbox size={32} />
    </div>
    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
      {query ? "No matches found" : "No categories yet"}
    </h3>
    <p className="text-zinc-500 max-w-[250px] text-center mt-2 text-sm font-medium">
      {query ? `We couldn't find anything for "${query}"` : "Start building your curriculum by adding a new category."}
    </p>
  </motion.div>
);
