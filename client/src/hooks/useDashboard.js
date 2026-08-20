import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export const useDashboard = () => {
  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data;
    },
    staleTime: 60000,
    retry: 1
  });

  return { stats, isLoading, isError, refetch };
};
