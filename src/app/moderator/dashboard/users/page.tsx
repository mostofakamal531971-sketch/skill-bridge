import UserLists from "@/features/admin/components/UserLists";
import { Users } from "lucide-react";
import { Suspense } from "react";

export default function ModeratorUsersPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 font-sans antialiased">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage permissions, access levels, and account statuses.
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="h-40 bg-zinc-100 animate-pulse rounded-xl" />}>
        <UserLists />
      </Suspense>
    </div>
  );
}

