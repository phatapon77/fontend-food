import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api'; // เช็ค path api ให้ถูกนะครับ
import { Trash2, Plus, ArrowLeft, Utensils } from 'lucide-react';

const ManageMenus = () => {
  const { shopId } = useParams(); // รับ ID ร้านจาก URL
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ menu_name: '', description: '', price: '', category: 'Main Dish' });

  // โหลดข้อมูลเมนูทันทีที่เข้ามาหน้านี้
  useEffect(() => {
    loadData();
  }, [shopId]);

  const loadData = async () => {
    try {
      const menuRes = await api.getMenuByShopId(shopId);
      setMenus(menuRes.data);
    } catch (error) {
      console.error("Error loading menus:", error);
    }
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    try {
      // ส่งข้อมูลไปบันทึก โดยแนบ shopId ไปด้วย
      await api.createMenu({ ...form, restaurant_id: shopId });
      alert("เพิ่มเมนูเรียบร้อย! 🍜");
      setForm({ menu_name: '', description: '', price: '', category: 'Main Dish' }); // ล้างฟอร์ม
      loadData(); // โหลดข้อมูลใหม่
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเพิ่มเมนู");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("ต้องการลบเมนูนี้?")) return;
    try {
      await api.deleteMenu(id);
      loadData();
    } catch (error) {
      alert("ลบเมนูไม่สำเร็จ");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ปุ่มย้อนกลับ */}
      <button onClick={() => navigate('/admin/shops')} className="flex items-center text-gray-500 hover:text-orange-600 mb-4 transition">
        <ArrowLeft size={20} className="mr-1"/> กลับไปหน้าร้านค้า
      </button>

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <Utensils className="text-orange-600"/> จัดการเมนูอาหาร (Shop ID: {shopId})
      </h1>

      {/* Form เพิ่มเมนู */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h3 className="font-bold mb-4 text-lg">เพิ่มเมนูใหม่</h3>
        <form onSubmit={handleAddMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            placeholder="ชื่อเมนู (เช่น ข้าวมันไก่)" 
            className="border p-3 rounded outline-none focus:ring-2 focus:ring-orange-200" 
            value={form.menu_name} 
            onChange={e => setForm({...form, menu_name: e.target.value})} 
            required 
          />
          <input 
            placeholder="ราคา (บาท)" 
            type="number" 
            className="border p-3 rounded outline-none focus:ring-2 focus:ring-orange-200" 
            value={form.price} 
            onChange={e => setForm({...form, price: e.target.value})} 
            required 
          />
          <input 
            placeholder="รายละเอียด (เช่น น้ำจิ้มรสเด็ด)" 
            className="border p-3 rounded outline-none focus:ring-2 focus:ring-orange-200 md:col-span-2" 
            value={form.description} 
            onChange={e => setForm({...form, description: e.target.value})} 
          />
          
          <select 
            className="border p-3 rounded outline-none focus:ring-2 focus:ring-orange-200" 
            value={form.category} 
            onChange={e => setForm({...form, category: e.target.value})}
          >
            <option>Main Dish</option>
            <option>Appetizer</option>
            <option>Dessert</option>
            <option>Drinks</option>
          </select>
          
          <button type="submit" className="bg-orange-600 text-white p-3 rounded font-bold hover:bg-orange-700 flex justify-center items-center gap-2 shadow-md">
            <Plus size={18}/> บันทึกเมนู
          </button>
        </form>
      </div>

      {/* ตารางรายการเมนู */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-gray-600">ชื่อเมนู</th>
              <th className="p-4 text-gray-600">หมวดหมู่</th>
              <th className="p-4 text-gray-600">ราคา</th>
              <th className="p-4 text-right text-gray-600">ลบ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {menus.length === 0 ? (
               <tr><td colSpan="4" className="p-6 text-center text-gray-400">ยังไม่มีเมนูในร้านนี้</td></tr>
            ) : (
               menus.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-gray-800">
                    {m.menu_name} 
                    <div className="text-xs text-gray-400 font-normal mt-1">{m.description}</div>
                  </td>
                  <td className="p-4"><span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">{m.category}</span></td>
                  <td className="p-4 text-green-600 font-bold">{Number(m.price).toLocaleString()} ฿</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded transition">
                        <Trash2 size={18}/>
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

export default ManageMenus;