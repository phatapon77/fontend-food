import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'; // เพิ่มไอคอน
import api from '../../../services/api'; // เรียกใช้ axios instance ของคุณ

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ฟังก์ชันเปลี่ยนสถานะออเดอร์
  const updateStatus = async (id, status) => {
    if(!window.confirm(`คุณต้องการเปลี่ยนสถานะเป็น "${status}" ใช่ไหม?`)) return;

    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders(); // โหลดข้อมูลใหม่ทันที
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  // เลือกสีป้ายสถานะ
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // เลือกไอคอนสถานะ
  const getStatusIcon = (status) => {
    if (status === 'Completed') return <CheckCircle size={16} />;
    if (status === 'Cancelled') return <XCircle size={16} />;
    return <Clock size={16} />;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
           📄 รายการสั่งซื้อ (Orders)
        </h1>
        <button 
          onClick={fetchOrders} 
          className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> รีเฟรชข้อมูล
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="p-4">ORDER ID</th>
              <th className="p-4">ลูกค้า</th>
              <th className="p-4">ร้านค้า</th>
              <th className="p-4">ยอดรวม</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4">เวลาสั่งซื้อ</th>
              <th className="p-4 text-center">จัดการ</th> {/* เพิ่มช่องจัดการ */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-orange-600">#{order.id}</td>
                <td className="p-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                        {order.customer_name ? order.customer_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    {order.customer_name || 'ไม่ระบุชื่อ'}
                </td>
                <td className="p-4 text-gray-600">🏠 {order.restaurant_name}</td>
                <td className="p-4 font-bold text-gray-800">{order.total_amount} ฿</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${getStatusColor(order.order_status)}`}>
                    {getStatusIcon(order.order_status)}
                    {order.order_status === 'Pending' ? 'รอตำเนินการ' : 
                     order.order_status === 'Completed' ? 'เสร็จสิ้น' : 
                     order.order_status === 'Cancelled' ? 'ยกเลิกแล้ว' : order.order_status}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-sm">
                    {new Date(order.created_at).toLocaleString('th-TH')}
                </td>
                
                {/* ✅ ปุ่มจัดการ (Action Buttons) */}
                <td className="p-4 flex justify-center gap-2">
                  {order.order_status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => updateStatus(order.id, 'Completed')}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 hover:scale-105 transition tooltip"
                        title="อนุมัติ / เสร็จสิ้น"
                      >
                        <CheckCircle size={20} />
                      </button>
                      
                      <button 
                        onClick={() => updateStatus(order.id, 'Cancelled')}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:scale-105 transition"
                        title="ยกเลิกออเดอร์"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  )}
                  {order.order_status !== 'Pending' && (
                    <span className="text-gray-300 text-sm">-</span>
                  )}
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
                <tr>
                    <td colSpan="7" className="p-10 text-center text-gray-400">
                        ยังไม่มีรายการสั่งซื้อเข้ามา
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;