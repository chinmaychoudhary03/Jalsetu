import { create } from 'zustand';

const getInitialState = () => {
  const token = localStorage.getItem('jalsathi_token');
  const userStr = localStorage.getItem('jalsathi_user');
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return { token, user, isAuthenticated: true };
    } catch (e) {
      localStorage.removeItem('jalsathi_token');
      localStorage.removeItem('jalsathi_user');
    }
  }
  return { token: null, user: null, isAuthenticated: false };
};

const useAuthStore = create((set) => ({
  ...getInitialState(),
  
  login: (token, user) => {
    localStorage.setItem('jalsathi_token', token);
    localStorage.setItem('jalsathi_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('jalsathi_token');
    localStorage.removeItem('jalsathi_user');
    set({ token: null, user: null, isAuthenticated: false });
  },
  
  initAuth: () => {
    const currentState = getInitialState();
    set(currentState);
  }
}));

export default useAuthStore;
