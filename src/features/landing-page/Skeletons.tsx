import { cn } from "@/lib/utils";

const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-muted rounded-2xl", className)} />
);

export const HeroSkeleton = () => (
  <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
    <div className="space-y-6">
      <Shimmer className="h-8 w-40" />
      <Shimmer className="h-24 w-full" />
      <Shimmer className="h-20 w-3/4" />
      <div className="flex gap-4">
        <Shimmer className="h-14 flex-1" />
        <Shimmer className="h-14 w-32" />
      </div>
    </div>
    <Shimmer className="aspect-square hidden lg:block rounded-[60px]" />
  </section>
);

export const StatsSkeleton = () => (
  <div className="py-10 border-y border-border px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => <Shimmer key={i} className="h-16 w-full" />)}
    </div>
  </div>
);

export const CategoriesSkeleton = () => (
  <div className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => <Shimmer key={i} className="h-48 w-full rounded-[32px]" />)}
  </div>
);

export const TutorSkeleton = () => (
  <div className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => <Shimmer key={i} className="h-96 w-full rounded-[40px]" />)}
  </div>
);
