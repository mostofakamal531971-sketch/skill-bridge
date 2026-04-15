import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";


const ReviewsEmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="text-center py-20">
    <SearchX size={48} className="mx-auto text-zinc-300 mb-4" />
    <h3 className="text-xl font-bold">No reviews matching filters</h3>
    <Button variant="link" onClick={onClear} className="text-indigo-500 font-bold">Clear Filters</Button>
  </div>
);


export default ReviewsEmptyState
