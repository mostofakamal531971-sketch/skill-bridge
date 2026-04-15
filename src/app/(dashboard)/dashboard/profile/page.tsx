
import { Skeleton } from "@/components/ui/skeleton";
import { getProfile } from "@/features/auth/services";
import StudentProfileFrom from "@/features/student-dashboard/components/ProfileFrom";

export default async function StudentProfilePage() {
const userData = await getProfile();
console.log(userData);

  return <StudentProfileFrom userData={userData?.user.data as any}/>
}

// --- Skeleton Loader ---
export  function StudentProfileSkeleton() {


  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-pulse">
      <Skeleton className="h-32 md:h-48 w-full rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
