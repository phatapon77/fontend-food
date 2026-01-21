import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api'; // ตรวจสอบ path ให้ตรงกับไฟล์ api.js ของคุณ
import { Trash2, Plus, Store, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageShops = () => {
  const [shops, setShops] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', phone: '', image: '' });
  const navigate = useNavigate();

  // โหลดข้อมูลร้านค้าตอนเปิดหน้า
  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      const res = await api.getShops();
      setShops(res.data);
    } catch (error) {
      console.error("Error loading shops:", error);
    }
  };

  // ฟังก์ชันเพิ่มร้านค้า
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("กรุณาใส่ชื่อร้าน");
    
    try {
      await api.createShop(form); 
      alert("เพิ่มร้านสำเร็จ! 🎉");
      setForm({ name: '', address: '', phone: '', image: '' }); // ล้างฟอร์ม
      loadShops(); // โหลดข้อมูลใหม่
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเพิ่มร้าน");
    }
  };

  // ฟังก์ชันลบร้านค้า
  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันจะลบร้านนี้? (เมนูอาหารในร้านจะหายไปด้วยนะ)")) return;
    try {
      await api.deleteShop(id);
      loadShops();
    } catch (err) {
      alert("ลบไม่ได้ (อาจมีออเดอร์ค้างอยู่)");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
        <Store className="text-orange-600" size={32} /> จัดการร้านค้า (Admin)
      </h1>

      {/* Form เพิ่มร้านค้า */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h3 className="font-bold mb-4 text-lg text-gray-700">เพิ่มร้านค้าใหม่</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            placeholder="ชื่อร้าน (เช่น Pizza Hut)" 
            className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            required
          />
          <input 
            placeholder="ที่อยู่" 
            className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
            value={form.address} 
            onChange={e => setForm({...form, address: e.target.value})} 
            required
          />
          <input 
            placeholder="เบอร์โทร" 
            className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
            value={form.phone} 
            onChange={e => setForm({...form, phone: e.target.value})} 
          />
          <input 
            placeholder="URL รูปภาพ (Optional)" 
            className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
            value={form.image} 
            onChange={e => setForm({...form, image: e.target.value})} 
          />
          <button type="submit" className="bg-orange-600 text-white p-3 rounded-lg font-bold hover:bg-orange-700 md:col-span-2 flex justify-center items-center gap-2 transition shadow-lg shadow-orange-200">
            <Plus size={20}/> บันทึกร้านค้า
          </button>
        </form>
      </div>

      {/* ตารางแสดงร้านค้า */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">ร้านค้า</th>
              <th className="p-4 font-semibold text-gray-600">ที่อยู่</th>
              <th className="p-4 font-semibold text-gray-600 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shops.length === 0 ? (
                <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">ยังไม่มีข้อมูลร้านค้า</td>
                </tr>
            ) : (
                shops.map(shop => (
                <tr key={shop.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-500">#{shop.id}</td>
                    <td className="p-4 font-bold text-gray-800">{shop.name}</td>
                    <td className="p-4 text-gray-600">{shop.address}</td>
                    <td className="p-4 text-right space-x-2">
                    
                    {/* ปุ่มจัดการเมนู (สีน้ำเงิน) */}
                    <button 
                        onClick={() => navigate(`/admin/shops/${shop.id}/menus`)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                        title="จัดการเมนูอาหาร"
                    >
                        <List size={20} />
                    </button>

                    {/* ปุ่มลบร้าน (สีแดง) */}
                    <button onClick={() => handleDelete(shop.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="ลบร้านค้า">
                        <Trash2 size={20} />
                    </button>

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

export default ManageShops;