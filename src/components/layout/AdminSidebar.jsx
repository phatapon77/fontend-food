import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// ✅ เพิ่มไอคอน Globe (รูปโลก) สำหรับปุ่มไปหน้าบ้าน
import { LayoutDashboard, Store, Utensils, ClipboardList, LogOut, Globe } from 'lucide-react'; 
import useAuthStore from '../../store/authStore';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col p-4 shadow-xl z-50">
      
      {/* --- Header --- */}
      <div className="mb-10 px-2 flex items-center gap-3 mt-4">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
            A
        </div>
        <div>
            <h1 className="text-xl font-bold text-white leading-none">Food<span className="text-orange-500">Admin</span></h1>
            <p className="text-xs text-gray-500 mt-1">POS System</p>
        </div>
      </div>

      {/* --- Menu Links --- */}
      <nav className="flex-1 space-y-2">
        
        {/* 1. ภาพรวม */}
        <Link 
          to="/admin/dashboard" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
            ${isActive('/admin/dashboard') 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40 translate-x-1' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
          `}
        >
          <LayoutDashboard size={20} /> ภาพรวม
        </Link>

        {/* 2. จัดการร้านค้า */}
        <Link 
          to="/admin/shops" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
            ${isActive('/admin/shops') && !location.pathname.includes('menus')
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40 translate-x-1' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
          `}
        >
          <Store size={20} /> จัดการร้านค้า
        </Link>

        {/* 3. รายการอาหาร */}
        <Link 
          to="/admin/shops" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
            ${location.pathname.includes('menus') 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40 translate-x-1' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
          `}
        >
          <Utensils size={20} /> รายการอาหาร
        </Link>

        {/* 4. ออเดอร์ */}
        <Link 
          to="/admin/orders" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
            ${isActive('/admin/orders') 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40 translate-x-1' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
          `}
        >
          <ClipboardList size={20} /> ออเดอร์
        </Link>

        {/* ✅ 5. ปุ่มไปหน้าบ้าน (เพิ่มใหม่!) */}
        <div className="pt-4 mt-4 border-t border-gray-800">
            <Link 
            to="/" 
            target="_blank" // เปิดแท็บใหม่จะได้ไม่เสียหน้า Admin
            className="flex items-center gap-3 px-4 py-3 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 rounded-xl transition-all duration-200 font-medium"
            >
            <Globe size={20} /> ไปหน้าบ้าน (ลูกค้า)
            </Link>
        </div>

      </nav>

      {/* --- Footer / Logout --- */}
      <div className="mt-auto pt-2">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl w-full transition font-medium"
        >
          <LogOut size={20} /> ออกจากระบบ
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;