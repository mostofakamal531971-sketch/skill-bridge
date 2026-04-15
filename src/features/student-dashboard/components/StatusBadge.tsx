import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Timer, XCircle } from "lucide-react";
import { Status } from "../types";


export function StatusBadge({ status }: { status: Status }) {
  const map = {
    confirmed: { icon: Timer, cls: "text-blue-600" },
    completed: { icon: CheckCircle2, cls: "text-emerald-600" },
    cancelled: { icon: XCircle, cls: "text-red-600" },
  };

  const Icon = map[status].icon;

  return (
    <Badge variant="outline" className={map[status].cls}>
      <Icon className="h-3 w-3 mr-1" />
      {status}
    </Badge>
  );
}

