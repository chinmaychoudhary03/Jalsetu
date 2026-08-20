import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export const useAssetDetail = (id) => {
  const { data: asset, isLoading, isError, refetch } = useQuery({
    queryKey: ['assets', 'detail', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/assets/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 60000,
    retry: 1
  });

  return { asset, isLoading, isError, refetch };
};
