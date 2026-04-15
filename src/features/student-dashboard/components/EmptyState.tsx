import { Calendar } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-20 border-dashed border rounded-xl">
      <Calendar className="h-6 w-6 mx-auto mb-2 text-zinc-400" />
      <h3 className="font-medium">No bookings found</h3>
      <p className="text-sm text-zinc-500">Try adjusting filters</p>
    </div>
  );
}

