const fs = require('fs');
const path = require('path');

// ฟังก์ชันสำหรับสร้างไฟล์พร้อมสร้างโฟลเดอร์ถ้ายังไม่มี
const createFile = (filePath, content) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim());
  console.log(`✅ Created: ${filePath}`);
};

// --- เนื้อหาไฟล์ต่างๆ ---

const packageJson = `
{
  "name": "food-delivery-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.300.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "tailwind-merge": "^2.2.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.8"
  }
}
`;

const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;

const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

const postcssConfig = `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

const indexHtml = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Food Delivery</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

const mainJsx = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

const indexCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-slide-in {
    animation: slideIn 0.3s ease-out forwards;
  }
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
}
`;

// --- Services & Utils ---

const apiService = `
import axios from 'axios';
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});
export const api = {
  getShops: () => apiClient.get('/restaurants'),
  getShopById: (id) => apiClient.get(\`/restaurants/\${id}\`),
  getMenuByShopId: (shopId) => apiClient.get(\`/menus?restaurant_id=\${shopId}\`),
  createMenu: (data) => apiClient.post('/menus', data),
  updateMenu: (id, data) => apiClient.put(\`/menus/\${id}\`, data),
  deleteMenu: (id) => apiClient.delete(\`/menus/\${id}\`),
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  login: (creds) => apiClient.post('/auth/login', creds), // Mock placeholder
};
export default apiClient;
`;

// --- Stores ---

const cartStore = `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      currentRestaurantId: null,
      totalAmount: 0,
      addToCart: (item, restaurantId) => {
        const { currentRestaurantId } = get();
        if (currentRestaurantId && currentRestaurantId !== restaurantId) {
          if (!window.confirm("เปลี่ยนร้าน? ตะกร้าเดิมจะถูกล้าง")) return;
          set({ cart: [], currentRestaurantId: restaurantId, totalAmount: 0 });
        }
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          const newCart = existing 
            ? state.cart.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...state.cart, { ...item, quantity: 1 }];
          return {
            cart: newCart,
            currentRestaurantId: restaurantId,
            totalAmount: newCart.reduce((sum, i) => sum + (i.price * i.quantity), 0)
          };
        });
      },
      removeFromCart: (itemId) => {
        set((state) => {
          const newCart = state.cart.filter((i) => i.id !== itemId);
          return {
             cart: newCart, 
             totalAmount: newCart.reduce((sum, i) => sum + (i.price * i.quantity), 0),
             currentRestaurantId: newCart.length === 0 ? null : state.currentRestaurantId 
          };
        });
      },
      clearCart: () => set({ cart: [], currentRestaurantId: null, totalAmount: 0 }),
    }),
    { name: 'food-cart-storage' }
  )
);
export default useCartStore;
`;

const authStore = `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (username, password) => {
        // Mock Login
        const mockUser = {
          id: 1,
          username,
          fullname: 'Demo User',
          role: username === 'admin' ? 'admin' : 'customer'
        };
        const mockToken = "mock-jwt-token";
        set({ user: mockUser, token: mockToken, isAuthenticated: true });
        localStorage.setItem('token', mockToken);
        return { success: true, role: mockUser.role };
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      }
    }),
    { name: 'auth-storage' }
  )
);
export default useAuthStore;
`;

// --- Components ---

const protectedRoute = `
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';

export const ProtectedRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roleRequired && user?.role !== roleRequired) return <Navigate to="/" replace />;
  return children;
};
`;

const clientLayout = `
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import CartDrawer from '../client/components/CartDrawer';
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
`;

const cartDrawer = `
import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import useCartStore from '../../../store/cartStore';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, totalAmount, addToCart, removeFromCart, clearCart, currentRestaurantId } = useCartStore();

  const handleCheckout = () => {
    alert("Checkout API Payload ready! (Check console)");
    console.log({
       restaurant_id: currentRestaurantId,
       items: cart.map(i => ({ menu_id: i.id, qty: i.quantity, price: i.price })),
       total: totalAmount
    });
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="p-4 border-b flex justify-between items-center bg-orange-50">
          <h2 className="text-lg font-bold flex items-center gap-2">Your Cart</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? <p className="text-center text-gray-400 mt-10">Empty Cart</p> : 
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div><h4 className="font-semibold">{item.menu_name}</h4><p className="text-sm text-gray-500">{item.price} ฿</p></div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="p-1 bg-gray-100 rounded"><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item, currentRestaurantId)} className="p-1 bg-gray-100 rounded"><Plus size={14} /></button>
                </div>
              </div>
            ))
          }
        </div>
        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between mb-4 text-xl font-bold"><span>Total</span><span>{totalAmount} ฿</span></div>
            <button onClick={handleCheckout} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold">Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartDrawer;
`;

