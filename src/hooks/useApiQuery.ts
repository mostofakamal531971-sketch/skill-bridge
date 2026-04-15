import { httpRequest } from "@/config/axios/axios";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/http/parse";

/**
 * Client-side GET via axios (browser baseURL = `/api/proxy`).
 */
export function useApiQuery<TData>(
  queryKey: unknown[],
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn"> & {
    /** Show toast on fetch error (default true for visibility). */
    showErrorToast?: boolean;
  }
) {
  const { showErrorToast = true, ...queryOptions } = options ?? {};

  return useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      const path = endpoint.replace(/^\//, "");
      try {
        const { data } = await httpRequest.get<TData>(path);
        return data;
      } catch (e: unknown) {
        if (showErrorToast) {
          const ax = e as { response?: { data?: unknown; status?: number } };
          toast.error(getErrorMessage(ax.response?.data, "Failed to load data"), {
            description: ax.response?.status ? `HTTP ${ax.response.status}` : undefined,
          });
        }
        throw e as Error;
      }
    },
    ...queryOptions,
  });
}

