import { format } from "date-fns";
import { DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { getTutorEarnings } from "@/features/tutor/services";

function displayAmount(raw: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(raw);
}

export default async function TutorEarningsPage() {
  const data = await getTutorEarnings();
  const balance = data?.balance ?? 0;
  const recent = (data?.recent ?? []) as Array<{
    id: string;
    amount: number;
    createdAt: string;
    user?: { name?: string };
    session?: { dateTime?: string };
  }>;

  return (
    <>
      <PageHeader
        title="Earnings & wallet"
        description="Balance from completed session payments (Stripe)."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Wallet balance"
          value={displayAmount(balance)}
          icon={DollarSign}
          positive
        />
        <StatCard label="Recorded payouts" value={String(recent.length)} icon={TrendingUp} />
      </div>

      <div className="bento-card">
        <h3 className="mb-4 font-bold text-foreground">Recent payments</h3>
        <div className="space-y-3">
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No completed payments yet.</p>
          ) : (
            recent.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-muted/20 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <ArrowUpRight className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {row.user?.name ?? "Student"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {row.session?.dateTime
                        ? format(new Date(row.session.dateTime), "MMM d, yyyy · h:mm a")
                        : format(new Date(row.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-accent">{displayAmount(row.amount)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

