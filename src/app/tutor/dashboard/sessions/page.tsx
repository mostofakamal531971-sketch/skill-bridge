import { Badge } from "@/components/ui/badge";
import { SessionList } from "@/features/tutor/components/SessionsList";
import { getAllSession } from "@/features/tutor/services";
import { StudentBooking } from "@/features/tutor/types";

export default async function TutorSessionsPage() {
  const res = await getAllSession();
  const data: StudentBooking[] = res.data;
console.log(data);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] p-4 md:p-8">
      <div className=" mx-auto space-y-8">
        
        {/* Header stays on server */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase ">
              Session History
            </h1>
            <p className="text-sm text-zinc-500">Manage your bookings and reviews</p>
          </div>
          <Badge variant="outline" className="rounded-full font-bold px-4 py-1 border-zinc-200 dark:border-zinc-800">
            {data.length} Total Sessions
          </Badge>
        </div>

        {/* Pass data to Client Component for Framer Motion */}
        <SessionList sessions={data} />
        
      </div>
    </div>
  );
}
