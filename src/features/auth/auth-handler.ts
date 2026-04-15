"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUpPayloadType } from "@/features/auth/types";
import { useApiMutation } from "@/hooks/useApiMutation";
import { getProfile, logoutUser } from "./services";

export const useAuthHandlers = () => {
  const router = useRouter();
  const [status, setStatus] = useState("none");
  const [userData, setUserData] = useState<Record<string, unknown>>({});

  const signupMutation = useApiMutation({
    endpoint: "auth/register",
    method: "POST",
    showSuccessToast: false,
    showErrorToast: true,
  });

  const signUp = async (data: signUpPayloadType) => {
    try {
      const res = await signupMutation.mutateAsync(data as unknown as never);
      toast.success(
        (res as { message?: string })?.message || "Account created — you can sign in now."
      );
      router.push("/sign-in");
    } catch {
      /* toast handled in hook */
    }
  };

  const getCurrentUser = async () => {
    setStatus("get-profile");
    const profile = await getProfile();
    if (!profile) {
      setStatus("none");
      setUserData({});
      return;
    }
    setUserData((profile.user?.data as Record<string, unknown>) ?? {});
    setStatus("none");
  };

  const logoutCurrentUser = async () => {
    setStatus("logout-user");
    await logoutUser();
    setStatus("none");
    router.push("/sign-in");
    router.refresh();
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return {
    signUp,
    isSigningUp: signupMutation.isPending,
    getCurrentUser,
    logoutCurrentUser,
    userData,
    userLoading: status === "get-profile",
    logoutLoading: status === "logout-user",
  };
};

