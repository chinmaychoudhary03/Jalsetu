import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import useUiStore from '../store/uiStore';
import { addToQueue } from '../lib/offlineQueue';

export const usePayments = () => {
  const queryClient = useQueryClient();
  const { isOnline, incrementPending } = useUiStore();

  // Create Razorpay payment order
  const createOrderMutation = useMutation({
    mutationFn: async ({ billId, amount }) => {
      const response = await api.post('/payments/create-order', { bill_id: billId, amount: Number(amount) });
      return response.data;
    }
  });

  // Verify and reconcile payment
  const verifyPaymentMutation = useMutation({
    mutationFn: async ({ billId, orderId, paymentId, paymentMode }) => {
      const payload = {
        bill_id: billId,
        order_id: orderId,
        razorpay_payment_id: paymentId || `pay_mock_${Date.now()}`,
        payment_mode: paymentMode || 'upi'
      };

      if (!isOnline) {
        await addToQueue('/payments/verify', 'POST', payload);
        incrementPending();
        return {
          success: true,
          transaction_id: `TXN-OFFLINE-${Date.now()}`,
          offline: true
        };
      }

      const response = await api.post('/payments/verify', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['consumers'] });
    }
  });

  return {
    createOrder: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
    verifyPayment: verifyPaymentMutation.mutateAsync,
    isVerifying: verifyPaymentMutation.isPending
  };
};
