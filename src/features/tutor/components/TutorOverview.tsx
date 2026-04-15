"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { BookOpen, Star, Users, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from "@/components/dashboard/ChartCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { getTutorDashboardData } from "@/features/tutor/services";
import { Skeleton } from "@/components/ui/skeleton";
import TutorOnboarding from "./TutorOnboarding";

type DashboardPayload = {
  profile?: {
    name?: string;
    totalSessions?: number;
    avgRating?: number;
    totalReviews?: number;
  };
  upcomingSessions?: Array<{
    id: string;
    dateTime: string;
    status: string;
    student?: { name?: string; profileAvatar?: string | null };
  }>;
  availability?: Array<{ id: string; date: string; startTime: string; endTime: string }>;
  recentFeedback?: { comment?: string; studentName?: string } | null;
  analytics?: Array<{ month: string; earnings: number; sessions: number }>;
};

export default function TutorOverview() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tutor-dashboard"],
    queryFn: () => getTutorDashboardData() as Promise<DashboardPayload | null>,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  // Handle case where data is completely missing (network error or unauthorized)
  if (isError || !data) {
    return (
      <div className="bento-card border-destructive/30 text-destructive">
        Could not load tutor dashboard. Please try again later.
      </div>
    );
  }

  const p = data?.profile;
  // @ts-ignore - profileIncomplete is added by backend fix
  const isIncomplete = !!data?.profileIncomplete;
  const upcoming = data.upcomingSessions ?? [];
  const openSlots = data.availability ?? [];
  const analyticsData = data.analytics || [
    { month: 'Nov', earnings: 120, sessions: 4 },
    { month: 'Dec', earnings: 250, sessions: 8 },
    { month: 'Jan', earnings: 180, sessions: 5 },
    { month: 'Feb', earnings: 330, sessions: 11 },
    { month: 'Mar', earnings: 400, sessions: 12 },
    { month: 'Apr', earnings: 550, sessions: 15 },
  ];

  return (
    <>
      {isIncomplete && <TutorOnboarding />}
      <PageHeader
        title={`Welcome back, ${p?.name ?? "Tutor"}`}
        description="Overview of sessions, ratings, and your next openings."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Completed sessions" value={String(p?.totalSessions ?? 0)} icon={BookOpen} />
        <StatCard label="Upcoming" value={String(upcoming.length)} icon={Users} />
        <StatCard
          label="Avg rating"
          value={(p?.avgRating ?? 0).toFixed(1)}
          icon={Star}
          positive
        />
        <StatCard label="Reviews" value={String(p?.totalReviews ?? 0)} icon={Star} />
      </div>

      <div className="mb-6">
        <ChartCard title="Growth & Earnings Over Time" className="p-6 rounded-3xl min-h-[350px]">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => '$'+val} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.95)', borderRadius: '12px', border: '1px solid #27272a', color: '#fff' }}
                  itemStyle={{ color: '#fff' }} cursor={{ stroke: '#4f46e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="earnings" name="Earnings ($)" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="bento-card">
          <h3 className="mb-4 font-bold text-foreground">Upcoming sessions</h3>
          <div className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No confirmed upcoming sessions.</p>
            ) : (
              upcoming.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-white/[0.06] bg-muted/20 p-3"
                >
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(s.dateTime), "EEE MMM d · h:mm a")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {s.student?.name ?? "Student"}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={s.status} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bento-card">
          <h3 className="mb-4 font-bold text-foreground">Open availability</h3>
          <div className="space-y-3">
            {openSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add slots from Availability.</p>
            ) : (
              openSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-xl border border-white/[0.06] bg-muted/20 p-3"
                >
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(slot.date), "MMM d, yyyy")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {slot.startTime} – {slot.endTime}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {data.recentFeedback ? (
        <div className="bento-card">
          <h3 className="mb-2 font-bold text-foreground">Latest review</h3>
          <p className="text-sm text-muted-foreground">
            From <span className="font-medium text-foreground">{data.recentFeedback.studentName}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            “{data.recentFeedback.comment}”
          </p>
        </div>
      ) : null}
    </>
  );
}

