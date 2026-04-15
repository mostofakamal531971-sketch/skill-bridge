import { Card, CardContent } from "@/components/ui/card";

export default function StudentProfileSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-[#09090b] p-4 md:p-12 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Skeleton */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-10 w-64 bg-zinc-300 dark:bg-zinc-800 rounded-2xl" />
          </div>
          <div className="h-14 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="rounded-[40px] border-none bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
              <CardContent className="p-10 flex flex-col items-center text-center">
                <div className="w-40 h-40 rounded-[48px] bg-zinc-200 dark:bg-zinc-800 mb-6" />
                <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-3" />
                <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
              </CardContent>
            </Card>

      
          </aside>

          {/* Main Form Skeleton */}
          <main className="lg:col-span-8 space-y-8">
            <Card className="rounded-[40px] border-none bg-white dark:bg-zinc-900 p-8 md:p-12 shadow-xl">
              <div className="space-y-12">
                
                {/* Personal Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                      <div key={i} className="space-y-3">
                        <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded ml-1" />
                        <div className="h-14 w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded ml-1" />
                    <div className="h-14 w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl" />
                  </div>
                  
                  {/* Hobbies skeleton */}
                  <div className="space-y-4">
                    <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-800 rounded ml-1" />
                    <div className="flex flex-wrap gap-2 min-h-[60px] p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-800/50">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
