import { httpRequest } from "@/config/axios/axios";
import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/http/parse";

type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface MutationConfig {
  method: MutationMethod;
  /** Path after /api on the backend, e.g. `auth/register` or `student/profile` (no leading slash). */
  endpoint: string;
  invalidateKeys?: string[][];
  successMessage?: string;
  /** If false, skip automatic success toast. */
  showSuccessToast?: boolean;
  /** If false, skip automatic error toast (handle in onError). */
  showErrorToast?: boolean;
}

export function useApiMutation<TData = unknown, TVariables = unknown, TContext = unknown>(
  config: MutationConfig,
  options?: UseMutationOptions<TData, Error, TVariables, TContext>
) {
  const queryClient = useQueryClient();
  const {
    method,
    endpoint,
    invalidateKeys,
    successMessage,
    showSuccessToast = true,
    showErrorToast = true,
  } = config;

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn: async (payload) => {
      const path = endpoint.replace(/^\//, "");
      const response = await httpRequest.request<TData>({
        url: path,
        method,
        data: payload,
      });
      return response.data;
    },
    onSuccess: (data: unknown, variables, context) => {
      const msg =
        successMessage ||
        (data && typeof data === "object" && "message" in data && typeof (data as any).message === "string"
          ? (data as any).message
          : null);
      if (showSuccessToast) {
        toast.success(msg || "Done");
      }

      invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      options?.onSuccess?.(data, variables, context);
    },
    onError: (error: unknown, variables, context) => {
      if (showErrorToast) {
        const ax = error as { response?: { data?: unknown; status?: number } };
        const body = ax.response?.data;
        toast.error(getErrorMessage(body, "Something went wrong"), {
          description: ax.response?.status ? `HTTP ${ax.response.status}` : undefined,
        });
      }
      options?.onError?.(error as Error, variables, context);
    },
    ...options,
  });
}

