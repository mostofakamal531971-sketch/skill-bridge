import { Card, CardContent } from "@/components/ui/card";
import CreateAvaliablity from "@/features/tutor/components/SlotCreate";
import { getAllAvailability } from "@/features/tutor/services";
import { format } from "date-fns";
import { Timer } from "lucide-react";
import { AvailabilityDeleteButton } from "@/features/tutor/components/AvailabilityDeleteButton";

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
};

export default async function AvailabilityPage() {
  const raw = await getAllAvailability();
  const slots: Slot[] = Array.isArray(raw) ? raw : [];

  return (
    <div className="min-h-screen bg-[#FDFDFD] px-4 py-8 font-sans tracking-tight text-zinc-900 dark:bg-[#0c0c0f] dark:text-zinc-50 md:p-16">
      <div className="mx-auto max-w-2xl space-y-10 md:space-y-16">
        <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold md:text-4xl">Availability</h1>
            <p className="text-sm font-medium italic text-zinc-400">
              Your upcoming teaching windows
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <CreateAvaliablity />
          </div>
        </header>

        <div className="relative space-y-6 md:space-y-8">
          {slots.length > 0 ? (
            slots.map((slot) => (
              <div key={slot.id} className="group relative">
                <div className="flex items-center gap-4 md:gap-10">
                  <div className="flex min-w-[45px] shrink-0 flex-col items-center md:min-w-[50px]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 md:text-[11px]">
                      {format(new Date(slot.date), "MMM")}
                    </span>
                    <span className="text-2xl font-light leading-none md:text-3xl">
                      {format(new Date(slot.date), "dd")}
                    </span>
                  </div>

                  <Card className="flex-1 overflow-hidden rounded-[24px] border-zinc-100 bg-white shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/40 md:rounded-3xl">
                    <CardContent className="flex items-center justify-between gap-4 p-4 md:p-6">
                      <div className="space-y-1.5 md:space-y-2">
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="text-base font-bold md:text-lg">{slot.startTime}</span>
                          <div className="h-[2px] w-3 bg-zinc-200 dark:bg-zinc-800 md:w-4" />
                          <span className="text-base font-bold md:text-lg">{slot.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Timer size={12} className="shrink-0" />
                          <span className="text-[9px] font-bold uppercase tracking-wider md:text-[10px]">
                            {slot.isBooked ? "Booked" : "Open for booking"}
                          </span>
                        </div>
                      </div>

                      {!slot.isBooked ? <AvailabilityDeleteButton slotId={slot.id} /> : null}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[32px] border-2 border-dashed border-zinc-100 py-16 text-center text-zinc-300 dark:border-zinc-900 md:rounded-[40px] md:py-20">
              <p className="text-sm font-medium">No slots scheduled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

