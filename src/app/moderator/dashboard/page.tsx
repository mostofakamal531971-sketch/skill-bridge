"use client";

import AdminOverview from "@/features/admin/components/AdminOverview";
import { getAdminDashboardData } from "@/services/admin.services";
import { useQuery } from "@tanstack/react-query";

export default function ModeratorOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["moderator-dashboard"],
    queryFn: () => getAdminDashboardData()
  });

  if (isLoading) {
    return <div className="p-6">Loading System Metrics...</div>;
  }

  return (
    <div className="p-6 md:p-10 space-y-12 transition-colors duration-500">
      <AdminOverview data={data?.data} />
    </div>
  );
}

