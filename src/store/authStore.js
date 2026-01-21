import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api'; // ✅ Import API เข้ามาใช้งาน

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (username, password) => {
        try {
          // ✅ 1. ส่งข้อมูลไปเช็คที่ Backend (Database จริง)
          const response = await api.login({ username, password });

          // ✅ 2. ถ้า Login ผ่าน (Backend ตอบ success: true)
          if (response.data.success) {
            const userData = response.data.user;

            // บันทึกข้อมูลลง Store
            set({ 
              user: userData, 
              token: null, // (ถ้าอนาคตทำระบบ Token ค่อยใส่ค่าตรงนี้)
              isAuthenticated: true 
            });

            // ส่งค่า role กลับไปให้หน้า Login ตัดสินใจพาไปหน้า Admin/User
            return { success: true, role: userData.role };
          }
        } catch (error) {
          console.error("Login Error:", error);
          return { success: false, error: "Login failed" };
        }
        return { success: false, error: "Invalid credentials" };
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