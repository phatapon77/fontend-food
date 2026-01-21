import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { DollarSign, ShoppingBag, Store, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalShops: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 1. ดึงข้อมูลออเดอร์ทั้งหมด
      const orderRes = await api.getOrders();
      const orders = orderRes.data;

      // 2. ดึงข้อมูลร้านค้าทั้งหมด
      const shopRes = await api.getShops();

      // 3. คำนวณตัวเลขสรุป
      const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      
      setStats({
        totalSales: totalSales,
        totalOrders: orders.length,
        totalShops: shopRes.data.length
      });

      setRecentOrders(orders.slice(0, 10)); // เอาแค่ 10 ออเดอร์ล่าสุดมาโชว์
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📊 ภาพรวมระบบ (Dashboard)</h1>

      {/* --- ส่วนการ์ดแสดงสถิติ (Stats Cards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: ยอดขายรวม */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">ยอดขายรวม (Total Revenue)</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">฿{stats.totalSales.toLocaleString()}</h3>
          </div>
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Card 2: จำนวนออเดอร์ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">ออเดอร์ทั้งหมด (Total Orders)</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalOrders}</h3>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Card 3: ร้านค้า */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">ร้านค้าที่เปิดอยู่ (Active Shops)</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalShops}</h3>
          </div>
          <div className="bg-orange-100 p-3 rounded-full text-orange-600">
            <Store size={24} />
          </div>
        </div>
      </div>

      {/* --- ส่วนตารางออเดอร์ล่าสุด --- */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-lg text-gray-700 flex items-center gap-2">
                <Clock size={18} /> ออเดอร์ล่าสุด
            </h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="p-4 text-sm font-semibold text-gray-600">ลูกค้า</th>
              <th className="p-4 text-sm font-semibold text-gray-600">ร้านค้า</th>
              <th className="p-4 text-sm font-semibold text-gray-600">ยอดเงิน</th>
              <th className="p-4 text-sm font-semibold text-gray-600">สถานะ</th>
              <th className="p-4 text-sm font-semibold text-gray-600">เวลาสั่ง</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentOrders.length === 0 ? (
                <tr><td colSpan="6" className="p-6 text-center text-gray-400">ยังไม่มีรายการสั่งซื้อ</td></tr>
            ) : (
                recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-500">#{order.id}</td>
                    <td className="p-4 font-medium">{order.customer_name || 'Guest'}</td>
                    <td className="p-4">{order.restaurant_name}</td>
                    <td className="p-4 font-bold text-green-600">฿{Number(order.total_amount).toLocaleString()}</td>
                    <td className="p-4">
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                            {order.order_status}
                        </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString('th-TH')}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;