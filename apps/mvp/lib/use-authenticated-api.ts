import { useAuthStore } from "@/store/use-auth-store";
import { apiRequest } from "@/lib/api-client";

/**
 * Creates an authenticated API request function using credentials from Zustand store.
 * This hook should be used in components that need to make authenticated API calls.
 *
 * @returns A function that wraps apiRequest with auth headers.
 */
export function useAuthenticatedApi() {
  const token = useAuthStore((s) => s.token);
  const tenantId = useAuthStore((s) => s.tenantId);

  return async function authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    return apiRequest<T>(endpoint, options, {
      token: token || undefined,
      tenantId: tenantId || undefined,
    });
  };
}

/**
 * Gets auth credentials for use in React Query hooks.
 * Returns an object with token and tenantId that can be passed to apiRequest.
 */
export function getAuthCredentials() {
  const state = useAuthStore.getState();
  return {
    token: state.token || undefined,
    tenantId: state.tenantId || undefined,
  };
}
