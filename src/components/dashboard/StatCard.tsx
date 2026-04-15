"use client";

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon?: LucideIcon;
}

export function StatCard({ label, value, change, positive, icon: Icon }: StatCardProps) {
  return (
    <div className="bento-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-foreground tracking-tight">{value}</p>
      {change && (
        <p className={`text-xs font-semibold mt-1 ${positive ? "text-accent" : "text-destructive"}`}>
          {change}
        </p>
      )}
    </div>
  );
}

