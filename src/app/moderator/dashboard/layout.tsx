import { DashboardLayout } from "@/components/DashboardLayout";

export default function ModeratorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      title="Moderator Dashboard"
      subtitle="Platform moderation & support"
      userName="Moderator"
      userRole="MODERATOR"
    >
      {children}
    </DashboardLayout>
  );
}

