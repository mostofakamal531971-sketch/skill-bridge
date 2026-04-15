import { Button } from "@/components/ui/button";
import { FilterX, RefreshCcw } from "lucide-react";

const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
      <FilterX size={40} className="text-zinc-400" />
    </div>
    <h3 className="text-2xl font-black mb-2">No Tutors Found</h3>
    <p className="text-zinc-500 mb-8 max-w-xs">We couldn't find any tutors matching your current filters. Try adjusting them.</p>
    <Button onClick={onReset} variant="outline" className="rounded-xl font-bold">
      <RefreshCcw size={18} className="mr-2" /> Reset All Filters
    </Button>
  </div>
);

export default EmptyState
