import { API_BASE_URL, API_TIMEOUT_MS } from "./constants";

/**
 * Standard API response wrapper type.
 * @template T - The expected data type.
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Options for authenticated API requests.
 */
interface AuthOptions {
  token?: string;
  tenantId?: string;
}

/**
 * Makes a fetch request to the backend API with timeout and error handling.
 *
 * @template T - The expected return type.
 * @param endpoint - API endpoint path (e.g., '/workflows').
 * @param options - Optional fetch configuration.
 * @param auth - Optional authentication credentials.
 * @param timeout - Request timeout in milliseconds.
 * @returns Promise resolving to the parsed JSON response.
 * @throws Error if the request fails, times out, or returns a non-OK status.
 *
 * @example
 * ```ts
 * const workflows = await apiRequest<Workflow[]>('/workflows', {}, { token, tenantId });
 * ```
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  auth: AuthOptions = {},
  timeout = API_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Add auth headers if provided
  if (auth.token) {
    headers.set("Authorization", `Bearer ${auth.token}`);
  }
  if (auth.tenantId) {
    headers.set("x-tenant-id", auth.tenantId);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Forward cookies for cross-origin requests
    cache: "no-store",
    signal: controller.signal,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    clearTimeout(id);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error || `API Request failed: ${response.statusText}`,
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw err;
  }
}
