"use client";

import { signOutAction } from "@/lib/auth/actions";
import { useUser } from "@/context/UserContext";
import { Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refetch } = useUser();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await signOutAction();
      await refetch();
      toast.success(res.message || "Signed out");
      router.push("/sign-in");
      router.refresh();
    } catch {
      toast.error("Could not sign out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleLogout} className="flex h-full w-full cursor-pointer items-center">
      {loading ? <Loader className="animate-spin" /> : <LogOut className="mr-3 h-4 w-4" />}
      <span className="ml-2 font-bold">Logout</span>
    </button>
  );
};

export default LogoutButton;

