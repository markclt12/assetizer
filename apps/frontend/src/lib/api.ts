import type { ApiErrorBody } from "@assetizers/shared";
import { clearAdminToken, getAdminToken } from "./auth";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const needsAuth = (path: string) => path.startsWith("/api/admin") || path === "/api/auth/me";

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = needsAuth(path) ? getAdminToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Could not reach the server. Check your connection.", "NETWORK_ERROR");
  }

  if (response.status === 204) return undefined as T;

  const data = (await response.json().catch(() => null)) as T | ApiErrorBody | null;

  if (!response.ok) {
    if (response.status === 401 && token) clearAdminToken();
    const error = (data as ApiErrorBody | null)?.error;
    throw new ApiError(
      response.status,
      error?.message ?? `Request failed (${response.status})`,
      error?.code ?? "HTTP_ERROR",
      error?.details,
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body ?? {}),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  delete: (path: string) => request<void>("DELETE", path),
};
