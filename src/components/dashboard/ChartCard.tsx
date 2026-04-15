"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className = "" }: ChartCardProps) {
  return (
    <div className={`bento-card ${className}`}>
      <h3 className="font-bold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

