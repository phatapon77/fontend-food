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