import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
// ใช้ไอคอนมาตรฐาน
import { TrendingUp, ShoppingBag, Store, Clock, DollarSign, LayoutDashboard, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalShops: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 🛡️ Safety Check 1: เช็คว่า api โหลดมาได้ไหม
      if (!api) throw new Error("ไม่พบไฟล์ api.js หรือการ import ผิดพลาด");
      
      // 🛡️ Safety Check 2: เช็คว่ามีฟังก์ชัน getOrders และ getShops ไหม
      if (typeof api.getOrders !== 'function' || typeof api.getShops !== 'function') {
        throw new Error("ฟังก์ชัน api.getOrders หรือ api.getShops หายไป! (กรุณาเช็คไฟล์ src/services/api.js)");
      }

      // ดึงข้อมูล
      const [ordersRes, shopsRes] = await Promise.all([
        api.getOrders(),
        api.getShops()
      ]);

      // 🛡️ Safety Check 3: เช็คว่าเป็น Array ไหม (ถ้า Backend พังอาจส่งอย่างอื่นมา)
      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const shops = Array.isArray(shopsRes.data) ? shopsRes.data : [];

      console.log("✅ Dashboard Data Loaded:", { orders, shops });

      // คำนวณยอดขาย
      const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
      const pending = orders.filter(o => o.order_status === 'Pending').length;

      setStats({
        totalSales,
        totalOrders: orders.length,
        totalShops: shops.length,
        pendingOrders: pending
      });

      setRecentOrders(orders.slice(0, 5));

    } catch (err) {
      console.error("❌ Dashboard Error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // แสดงหน้าโหลด
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
        <p>กำลังประมวลผลข้อมูล...</p>
    </div>
  );

  // แสดงหน้า Error แทนหน้าขาว
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border-l-4 border-red-500">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด!</h2>
            <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm font-mono mb-6">{error}</p>
            <button 
                onClick={() => window.location.reload()} 
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
            >
                ลองใหม่อีกครั้ง
            </button>
        </div>
    </div>
  );

  // หน้า Dashboard ปกติ
  return (
    <div className="p-8 min-h-screen bg-gray-50/50 font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="text-orange-600" /> ภาพรวมระบบ
        </h1>
        <p className="text-gray-500 mt-1">สรุปข้อมูลยอดขายและกิจกรรมล่าสุด</p>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1: ยอดขายรวม */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <DollarSign size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-bold">ยอดขายรวม</p>
                <h3 className="text-2xl font-extrabold text-gray-800">฿{stats.totalSales.toLocaleString()}</h3>
            </div>
        </div>

        {/* Card 2: ออเดอร์ทั้งหมด */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <ShoppingBag size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-bold">ออเดอร์ทั้งหมด</p>
                <h3 className="text-2xl font-extrabold text-gray-800">{stats.totalOrders}</h3>
            </div>
        </div>

        {/* Card 3: ร้านค้า */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                <Store size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-bold">ร้านค้าในระบบ</p>
                <h3 className="text-2xl font-extrabold text-gray-800">{stats.totalShops}</h3>
            </div>
        </div>

        {/* Card 4: รอการดำเนินการ */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                <Clock size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-bold">ออเดอร์รออนุมัติ</p>
                <h3 className="text-2xl font-extrabold text-gray-800">{stats.pendingOrders}</h3>
            </div>
        </div>
      </div>

      {/* --- Recent Orders --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-orange-500"/> รายการสั่งซื้อล่าสุด
            </h3>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase">
                            <th className="py-3 font-semibold">Order ID</th>
                            <th className="py-3 font-semibold">ลูกค้า</th>
                            <th className="py-3 font-semibold text-right">ยอดเงิน</th>
                            <th className="py-3 font-semibold text-center">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {recentOrders.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-8 text-gray-400">ยังไม่มีรายการสั่งซื้อ</td></tr>
                        ) : recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                <td className="py-3 text-sm font-bold text-orange-600">#{order.id}</td>
                                <td className="py-3 text-sm text-gray-700">{order.customer_name || 'Guest'}</td>
                                <td className="py-3 text-sm font-bold text-gray-900 text-right">{order.total_amount} ฿</td>
                                <td className="py-3 text-center">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border
                                        ${order.order_status === 'Pending' 
                                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                                            : 'bg-green-50 text-green-700 border-green-200'}
                                    `}>
                                        {order.order_status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        
        {/* Tips Section */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-2">💡 Tips for Admin</h3>
            <p className="opacity-90 text-sm mb-6">
                ระบบจัดการร้านค้าของคุณพร้อมใช้งานแล้ว! ลองตรวจสอบเมนูและออเดอร์ใหม่ๆ ได้เลย
            </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;