import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Store, Clock, TrendingUp } from 'lucide-react';
import api from '../../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeShops: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ordersRes = await api.get('/orders');
        const shopsRes = await api.get('/restaurants');
        
        const orders = ordersRes.data || [];
        const shops = shopsRes.data || [];

        // 🔥 DEBUG: ดูข้อมูลจริงใน Console (กด F12 -> Console)
        console.log("📌 ข้อมูลออเดอร์ทั้งหมด:", orders);
        if (orders.length > 0) console.log("📌 ตัวอย่างออเดอร์แรก:", orders[0]);

        // คำนวณยอดขาย
        const validOrders = orders.filter(order => {
            const s = getSafeStatus(order); 
            return s !== 'cancelled' && s !== 'canceled';
        });
        
        const totalSales = validOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

        setStats({
          totalSales: totalSales,
          totalOrders: orders.length,
          activeShops: shops.length,
          completedOrders: orders.filter(o => getSafeStatus(o) === 'completed').length
        });

        setRecentOrders(orders.slice(0, 5));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ ฟังก์ชันดึงสถานะแบบปลอดภัย (ครอบคลุมทุกแบบ)
  const getSafeStatus = (order) => {
      // ลองดึงทุกชื่อที่เป็นไปได้
      const status = order.status || order.order_status || order.state || 'pending';
      return String(status).toLowerCase();
  };

  // ✅ ฟังก์ชันดึงชื่อลูกค้าแบบปลอดภัย
  const getSafeCustomer = (order) => {
      // 1. ลองดึงจาก object user/customer ที่ซ้อนอยู่
      if (order.user && order.user.username) return order.user.username;
      if (order.user && order.user.name) return order.user.name;
      if (order.customer && order.customer.name) return order.customer.name;
      
      // 2. ลองดึงจากฟิลด์ตรงๆ
      if (order.username) return order.username;
      if (order.customer_name) return order.customer_name;
      if (order.first_name) return `${order.first_name} ${order.last_name || ''}`;
      
      // 3. ถ้าไม่มีชื่อ ให้ใช้ ID แทน
      if (order.customer_id) return `User ID: ${order.customer_id}`;
      if (order.user_id) return `User ID: ${order.user_id}`;

      return 'ลูกค้าทั่วไป';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': 
      case 'success': return 'bg-green-100 text-green-700 border-green-200';
      
      case 'cancelled': 
      case 'canceled': return 'bg-red-100 text-red-700 border-red-200';
      
      case 'pending': 
      case 'waiting': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      
      case 'processing': 
      case 'cooking': return 'bg-blue-100 text-blue-700 border-blue-200';
      
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': 
      case 'success': return 'สำเร็จ';
      
      case 'cancelled': 
      case 'canceled': return 'ยกเลิก';
      
      case 'pending': 
      case 'waiting': return 'รอตรวจสอบ';
      
      case 'processing': 
      case 'cooking': return 'กำลังปรุง';
      
      default: return status || 'รอสถานะ';
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">กำลังโหลดข้อมูลแดชบอร์ด...</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <TrendingUp className="text-orange-600" /> ภาพรวมระบบ
            </h1>
            <p className="text-gray-500 mt-1">สรุปข้อมูลยอดขายและกิจกรรมล่าสุด</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><DollarSign size={24} /></div>
                <div><p className="text-sm text-gray-400 font-medium">ยอดขายรวม (สุทธิ)</p><h3 className="text-2xl font-black text-gray-900">฿{stats.totalSales.toLocaleString()}</h3></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><ShoppingBag size={24} /></div>
                <div><p className="text-sm text-gray-400 font-medium">ออเดอร์ทั้งหมด</p><h3 className="text-2xl font-black text-gray-900">{stats.totalOrders}</h3></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600"><Store size={24} /></div>
                <div><p className="text-sm text-gray-400 font-medium">ร้านค้าในระบบ</p><h3 className="text-2xl font-black text-gray-900">{stats.activeShops}</h3></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600"><Clock size={24} /></div>
                <div><p className="text-sm text-gray-400 font-medium">ออเดอร์สำเร็จ</p><h3 className="text-2xl font-black text-gray-900">{stats.completedOrders}</h3></div>
            </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">📉 รายการสั่งซื้อล่าสุด</h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">Order ID</th>
                            <th className="p-4 font-semibold">ลูกค้า</th>
                            <th className="p-4 font-semibold text-right">ยอดเงิน</th>
                            <th className="p-4 font-semibold text-center">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {recentOrders.map((order) => {
                            const status = getSafeStatus(order);
                            const customerName = getSafeCustomer(order);
                            
                            return (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-orange-600">#{order.id}</td>
                                    <td className="p-4 text-gray-600 font-medium">{customerName}</td>
                                    <td className="p-4 text-right font-bold text-gray-900">
                                        {parseFloat(order.total_amount).toLocaleString()} ฿
                                    </td>
                                    <td className="p-4 text-center">
                                        {/* ใช้ span แบบ block เพื่อให้มีขนาดแน่นอน */}
                                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border min-w-[100px] h-[26px] ${getStatusColor(status)}`}>
                                            {getStatusText(status)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {recentOrders.length === 0 && (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-400">ยังไม่มีรายการสั่งซื้อ</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;