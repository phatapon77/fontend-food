import React, { useState } from 'react';
import useAuthStore from '../../../store/authStore'; 
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react'; // (ถ้าไม่มีบรรทัดนี้แล้ว Error ให้ลบออกได้ครับ)

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // เรียกฟังก์ชัน Login
    const result = await login(form.username, form.password);
    
    if (result.success) {
      alert("ยินดีต้อนรับ! เข้าสู่ระบบสำเร็จ 🎉");
      
      // พาไปหน้า Admin หรือ User ตาม Role
      if (result.role === 'admin') {
        navigate('/admin/shops'); // หรือ /admin ตามที่คุณตั้ง Route ไว้
      } else {
        navigate('/');
      }
    } else {
      alert("Login ไม่ผ่าน: " + (result.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">เข้าสู่ระบบ 🔐</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
           {/* ช่องกรอก Username */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้ (Username)</label>
             <input 
               type="text" 
               name="username"
               value={form.username}
               onChange={handleChange}
               className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
               placeholder="เช่น por0011"
               required
             />
           </div>

           {/* ช่องกรอก Password */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน (Password)</label>
             <input 
               type="password" 
               name="password"
               value={form.password}
               onChange={handleChange}
               className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
               placeholder="••••••••"
               required
             />
           </div>
           
           {/* ปุ่ม Submit */}
           <button 
             type="submit" 
             className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition duration-200 flex justify-center items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
           >
             <LogIn size={20} /> Sign In
           </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          ยังไม่มีบัญชี? <span className="text-orange-600 cursor-pointer hover:underline">สมัครสมาชิก</span>
        </p>
      </div>
    </div>
  );
};

// ✅ ต้องมีบรรทัดนี้หน้าเว็บถึงจะหายขาวครับ!
export default LoginPage;