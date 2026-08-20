import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './index.css';
import './i18n';
import LoadingSpinner from './components/shared/LoadingSpinner.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner message="Loading App..." />}>
        <App />
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>,
);
