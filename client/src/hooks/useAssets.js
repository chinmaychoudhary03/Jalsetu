import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export const useAssets = (filters = {}) => {
  const queryClient = useQueryClient();
  const { type, status } = filters;

  const { data: assets, isLoading, isError, refetch } = useQuery({
    queryKey: ['assets', 'list', { type, status }],
    queryFn: async () => {
      const params = {};
      if (type && type !== 'all') params.type = type;
      if (status && status !== 'all') params.status = status;
      
      try {
        const response = await api.get('/assets', { params });
        return response.data;
      } catch (err) {
        console.warn('Backend API unreachable — using client-side mock assets list');
        const { mockClientData } = await import('../data/mockData');
        return mockClientData.assetsList;
      }
    },
    staleTime: 60000,
    retry: 1
  });

  const createAssetMutation = useMutation({
    mutationFn: async (newAssetData) => {
      const payload = {
        id: newAssetData.id || `AST-${Date.now().toString().slice(-4)}`,
        name: newAssetData.name,
        type: newAssetData.type || 'pump',
        status: newAssetData.status || 'operational',
        lat: newAssetData.lat || 17.6834,
        lng: newAssetData.lng || 74.0069,
        attributes: newAssetData.attributes || { capacity: newAssetData.capacity || '10 HP' }
      };
      const response = await api.post('/assets', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  return { 
    assets: assets || [], 
    isLoading, 
    isError, 
    refetch,
    createAsset: createAssetMutation.mutateAsync,
    isCreating: createAssetMutation.isPending
  };
};
