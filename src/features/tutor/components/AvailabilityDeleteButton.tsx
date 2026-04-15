"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAvailabilitySlot } from "@/features/tutor/services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AvailabilityDeleteButton({ slotId }: { slotId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={pending}
      className="h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-full text-zinc-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
      onClick={() => {
        start(async () => {
          const res = await deleteAvailabilitySlot(slotId);
          if (res?.success === false || res?.message?.includes?.("Fail")) {
            toast.error(res?.message || "Could not remove slot");
          } else {
            toast.success("Slot removed");
            router.refresh();
          }
        });
      }}
    >
      <Trash2 size={18} />
    </Button>
  );
}

