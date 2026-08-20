import { create } from 'zustand';

const useUiStore = create((set, get) => ({
  isOnline: navigator.onLine,
  pendingCount: 0,
  
  setOnline: (status) => set({ isOnline: status }),
  setSynced: () => set({ pendingCount: 0 }),
  setOffline: () => set({ isOnline: false }),
  incrementPending: () => set((state) => ({ pendingCount: state.pendingCount + 1 })),
  decrementPending: () => set((state) => ({ pendingCount: Math.max(0, state.pendingCount - 1) }))
}));

// Setup offline detection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useUiStore.getState().setOnline(true));
  window.addEventListener('offline', () => useUiStore.getState().setOnline(false));

  setInterval(() => {
    fetch('http://localhost:3001/api/health', { cache: 'no-store' })
      .then((res) => {
        if (res.ok) useUiStore.getState().setOnline(true);
        else useUiStore.getState().setOnline(false);
      })
      .catch(() => useUiStore.getState().setOnline(false));
  }, 30000);
}

export default useUiStore;
