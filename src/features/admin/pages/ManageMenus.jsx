import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import axios from 'axios';
import { ArrowLeft, Plus, Trash2, Image as ImageIcon, DollarSign } from 'lucide-react';

const ManageMenus = () => {
  const { shopId } = useParams(); // ดึง ID ร้านจาก URL
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [shopName, setShopName] = useState('');
  const [uploading, setUploading] = useState(false);

  // ฟอร์มสำหรับเพิ่มเมนู
  const [form, setForm] = useState({
    menu_name: '',
    description: '',
    price: '',
    category: 'อาหารจานหลัก',
    image: ''
  });

  useEffect(() => {
    loadData();
  }, [shopId]);

  const loadData = async () => {
    try {
      // 1. ดึงชื่อร้าน
      const shopRes = await api.getShopById(shopId);
      // API อาจส่งกลับมาเป็น array หรือ object
      const shopData = Array.isArray(shopRes.data) ? shopRes.data[0] : shopRes.data;
      setShopName(shopData?.name || 'ร้านค้า');

      // 2. ดึงรายการเมนู
      const menuRes = await api.getMenuByShopId(shopId);
      setMenus(menuRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // ฟังก์ชันอัปรูปภาพ
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // ยิงไปที่ API Upload ของเรา
      const res = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // เอารูปที่ได้มาใส่ในฟอร์ม
      setForm({ ...form, image: res.data.imageUrl });
    } catch (err) {
      alert("อัปโหลดรูปไม่ผ่าน (เช็ค Server หรือยัง?)");
    } finally {
      setUploading(false);
    }
  };

  // ฟังก์ชันบันทึกเมนู
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.menu_name || !form.price) return alert("กรุณากรอกชื่อและราคา");

    try {
      await api.createMenu({ ...form, restaurant_id: shopId });
      alert("เพิ่มเมนูสำเร็จ! 🍛");
      // ล้างฟอร์ม
      setForm({ menu_name: '', description: '', price: '', category: 'อาหารจานหลัก', image: '' });
      loadData(); // โหลดข้อมูลใหม่
    } catch (err) {
      alert("บันทึกไม่สำเร็จ");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("ต้องการลบเมนูนี้ใช่ไหม?")) return;
    try {
      await api.deleteMenu(id);
      loadData();
    } catch(err) { alert("ลบไม่ได้"); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => navigate('/admin/shops')} className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-6 transition">
        <ArrowLeft size={20} /> กลับไปหน้าร้านค้า
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">จัดการเมนูอาหาร 🍽️</h1>
        <p className="text-gray-500">ร้าน: <span className="text-orange-600 font-bold text-lg">{shopName}</span></p>
      </div>

      {/* --- Form เพิ่มเมนู --- */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h3 className="font-bold mb-4 text-gray-700 border-b pb-2">เพิ่มเมนูใหม่</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* ส่วนอัปโหลดรูป (ซ้าย) */}
            <div className="md:col-span-4">
                <div className="h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group hover:border-orange-300 transition">
                    {form.image ? (
                        <img src={form.image} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                        <div className="text-center text-gray-400">
                            <ImageIcon className="mx-auto mb-2 opacity-50" size={32} />
                            <span className="text-sm font-medium">กดเพื่ออัปรูป</span>
                        </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white font-bold backdrop-blur-sm">
                        {uploading ? 'กำลังอัปโหลด...' : 'เลือกรูปภาพ'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                    </label>
                </div>
            </div>

            {/* ส่วนกรอกข้อมูล (ขวา) */}
            <div className="md:col-span-8 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">ชื่อเมนู</label>
                    <input 
                        placeholder="เช่น ข้าวมันไก่" 
                        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                        value={form.menu_name} onChange={e => setForm({...form, menu_name: e.target.value})}
                    />
                </div>
                
                <div className="relative col-span-1">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">ราคา (บาท)</label>
                    <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                        <input 
                            type="number" placeholder="0.00" 
                            className="border p-3 pl-9 w-full rounded-lg focus:ring-2 focus:ring-orange-200 outline-none font-bold text-gray-700"
                            value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                        />
                    </div>
                </div>

                <div className="col-span-1">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">หมวดหมู่</label>
                    <select 
                        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-orange-200 outline-none bg-white cursor-pointer"
                        value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    >
                        <option>อาหารจานหลัก</option>
                        <option>ของทานเล่น</option>
                        <option>เครื่องดื่ม</option>
                        <option>ของหวาน</option>
                        <option>ก๋วยเตี๋ยว</option>
                        <option>ซุป</option>
                        <option>สลัด</option>
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">คำอธิบาย (Optional)</label>
                    <textarea 
                        placeholder="เช่น รสชาติจัดจ้าน..." 
                        className="border p-3 w-full rounded-lg h-20 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                        value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    ></textarea>
                </div>
                
                <button type="submit" className="col-span-2 bg-orange-600 text-white p-3 rounded-lg font-bold hover:bg-orange-700 flex justify-center items-center gap-2 shadow-lg shadow-orange-200 transition transform active:scale-95">
                    <Plus size={20}/> บันทึกเมนู
                </button>
            </div>
        </form>
      </div>

      {/* --- ตารางรายการเมนู --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menus.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                ยังไม่มีเมนูในร้านนี้
            </div>
        ) : menus.map(menu => (
            <div key={menu.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center group hover:shadow-md transition relative">
                <img 
                    src={menu.image || 'https://placehold.co/150?text=No+Img'} 
                    className="w-20 h-20 rounded-lg object-cover bg-gray-100 border" 
                    alt={menu.menu_name}
                />
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 truncate">{menu.menu_name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">{menu.description || '-'}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-orange-600 font-extrabold text-lg">{menu.price} ฿</span>
                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500">{menu.category}</span>
                    </div>
                </div>
                <button 
                    onClick={() => handleDelete(menu.id)} 
                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-2 transition bg-white/80 rounded-full hover:bg-red-50"
                    title="ลบเมนู"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMenus;