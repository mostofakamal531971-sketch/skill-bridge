import { CalendarCheck, BookOpen, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "../services";

export default async function StudentStats({userId}:{userId:string}) {
 const {data:response} = await getDashboardStats(userId);

 console.log(response);
 
 
 const statsData = [
  { id: 1, name: "Total Bookings", value: response?.data?.totalBooking,  icon: CalendarCheck, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
 
  { id: 3, name: "Reviews Given", value: response?.data?.totalReview , icon: Star, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
];

console.log(response);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

      {statsData.map((stat) => (
        <Card key={stat.id} className="border-none bg-white dark:bg-zinc-900 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">{stat.name}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export const StudentStatsSkelection = ()=>{
  return  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 w-full" />)}
      </div>
}
