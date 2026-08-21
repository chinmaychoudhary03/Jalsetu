import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export const useAssetsGeoJSON = () => {
  return useQuery({
    queryKey: ['assets', 'geojson'],
    queryFn: async () => {
      try {
        const response = await api.get('/assets/geojson');
        return response.data;
      } catch (err) {
        console.warn('Backend API unreachable — using client-side mock GeoJSON data');
        const { mockClientData } = await import('../data/mockData');
        return mockClientData.assetsGeoJSON;
      }
    },
    staleTime: 120000,
    retry: 1,
  });
};
