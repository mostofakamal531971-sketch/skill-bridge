"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Users, DollarSign, BookOpen, Star } from "lucide-react";

// ---------- Type Definitions ----------
interface AdminStat {
  label: string;
  value: string | number;
}

interface WeeklyDataItem {
  _sum: { amount: number };
  createdAt: string;
}

interface MonthlyRevenueItem {
  name: string;
  revenue: number;
  users: number;
}

interface Booking {
  id: string;
  student: string;
  studentId: string;
  tutorId: string;
  subject: string;
  date: string;
  time: string;
  status: string;
  amount: number;
}

interface AdminOverviewData {
  adminStats?: AdminStat[];
  weeklyData?: WeeklyDataItem[];
  monthlyRevenue?: MonthlyRevenueItem[];
  latestBooking?: Booking[];
}

// ---------- Helper Components ----------
const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) => (
  <div className="bento-card flex items-center gap-4 p-5">
    <div className="rounded-xl bg-primary/10 p-3">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);

const ChartCard = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bento-card p-5 ${className}`}>
    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h3>
    {children}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border";
  const variants: Record<string, string> = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
    pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
  };
  return (
    <span className={`${baseClasses} ${variants[status] || variants.completed}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ---------- Main Component ----------
export default function AdminOverview({ data }: { data: AdminOverviewData }) {
  // Safely extract data with fallbacks
  const adminStats = data?.adminStats ?? [];
  const weeklyDataRaw = data?.weeklyData ?? [];
  const monthlyRevenue = data?.monthlyRevenue ?? [];
  const bookings = data?.latestBooking ?? [];

  // --- Derived Data ---
  // 1. Weekly revenue aggregated by date (YYYY-MM-DD)
  const weeklyChartData = useMemo(() => {
    const aggregated: Record<string, number> = {};
    weeklyDataRaw.forEach((item) => {
      const date = new Date(item.createdAt).toISOString().split("T")[0];
      aggregated[date] = (aggregated[date] || 0) + item._sum.amount;
    });
    return Object.entries(aggregated)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [weeklyDataRaw]);

  // 2. Subject distribution for pie chart
  const subjectData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      counts[b.subject] = (counts[b.subject] || 0) + 1;
    });
    const total = Object.values(counts).reduce((sum, c) => sum + c, 0);
    const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
    return Object.entries(counts)
      .map(([name, value], index) => ({
        name,
        value,
        percentage: total ? Math.round((value / total) * 100) : 0,
        fill: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [bookings]);

  // 3. Icon mapping for stat cards
  const statIcons = [DollarSign, Users, BookOpen, Star];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {adminStats.length > 0 ? (
          adminStats.map((stat, index) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={statIcons[index % statIcons.length]}
            />
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No statistics available
          </div>
        )}
      </div>

      {/* Charts Row 1: Weekly Revenue + Subject Distribution */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Weekly Revenue" className="lg:col-span-2">
          {weeklyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={weeklyChartData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="hsl(215 20% 65%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const d = new Date(value);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis
                  stroke="hsl(215 20% 65%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(230 15% 8%)",
                    border: "1px solid hsl(230 15% 18%)",
                    borderRadius: "12px",
                    color: "hsl(210 40% 96%)",
                  }}
                  formatter={(value: number) => [`$${value}`, "Revenue"]}
                  labelFormatter={(label) => {
                    const d = new Date(label);
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
              No weekly revenue data
            </div>
          )}
        </ChartCard>

        <ChartCard title="Bookings by Subject">
          {subjectData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    stroke="none"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(230 15% 8%)",
                      border: "1px solid hsl(230 15% 18%)",
                      borderRadius: "12px",
                      color: "hsl(210 40% 96%)",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} booking${value !== 1 ? "s" : ""} (${subjectData.find((s) => s.name === name)?.percentage}%)`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {subjectData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="ml-auto font-medium text-foreground">
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No subject data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Charts Row 2: Monthly Revenue + User Growth */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Monthly Revenue Trend">
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyRevenue}>
                <XAxis
                  dataKey="name"
                  stroke="hsl(215 20% 65%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(215 20% 65%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(230 15% 8%)",
                    border: "1px solid hsl(230 15% 18%)",
                    borderRadius: "12px",
                    color: "hsl(210 40% 96%)",
                  }}
                  formatter={(value: number) => [`$${value}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No monthly revenue data
            </div>
          )}
        </ChartCard>

        <ChartCard title="User Growth">
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRevenue}>
                <XAxis
                  dataKey="name"
                  stroke="hsl(215 20% 65%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(215 20% 65%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(230 15% 8%)",
                    border: "1px solid hsl(230 15% 18%)",
                    borderRadius: "12px",
                    color: "hsl(210 40% 96%)",
                  }}
                  formatter={(value: number) => [value, "New Users"]}
                />
                <Bar
                  dataKey="users"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No user growth data
            </div>
          )}
        </ChartCard>
      </div>

      {/* Recent Bookings Table */}
      <div className="bento-card overflow-hidden p-0">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Bookings
          </h3>
        </div>
        <div className="overflow-x-auto">
          {bookings.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.slice(0, 5).map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                      {booking.student}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                      {booking.subject}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                      {booking.date} • {booking.time}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                      ${booking.amount}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No recent bookings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
