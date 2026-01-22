import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import ClientLayout from './components/layout/ClientLayout';
import AdminLayout from './components/layout/AdminLayout';

// Client Pages
import ShopList from './features/client/pages/ShopList';
import ShopDetails from './features/client/pages/ShopDetails';
import CartPage from './features/client/pages/CartPage'; // ✅ 1. เพิ่ม Import หน้าตะกร้า
import LoginPage from './features/auth/pages/LoginPage';

// Admin Pages
import AdminDashboard from './features/admin/pages/Dashboard';
import ManageShops from './features/admin/pages/ManageShops';
import ManageMenus from './features/admin/pages/ManageMenus';
import AdminOrders from './features/admin/pages/AdminOrders';

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
          
          {/* ✅ 2. เพิ่ม Route สำหรับหน้าตะกร้าสินค้า */}
          <Route path="cart" element={<CartPage />} />
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
          
          {/* หน้าจัดการร้านค้า */}
          <Route path="shops" element={<ManageShops />} />
          
          {/* หน้าจัดการเมนูอาหาร (เจาะจงร้าน) */}
          <Route path="shops/:shopId/menus" element={<ManageMenus />} />

          {/* หน้ารายการสั่งซื้อ */}
          <Route path="orders" element={<AdminOrders />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;