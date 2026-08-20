import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import useUiStore from '../store/uiStore';
import { addToQueue } from '../lib/offlineQueue';

export const useInventory = (id = null) => {
  const queryClient = useQueryClient();
  const { isOnline, incrementPending } = useUiStore();

  // List all inventory items
  const { data: items = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['inventory', 'list'],
    queryFn: async () => {
      const response = await api.get('/inventory');
      return response.data;
    },
    staleTime: 30000,
    retry: 1
  });

  // Single inventory item detail with transaction log
  const { data: itemDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['inventory', 'detail', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/inventory/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 30000,
    retry: 1
  });

  // Record Stock In or Consumption (Stock Out) transaction
  const recordTransactionMutation = useMutation({
    mutationFn: async ({ itemId, type, quantity, remarks }) => {
      const payload = { type, quantity: Number(quantity), remarks };
      if (!isOnline) {
        await addToQueue(`/inventory/${itemId}/transaction`, 'POST', payload);
        incrementPending();
        return { itemId, type, quantity, offline: true };
      }
      const response = await api.post(`/inventory/${itemId}/transaction`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  return {
    items,
    itemDetail,
    isLoading: id ? isDetailLoading : isLoading,
    isError,
    refetch,
    recordTransaction: recordTransactionMutation.mutateAsync,
    isRecording: recordTransactionMutation.isPending
  };
};
