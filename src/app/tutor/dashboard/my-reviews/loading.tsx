import { Loader2 } from "lucide-react";

const ReviewsLoading = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
    <p className="text-zinc-400 font-medium">Fetching your reviews...</p>
  </div>
);

export default ReviewsLoading
