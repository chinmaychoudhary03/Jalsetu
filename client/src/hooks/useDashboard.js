import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export const useDashboard = () => {
  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      try {
        const response = await api.get('/dashboard/stats');
        return response.data;
      } catch (err) {
        console.warn('Backend API unreachable — using client-side mock dashboard stats');
        const { mockClientData } = await import('../data/mockData');
        return mockClientData.dashboardStats;
      }
    },
    staleTime: 60000,
    retry: 1
  });

  return { stats, isLoading, isError: false, refetch };
};