const shopList = `
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const ShopList = () => {
  // Mock Data
  const shops = [
    { id: 1, name: 'Burger King Clone', address: 'Bangkok', image: 'https://placehold.co/600x400/orange/white?text=Burger' },
    { id: 2, name: 'Sushi Express', address: 'Chiang Mai', image: 'https://placehold.co/600x400/black/white?text=Sushi' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Restaurants Near You 🍔</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <Link to={\`/shop/\${shop.id}\`} key={shop.id} className="group bg-white rounded-xl shadow hover:shadow-xl overflow-hidden block">
            <img src={shop.image} alt={shop.name} className="w-full h-48 object-cover group-hover:scale-105 transition" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-1">{shop.name}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-1"><MapPin size={14}/> {shop.address}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default ShopList;
`;

const shopDetails = `
import React from 'react';
import { useParams } from 'react-router-dom';
import useCartStore from '../../../store/cartStore';

const ShopDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCartStore();
  
  // Mock Menu
  const menus = [
    { id: 101, menu_name: 'Signature Burger', price: 159, description: 'Beef patty with cheese' },
    { id: 102, menu_name: 'French Fries', price: 59, description: 'Crispy salted fries' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Menu (Shop ID: {id})</h1>
      <div className="space-y-4">
        {menus.map(item => (
           <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
             <div>
               <h3 className="font-bold text-lg">{item.menu_name}</h3>
               <p className="text-gray-500">{item.description}</p>
               <p className="text-orange-600 font-bold mt-1">{item.price} ฿</p>
             </div>
             <button 
               onClick={() => addToCart({...item}, parseInt(id))} 
               className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-200"
             >
               Add to Cart
             </button>
           </div>
        ))}
      </div>
    </div>
  );
};
export default ShopDetails;
`;

const loginPage = `
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(username, 'password');
    if (res.success) navigate(res.role === 'admin' ? '/admin/dashboard' : '/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input className="w-full border p-2 rounded mb-4" placeholder="Username (admin/customer)" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full border p-2 rounded mb-6" type="password" placeholder="Password (any)" />
        <button className="w-full bg-orange-600 text-white py-2 rounded font-bold">Sign In</button>
      </form>
    </div>
  );
};
export default LoginPage;
`;

const adminLayout = `
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Store, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const AdminLayout = () => {
  const { logout } = useAuthStore();
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold text-orange-500 mb-8">Admin</h2>
        <nav className="space-y-2 flex-1">
          <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800"><LayoutDashboard size={20}/> Dashboard</Link>
          <Link to="/admin/shops" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800"><Store size={20}/> Manage Shops</Link>
        </nav>
        <button onClick={logout} className="flex items-center gap-3 p-3 text-red-400 hover:bg-slate-800"><LogOut size={20}/> Logout</button>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto"><Outlet /></main>
    </div>
  );
};
export default AdminLayout;
`;

const adminDashboard = `
import React from 'react';
const AdminDashboard = () => <h1 className="text-2xl font-bold">Admin Dashboard Overview</h1>;
export default AdminDashboard;
`;

const manageMenus = `
import React from 'react';
const ManageMenus = () => <h1 className="text-2xl font-bold">Manage Menus Page (Code available in previous chat)</h1>;
export default ManageMenus;
`;

const appJsx = `
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
`;

// --- Execution ---

console.log("🚀 Starting Project Generation...");

// Configs
createFile('package.json', packageJson);
createFile('vite.config.js', viteConfig);
createFile('tailwind.config.js', tailwindConfig);
createFile('postcss.config.js', postcssConfig);
createFile('index.html', indexHtml);

// Src Root
createFile('src/main.jsx', mainJsx);
createFile('src/App.jsx', appJsx);
createFile('src/index.css', indexCss);

// Libs & Services
createFile('src/services/api.js', apiService);
createFile('src/lib/utils.js', '// Utility functions');

// Stores
createFile('src/store/cartStore.js', cartStore);
createFile('src/store/authStore.js', authStore);

// Components - Layout
createFile('src/components/layout/ClientLayout.jsx', clientLayout);
createFile('src/components/layout/AdminLayout.jsx', adminLayout);

// Components - Auth
createFile('src/components/auth/ProtectedRoute.jsx', protectedRoute);

// Features - Client
createFile('src/features/client/pages/ShopList.jsx', shopList);
createFile('src/features/client/pages/ShopDetails.jsx', shopDetails);
createFile('src/features/client/components/CartDrawer.jsx', cartDrawer);

// Features - Auth
createFile('src/features/auth/pages/LoginPage.jsx', loginPage);

// Features - Admin
createFile('src/features/admin/pages/Dashboard.jsx', adminDashboard);
createFile('src/features/admin/pages/ManageMenus.jsx', manageMenus);

console.log("🎉 Project Structure Created Successfully!");
console.log("👉 Next Steps:");
console.log("1. npm install");
console.log("2. npm run dev");