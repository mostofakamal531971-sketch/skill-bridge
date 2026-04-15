import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function BookingClientSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 animate-pulse">
      <header className="max-w-5xl mx-auto px-6 py-10 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" disabled className="rounded-full">
            <ChevronLeft size={20} />
          </Button>
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        </div>
        <div className="h-6 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-3">
              <div className="h-4 w-40 bg-emerald-100 dark:bg-emerald-900/20 rounded" />
              <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            </div>

            <Card className="p-8 border-zinc-100 dark:border-zinc-900 shadow-none bg-zinc-50/50 dark:bg-zinc-900/20 rounded-3xl border">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 space-y-3">
                <div className="w-5 h-5 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-12 bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-900 space-y-3">
                <div className="w-5 h-5 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-12 bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="p-8 border-zinc-100 dark:border-zinc-900 shadow-none rounded-3xl border space-y-6 bg-white dark:bg-zinc-950">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              </div>
              
              <div className="pt-6 border-t border-zinc-50 dark:border-zinc-900 space-y-4">
                <div className="h-14 w-full bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl" />
                <div className="h-14 w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}