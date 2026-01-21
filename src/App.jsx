import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import ClientLayout from './components/layout/ClientLayout';
import AdminLayout from './components/layout/AdminLayout';

// Client Pages
import ShopList from './features/client/pages/ShopList';
import ShopDetails from './features/client/pages/ShopDetails';
import LoginPage from './features/auth/pages/LoginPage';

// Admin Pages
import AdminDashboard from './features/admin/pages/Dashboard';
import ManageShops from './features/admin/pages/ManageShops'; // ✅ เพิ่มตัวนี้
import ManageMenus from './features/admin/pages/ManageMenus'; // ✅ เอาตัวซ้ำออกเหลืออันเดียว

import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Client Routes (ลูกค้า) */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<ShopList />} />
          <Route path="shop/:id" element={<ShopDetails />} />
        </Route>

        {/* Admin Routes (แอดมิน) */}
        <Route path="/admin" element={
          <ProtectedRoute roleRequired="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          {/* เข้า /admin เฉยๆ ให้เด้งไป Dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* ✅ หน้าจัดการร้านค้า */}
          <Route path="shops" element={<ManageShops />} />
          
          {/* ✅ หน้าจัดการเมนูอาหาร (เจาะจงร้าน) */}
          <Route path="shops/:shopId/menus" element={<ManageMenus />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;