import { Skeleton } from "@/components/ui/skeleton";

export function BookingSkeleton() {
  return (
    <div className="p-5 border rounded-xl">
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

