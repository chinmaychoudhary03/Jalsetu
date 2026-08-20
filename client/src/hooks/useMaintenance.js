import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import useUiStore from '../store/uiStore';
import { addToQueue } from '../lib/offlineQueue';

export const useMaintenance = (statusFilter = 'all') => {
  const queryClient = useQueryClient();
  const { isOnline, incrementPending } = useUiStore();

  const { data: tickets = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['maintenance', 'list', statusFilter],
    queryFn: async () => {
      const params = {};
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const response = await api.get('/maintenance', { params });
      return response.data;
    },
    staleTime: 30000,
    retry: 1
  });

  const reportIssueMutation = useMutation({
    mutationFn: async (issueData) => {
      if (!isOnline) {
        // Offline mode: queue in IndexedDB
        await addToQueue('/maintenance', 'POST', issueData);
        incrementPending();
        return { ...issueData, id: `offline-${Date.now()}`, status: 'reported', offline: true };
      }
      const response = await api.post('/maintenance', issueData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      if (!isOnline) {
        await addToQueue(`/maintenance/${id}/status`, 'PUT', { status });
        incrementPending();
        return { id, status, offline: true };
      }
      const response = await api.put(`/maintenance/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    }
  });

  return {
    tickets,
    isLoading,
    isError,
    refetch,
    reportIssue: reportIssueMutation.mutateAsync,
    isReporting: reportIssueMutation.isPending,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdating: updateStatusMutation.isPending
  };
};
