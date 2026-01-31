import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import { getAuthCredentials } from "@/lib/use-authenticated-api";
import { useAuthStore } from "@/store/use-auth-store";
import { LedgerEntry } from "@/types/api";

export function useAuditLogs(limit = 50, offset = 0) {
  const token = useAuthStore((s) => s.token);

  return useQuery<LedgerEntry[]>({
    queryKey: ["audit-logs", limit, offset],
    queryFn: () =>
      apiRequest<LedgerEntry[]>(
        `/audit/logs?limit=${limit}&offset=${offset}`,
        {},
        getAuthCredentials(),
      ),
    enabled: !!token, // Only run when authenticated
    staleTime: 60000,
  });
}
