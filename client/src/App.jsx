import React, { useEffect, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import useAuthStore from './store/authStore';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const GISMap = lazy(() => import('./pages/GISMap'));
const Assets = lazy(() => import('./pages/Assets'));
const AssetDetail = lazy(() => import('./pages/AssetDetail'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const MaintenanceForm = lazy(() => import('./pages/MaintenanceForm'));
const Inventory = lazy(() => import('./pages/Inventory'));
const InventoryDetail = lazy(() => import('./pages/InventoryDetail'));
const Finance = lazy(() => import('./pages/Finance'));
const Consumers = lazy(() => import('./pages/Consumers'));
const ConsumerDetail = lazy(() => import('./pages/ConsumerDetail'));
const Billing = lazy(() => import('./pages/Billing'));
const BillDetail = lazy(() => import('./pages/BillDetail'));
const Payment = lazy(() => import('./pages/Payment'));
const PaymentConfirmation = lazy(() => import('./pages/PaymentConfirmation'));
const Settings = lazy(() => import('./pages/placeholder/Settings'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const hasToken = !!localStorage.getItem('jalsathi_token');
  if (!isAuthenticated && !hasToken) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (user?.role === 'user') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="maintenance/new" element={<MaintenanceForm />} />
          <Route path="billing" element={<Billing />} />
          <Route path="billing/:id" element={<BillDetail />} />
          <Route path="payments" element={<Payment />} />
          <Route path="payments/confirm" element={<PaymentConfirmation />} />
          <Route path="settings" element={<Settings />} />

          {/* GP Admin Only Administrative Routes */}
          <Route path="map" element={<AdminRoute><GISMap /></AdminRoute>} />
          <Route path="assets" element={<AdminRoute><Assets /></AdminRoute>} />
          <Route path="assets/:id" element={<AdminRoute><AssetDetail /></AdminRoute>} />
          <Route path="inventory" element={<AdminRoute><Inventory /></AdminRoute>} />
          <Route path="inventory/:id" element={<AdminRoute><InventoryDetail /></AdminRoute>} />
          <Route path="finance" element={<AdminRoute><Finance /></AdminRoute>} />
          <Route path="consumers" element={<AdminRoute><Consumers /></AdminRoute>} />
          <Route path="consumers/:id" element={<AdminRoute><ConsumerDetail /></AdminRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
