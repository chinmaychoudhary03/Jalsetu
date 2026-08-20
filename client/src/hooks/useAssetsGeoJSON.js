import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export const useAssetsGeoJSON = () => {
  return useQuery({
    queryKey: ['assets', 'geojson'],
    queryFn: async () => {
      const response = await api.get('/assets/geojson');
      return response.data;
    },
    staleTime: 120000,
    retry: 1,
  });
};
