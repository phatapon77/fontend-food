import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import CartDrawer from "../../features/client/components/CartDrawer";
import useAuthStore from '../../store/authStore';

const ClientLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCartStore();
  const { isAuthenticated, logout } = useAuthStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-orange-600">FoodApp</Link>
          <div className="flex items-center gap-4">
             {isAuthenticated ? (
               <button onClick={logout} className="text-sm text-gray-500">Logout</button>
             ) : (
               <Link to="/login" className="flex items-center gap-1 text-gray-600"><User size={20}/> Login</Link>
             )}
             <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-orange-50 rounded-full text-gray-600">
               <ShoppingBag size={24} />
               {cartCount > 0 && (
                 <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                   {cartCount}
                 </span>
               )}
             </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4 py-8">
        <Outlet />
      </main>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};
export default ClientLayout;