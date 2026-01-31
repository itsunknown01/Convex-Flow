import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import { getAuthCredentials } from "@/lib/use-authenticated-api";
import { useAuthStore } from "@/store/use-auth-store";
import { WorkflowDefinition } from "@/types/api";

export function useWorkflows() {
  const token = useAuthStore((s) => s.token);

  return useQuery<WorkflowDefinition[]>({
    queryKey: ["workflows"],
    queryFn: () =>
      apiRequest<WorkflowDefinition[]>(
        "/workflows/definitions",
        {},
        getAuthCredentials(),
      ),
    enabled: !!token, // Only run when authenticated
  });
}

export function useWorkflow(id: string) {
  const token = useAuthStore((s) => s.token);

  return useQuery<WorkflowDefinition>({
    queryKey: ["workflow", id],
    queryFn: () =>
      apiRequest<WorkflowDefinition>(
        `/workflows/definitions/${id}`,
        {},
        getAuthCredentials(),
      ),
    enabled: !!id && !!token,
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WorkflowDefinition>) =>
      apiRequest<WorkflowDefinition>(
        "/workflows/definitions",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        getAuthCredentials(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}
