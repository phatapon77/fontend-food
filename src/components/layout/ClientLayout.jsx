import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, LogOut, User } from 'lucide-react';
import useCartStore from '../../store/cartStore'; // ✅ Import store เพื่อดึงจำนวนสินค้า

const ClientLayout = () => {
  const navigate = useNavigate();
  
  // ดึงจำนวนสินค้าในตะกร้ามาโชว์ที่ปุ่มแดงๆ
  const { items } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // ข้อมูล User (จำลอง)
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Admin User', role: 'ADMIN' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans relative">
      
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* --- Navbar --- */}
      <nav className="bg-white sticky top-0 z-40 border-b border-gray-200/60 shadow-sm backdrop-blur-md bg-white/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center cursor-pointer gap-2" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 rotate-3 hover:rotate-0 transition-all duration-300">
                  <span className="text-2xl">🍔</span>
              </div>
              <div className="flex flex-col">
                  <span className="text-xl font-black text-gray-800 tracking-tight leading-none">Food<span className="text-orange-600">App</span></span>
                  <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Delivery</span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-5">
              
              <button 
                  onClick={() => navigate('/admin/shops')}
                  className="hidden md:flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                  <ShieldCheck size={16} /> 
                  ระบบหลังบ้าน
              </button>

              {/* 🔥 ปุ่มตะกร้า (แก้ตรงนี้!) */}
              <button 
                onClick={() => navigate('/cart')} // ✅ ใส่คำสั่งให้ไปหน้า Cart
                className="relative p-3 bg-white border border-gray-100 hover:bg-orange-50 text-gray-500 hover:text-orange-600 rounded-2xl transition-all group shadow-sm cursor-pointer"
              >
                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                
                {/* Badge แดงๆ บอกจำนวนสินค้า */}
                {totalItems > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1 -translate-y-1">
                        {totalItems}
                    </span>
                )}
              </button>

              <div className="h-8 w-[1px] bg-gray-300 hidden sm:block mx-1"></div>

              {/* User Profile */}
              <div className="flex items-center gap-1 pl-1">
                 <div className="flex items-center gap-3 bg-white border border-gray-200 pr-2 pl-2 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 border border-orange-200">
                        <User size={18} />
                    </div>
                    <div className="flex flex-col pr-2 hidden sm:flex">
                        <span className="text-sm font-bold text-gray-800 leading-none">{user.username}</span>
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wide mt-0.5">{user.role}</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all ml-1"
                        title="ออกจากระบบ"
                    >
                        <LogOut size={14} />
                    </button>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 fade-in pb-10">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;