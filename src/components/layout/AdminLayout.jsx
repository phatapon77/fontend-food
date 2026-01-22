import React from 'react';
import { Outlet } from 'react-router-dom'; // ✅ 1. ต้อง Import ตัวนี้
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* ส่วนเมนูซ้าย (Fixed อยู่กับที่) */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 shadow-xl">
        <AdminSidebar />
      </div>

      {/* ส่วนเนื้อหาขวา (Content) */}
      {/* ✅ 2. ต้องเว้น margin-left-64 เพื่อไม่ให้ Sidebar บังเนื้อหา */}
      <div className="flex-1 ml-64 min-h-screen">
        <div className="p-8">
           {/* ✅ 3. Outlet คือ "รู" ที่เนื้อหาหน้า Dashboard/Orders จะมาโผล่ตรงนี้ */}
           <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;