import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import useUiStore from '../store/uiStore';
import { addToQueue } from '../lib/offlineQueue';

export const useBilling = (statusFilter = 'all', id = null) => {
  const queryClient = useQueryClient();
  const { isOnline, incrementPending } = useUiStore();

  // Fetch bills list
  const { data: bills = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['bills', 'list', statusFilter],
    queryFn: async () => {
      const params = {};
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const response = await api.get('/bills', { params });
      return response.data;
    },
    staleTime: 30000,
    retry: 1
  });

  // Fetch single bill details with consumer info
  const { data: billDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['bills', 'detail', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/bills/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 30000,
    retry: 1
  });

  // Generate bill for single consumer
  const generateBillMutation = useMutation({
    mutationFn: async (billData) => {
      if (!isOnline) {
        await addToQueue('/bills', 'POST', billData);
        incrementPending();
        return { ...billData, id: `BILL-OFFLINE-${Date.now()}`, status: 'pending', offline: true };
      }
      const response = await api.post('/bills', billData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  // Bulk generate bills for all active village consumers
  const bulkGenerateBillsMutation = useMutation({
    mutationFn: async (month) => {
      if (!isOnline) {
        await addToQueue('/bills/bulk', 'POST', { month });
        incrementPending();
        return { success: true, offline: true };
      }
      const response = await api.post('/bills/bulk', { month });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  return {
    bills,
    billDetail,
    isLoading: id ? isDetailLoading : isLoading,
    isError,
    refetch,
    generateBill: generateBillMutation.mutateAsync,
    isGenerating: generateBillMutation.isPending,
    bulkGenerateBills: bulkGenerateBillsMutation.mutateAsync,
    isBulkGenerating: bulkGenerateBillsMutation.isPending
  };
};
