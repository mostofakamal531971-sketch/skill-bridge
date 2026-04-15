const FeaturedTutorSkelection = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-card border border-zinc-100 dark:border-zinc-900 p-4 rounded-[40px] animate-pulse">
        <div className="aspect-[4/3] rounded-[32px] bg-muted mb-6" />
        <div className="px-2 space-y-4">
          <div className="flex justify-between">
            <div className="h-6 w-32 bg-muted rounded-md" />
            <div className="h-6 w-12 bg-muted rounded-md" />
          </div>
          <div className="h-4 w-24 bg-muted/60 rounded-md" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted rounded-lg" />
            <div className="h-6 w-16 bg-muted rounded-lg" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-8 w-20 bg-muted rounded-md" />
            <div className="h-12 w-28 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default FeaturedTutorSkelection
