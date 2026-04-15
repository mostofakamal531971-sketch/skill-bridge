
import { motion } from "framer-motion";
import { Suspense } from "react";



import LatestReviews from "./LatestReviews";
import StudentStats, { StudentStatsSkelection } from "./StudentStats";
import UpCommingSessions from "./UpCommingSessions";
import UserWelcome from "./UserWelcome";



export default function DashboardContent({data}:{data:{name:string;id:string}}) {
  
  return (
    <div 
      className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto"
    >
 
<UserWelcome 
name={data.name}
/>
    <Suspense fallback={<StudentStatsSkelection/>}>
        <StudentStats userId={data.id}/>

    </Suspense>
      <div className="grid gap-6 ">
        {/* Booking Card */}

   <UpCommingSessions/>
 

     

       
      </div>
    </div>
  );
}
