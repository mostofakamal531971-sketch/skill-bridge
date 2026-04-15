import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

function resolveBaseURL() {
  if (typeof window !== "undefined") {
    return "/api/proxy";
  }
  const b = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
    /\/$/,
    ""
  );
  return b;
}

export const httpRequest = axios.create({
  baseURL: resolveBaseURL(),
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

httpRequest.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        try {
          const refresh = await fetch(`${window.location.origin}/api/proxy/auth/refresh-token`, {
            method: "POST",
            credentials: "include",
          });
          if (refresh.ok) {
            return httpRequest(originalRequest);
          }
        } catch {
          /* fall through */
        }
        window.location.href = "/sign-in?expired=true";
        return Promise.reject(new Error("UNAUTHORIZED"));
      }
    }

    return Promise.reject(error);
  }
);

