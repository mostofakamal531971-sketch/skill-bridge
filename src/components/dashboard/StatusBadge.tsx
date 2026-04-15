"use client";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusStyles: Record<string, string> = {
  confirmed: "bg-primary/10 text-primary",
  completed: "bg-accent/10 text-accent",
  cancelled: "bg-destructive/10 text-destructive",
  pending: "bg-warning/10 text-warning",
  approved: "bg-accent/10 text-accent",
  rejected: "bg-destructive/10 text-destructive",
  investigating: "bg-warning/10 text-warning",
  escalated: "bg-destructive/10 text-destructive",
  resolved: "bg-accent/10 text-accent",
  active: "bg-accent/10 text-accent",
  banned: "bg-destructive/10 text-destructive",
  high: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
  medium: "bg-info/10 text-info",
  low: "bg-muted text-muted-foreground",
  success: "bg-accent/10 text-accent",
  failed: "bg-destructive/10 text-destructive",
  draft: "bg-muted text-muted-foreground",
  published: "bg-accent/10 text-accent",
  archived: "bg-muted text-muted-foreground",
  available: "bg-accent/10 text-accent",
  booked: "bg-primary/10 text-primary",
  beginner: "bg-accent/10 text-accent",
  intermediate: "bg-warning/10 text-warning",
  advanced: "bg-primary/10 text-primary",
  bio: "bg-primary/10 text-primary",
  review: "bg-warning/10 text-warning",
  issue: "bg-destructive/10 text-destructive",
  improvement: "bg-info/10 text-info",
  feedback: "bg-accent/10 text-accent",
  "in review": "bg-warning/10 text-warning",
  incomplete: "bg-muted text-muted-foreground",
  verified: "bg-accent/10 text-accent",
  "not_submitted": "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const style = statusStyles[key] || "bg-muted text-muted-foreground";

  return (
    <span className={`inline-flex items-center rounded-full font-semibold capitalize ${style} ${size === "md" ? "px-2.5 py-0.5 text-xs" : "px-2 py-0.5 text-[10px]"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

