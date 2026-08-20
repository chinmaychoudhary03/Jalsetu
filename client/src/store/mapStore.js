import { create } from 'zustand';

const useMapStore = create((set) => ({
  selectedAsset: null,
  activeTypeFilter: 'all',
  activeStatusFilter: 'all',
  
  setSelectedAsset: (asset) => set({ selectedAsset: asset }),
  clearSelectedAsset: () => set({ selectedAsset: null }),
  setTypeFilter: (type) => set({ activeTypeFilter: type }),
  setStatusFilter: (status) => set({ activeStatusFilter: status })
}));

export default useMapStore;
