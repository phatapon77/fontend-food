import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './components/layout/ClientLayout';
import AdminLayout from './components/layout/AdminLayout';
import ShopList from './features/client/pages/ShopList';
import ShopDetails from './features/client/pages/ShopDetails';
import LoginPage from './features/auth/pages/LoginPage';
import AdminDashboard from './features/admin/pages/Dashboard';
import ManageMenus from './features/admin/pages/ManageMenus';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Client */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<ShopList />} />
          <Route path="shop/:id" element={<ShopDetails />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute roleRequired="admin"><AdminLayout /></ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="shops" element={<ManageMenus />} /> {/* Placeholder reuse */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;