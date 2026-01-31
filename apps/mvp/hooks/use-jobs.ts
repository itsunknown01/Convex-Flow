import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import { getAuthCredentials } from "@/lib/use-authenticated-api";
import { useAuthStore } from "@/store/use-auth-store";
import { WorkflowExecution } from "@/types/api";

export function useJobs() {
  const token = useAuthStore((s) => s.token);

  return useQuery<WorkflowExecution[]>({
    queryKey: ["jobs"],
    queryFn: () =>
      apiRequest<WorkflowExecution[]>(
        "/workflows/executions",
        {},
        getAuthCredentials(),
      ),
    enabled: !!token, // Only run when authenticated
    refetchInterval: 5000,
  });
}

export function useApprovals() {
  const token = useAuthStore((s) => s.token);

  return useQuery<WorkflowExecution[]>({
    queryKey: ["approvals"],
    queryFn: async () => {
      const allJobs = await apiRequest<WorkflowExecution[]>(
        "/workflows/executions",
        {},
        getAuthCredentials(),
      );
      return allJobs.filter((job) => job.status === "AWAITING_APPROVAL");
    },
    enabled: !!token, // Only run when authenticated
    refetchInterval: 10000,
  });
}

export function useExecution(id: string) {
  const token = useAuthStore((s) => s.token);

  return useQuery<WorkflowExecution>({
    queryKey: ["execution", id],
    queryFn: () =>
      apiRequest<WorkflowExecution>(
        `/workflows/executions/${id}`,
        {},
        getAuthCredentials(),
      ),
    enabled: !!id && !!token, // Only run when authenticated and id exists
    refetchInterval: (query) =>
      query.state.data?.status === "RUNNING" ? 2000 : false,
  });
}

export function useUpdateExecutionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest<WorkflowExecution>(
        `/workflows/executions/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
        getAuthCredentials(),
      ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["execution", id] });
    },
  });
}

export function useRunWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { workflowDefinitionId: string; input?: any }) =>
      apiRequest<WorkflowExecution>(
        "/workflows/executions",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        getAuthCredentials(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
