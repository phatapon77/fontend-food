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