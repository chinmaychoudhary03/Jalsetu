import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import useUiStore from '../store/uiStore';
import { addToQueue } from '../lib/offlineQueue';

export const useFinance = () => {
  const queryClient = useQueryClient();
  const { isOnline, incrementPending } = useUiStore();

  // Fetch balance summary (total receipts, expenditure, current balance)
  const { data: balanceSummary, isLoading: isBalanceLoading } = useQuery({
    queryKey: ['finance', 'balance'],
    queryFn: async () => {
      const response = await api.get('/finance/balance');
      return response.data;
    },
    staleTime: 30000,
    retry: 1
  });

  // Fetch Digital Cash Book date-wise running balance ledger
  const { data: cashbook = [], isLoading: isCashbookLoading, isError, refetch } = useQuery({
    queryKey: ['finance', 'cashbook'],
    queryFn: async () => {
      const response = await api.get('/finance/cashbook');
      return response.data;
    },
    staleTime: 30000,
    retry: 1
  });

  // Record GP Receipt credited
  const recordReceiptMutation = useMutation({
    mutationFn: async (receiptData) => {
      const payload = {
        type: 'receipt',
        amount: Number(receiptData.amount),
        description: receiptData.description,
        category: receiptData.category || 'GP Grant',
        date: receiptData.date || new Date().toISOString().split('T')[0],
        payment_mode: receiptData.payment_mode || 'neft',
        reference_no: receiptData.reference_no || ''
      };

      if (!isOnline) {
        await addToQueue('/finance/receipt', 'POST', payload);
        incrementPending();
        return { ...payload, id: `offline-${Date.now()}`, offline: true };
      }

      const response = await api.post('/finance/receipt', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  // Record Water Supply Expenditure
  const recordExpenditureMutation = useMutation({
    mutationFn: async (expenditureData) => {
      const payload = {
        type: 'expenditure',
        amount: Number(expenditureData.amount),
        description: expenditureData.description,
        category: expenditureData.category || 'Maintenance',
        date: expenditureData.date || new Date().toISOString().split('T')[0],
        payment_mode: expenditureData.payment_mode || 'cash',
        asset_id: expenditureData.asset_id || '',
        reference_no: expenditureData.reference_no || ''
      };

      if (!isOnline) {
        await addToQueue('/finance/expenditure', 'POST', payload);
        incrementPending();
        return { ...payload, id: `offline-${Date.now()}`, offline: true };
      }

      const response = await api.post('/finance/expenditure', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  return {
    balanceSummary,
    cashbook,
    isLoading: isBalanceLoading || isCashbookLoading,
    isError,
    refetch,
    recordReceipt: recordReceiptMutation.mutateAsync,
    isRecordingReceipt: recordReceiptMutation.isPending,
    recordExpenditure: recordExpenditureMutation.mutateAsync,
    isRecordingExpenditure: recordExpenditureMutation.isPending
  };
};
