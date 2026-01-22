import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { ClipboardList, User, Store, Clock, RefreshCw } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
    // (Optional) รีเฟรชอัตโนมัติทุก 15 วินาที
    const interval = setInterval(loadOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getOrders();
      setOrders(res.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ClipboardList className="text-orange-600" size={32} /> รายการสั่งซื้อ (Orders)
        </h1>
        <button onClick={loadOrders} className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> รีเฟรชข้อมูล
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="p-4 text-gray-600 font-bold text-sm uppercase">Order ID</th>
                    <th className="p-4 text-gray-600 font-bold text-sm uppercase">ลูกค้า</th>
                    <th className="p-4 text-gray-600 font-bold text-sm uppercase">ร้านค้า</th>
                    <th className="p-4 text-gray-600 font-bold text-sm uppercase text-right">ยอดรวม</th>
                    <th className="p-4 text-gray-600 font-bold text-sm uppercase text-center">สถานะ</th>
                    <th className="p-4 text-gray-600 font-bold text-sm uppercase">เวลาสั่งซื้อ</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="p-8 text-center text-gray-400">ยังไม่มีรายการสั่งซื้อเข้ามาครับ</td>
                    </tr>
                ) : orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-mono text-orange-600 font-bold text-lg">#{order.id}</td>
                        <td className="p-4">
                            <div className="flex items-center gap-2 text-gray-800 font-medium">
                                <User size={16} className="text-gray-400"/> {order.customer_name || 'Guest'}
                            </div>
                        </td>
                        <td className="p-4">
                            <div className="flex items-center gap-2 text-gray-700">
                                <Store size={16} className="text-gray-400"/> {order.restaurant_name}
                            </div>
                        </td>
                        <td className="p-4 text-right font-bold text-gray-900 text-lg">
                            {Number(order.total_amount).toLocaleString()} ฿
                        </td>
                        <td className="p-4 text-center">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border
                                ${order.order_status === 'Pending' 
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                                    : 'bg-green-50 text-green-700 border-green-200'
                                }`}>
                                {order.order_status === 'Pending' ? '⏳ รอดำเนินการ' : '✅ เสร็จสิ้น'}
                            </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Clock size={14}/> {new Date(order.created_at).toLocaleString('th-TH')}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;