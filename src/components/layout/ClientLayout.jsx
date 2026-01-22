import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, ShieldCheck } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import CartDrawer from "../../features/client/components/CartDrawer"; // ✅ ต้องสร้างไฟล์นี้ด้วย (ดูข้อ 2)

const ClientLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logout } = useAuthStore();
  
  // 🔴 แก้ตรงนี้: ใน Store เราตั้งชื่อว่า items ไม่ใช่ cart
  const { items } = useCartStore(); 
  
  const navigate = useNavigate();

  // คำนวณจำนวนสินค้า
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* --- Navbar --- */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* โลโก้ */}
          <Link to="/" className="text-2xl font-extrabold text-orange-600 tracking-tight hover:opacity-80 transition">
            Food<span className="text-gray-800">App</span> 🍔
          </Link>

          {/* เมนูขวา */}
          <div className="flex items-center gap-4">
            
            {/* ปุ่ม Admin (เฉพาะ Admin) */}
            {user?.role === 'admin' && (
              <Link 
                to="/admin/shops" 
                className="hidden md:flex items-center gap-1 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-700 transition shadow-md"
              >
                <ShieldCheck size={16} /> หลังบ้าน
              </Link>
            )}

            {/* ปุ่มตะกร้า (เปิด Drawer) */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1/4 -translate-y-1/4">
                  {cartCount}
                </span>
              )}
            </button>

            {/* ส่วน User / Login */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200 ml-2">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-gray-800 leading-tight">{user.fullname || user.username}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">{user.role}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition" 
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-bold transition ml-2"
              >
                <User size={20} /> <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* --- เนื้อหาหลัก --- */}
      <main className="container mx-auto p-4 py-8">
        <Outlet />
      </main>

      {/* --- Drawer ตะกร้าสินค้า --- */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default ClientLayout;