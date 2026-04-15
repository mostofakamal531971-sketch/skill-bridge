export type ApiEnvelope<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
  meta?: { timestamp?: string };
};

export class ApiRequestError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
  }
}

export async function parseJsonSafe<T = unknown>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return { raw: text } as T;
  }
}

export function getErrorMessage(body: unknown, fallback = "Request failed"): string {
  if (!body || typeof body !== "object") return fallback;
  const b = body as Record<string, unknown>;
  if (typeof b.message === "string") return b.message;
  // Handle backend error structure: { success: false, error: { message: "..." } }
  if (b.error && typeof b.error === "object" && typeof (b.error as any).message === "string") {
    return String((b.error as any).message);
  }
  if (Array.isArray(b.errors) && b.errors[0] && typeof (b.errors[0] as any).message === "string") {
    return String((b.errors[0] as any).message);
  }
  return fallback;
}

