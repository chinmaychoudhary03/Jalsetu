import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import useUiStore from '../store/uiStore';
import { addToQueue } from '../lib/offlineQueue';

export const useConsumers = (searchTerm = '', id = null) => {
  const queryClient = useQueryClient();
  const { isOnline, incrementPending } = useUiStore();

  // Fetch list of village consumers with search support
  const { data: consumers = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['consumers', 'list', searchTerm],
    queryFn: async () => {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      const response = await api.get('/consumers', { params });
      return response.data;
    },
    staleTime: 30000,
    retry: 1
  });

  // Fetch single consumer profile with bill history
  const { data: consumerDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['consumers', 'detail', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/consumers/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 30000,
    retry: 1
  });

  // Create new household consumer
  const createConsumerMutation = useMutation({
    mutationFn: async (consumerData) => {
      if (!isOnline) {
        await addToQueue('/consumers', 'POST', consumerData);
        incrementPending();
        return { ...consumerData, id: `CON-OFFLINE-${Date.now()}`, offline: true };
      }
      const response = await api.post('/consumers', consumerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  return {
    consumers,
    consumerDetail,
    isLoading: id ? isDetailLoading : isLoading,
    isError,
    refetch,
    createConsumer: createConsumerMutation.mutateAsync,
    isCreating: createConsumerMutation.isPending
  };
};
