import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Store, MapPin, Phone, Search, Plus, 
  Edit, Trash2, X, Image as ImageIcon, List 
} from 'lucide-react';

const ManageShops = () => {
  // ✅ 1. กำหนดค่าเริ่มต้นเป็น Array ว่าง [] เสมอ เพื่อกันหน้าจอขาว
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State สำหรับ Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ id: null, name: '', address: '', phone: '', image: '' });
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      setLoading(true);
      const res = await api.getShops();
      
      // ✅ 2. Safety Check: ตรวจสอบว่า Backend ส่ง Array มาจริงไหม?
      if (res && Array.isArray(res.data)) {
        setShops(res.data);
      } else {
        console.warn("API Data Invalid:", res);
        setShops([]); // ถ้าข้อมูลผิดพลาด ให้ใช้ Array ว่างแทน
      }
    } catch (error) {
      console.error("Error loading shops:", error);
      setShops([]); // ถ้า Error ให้ใช้ Array ว่าง
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setForm({ id: null, name: '', address: '', phone: '', image: '' });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (shop) => {
    setForm({
      id: shop.id,
      name: shop.name || '',
      address: shop.address || '',
      phone: shop.phone || '',
      image: shop.image || ''
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm({ ...form, image: res.data.imageUrl });
    } catch (error) {
      alert("อัปโหลดรูปไม่ผ่าน (กรุณาเช็ค Server)");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("กรุณาใส่ชื่อร้าน");
    
    try {
      if (isEditMode) {
        await api.updateShop(form.id, form);
        alert("แก้ไขเรียบร้อย ✨");
      } else {
        await api.createShop(form);
        alert("สร้างร้านใหม่สำเร็จ 🎉");
      }
      setIsModalOpen(false);
      loadShops();
    } catch (err) {
      console.error(err);
      alert("บันทึกไม่สำเร็จ");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("ยืนยันจะลบร้านนี้?")) return;
    try {
      await api.deleteShop(id);
      loadShops();
    } catch (err) {
      alert("ลบไม่ได้");
    }
  };

  const handleStatusChange = async (id, newStatus, e) => {
    e.stopPropagation();
    try {
      await api.updateShopStatus(id, { status: newStatus });
      loadShops();
    } catch (err) { alert("Error updating status"); }
  };

  // ✅ 3. Safety Filter: กรองข้อมูลโดยเช็คก่อนว่า shops เป็น Array
  const filteredShops = Array.isArray(shops) 
    ? shops.filter(shop => (shop.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50/50 font-sans">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
             <Store className="text-orange-600" /> จัดการร้านค้า
          </h1>
          <p className="text-gray-500 mt-1 ml-1">จัดการข้อมูลและสถานะร้านค้าของคุณ</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="ค้นหาร้านอาหาร..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Add Button */}
          <button 
            onClick={openAddModal}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} /> เพิ่มร้าน
          </button>
        </div>
      </div>

      {/* --- Grid Content --- */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse">กำลังโหลดข้อมูล...</div>
      ) : filteredShops.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed">
            ไม่พบร้านค้า
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredShops.map((shop) => (
            <div 
              key={shop.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full relative"
              onClick={() => openEditModal(shop)}
            >
               {/* Image Area */}
               <div className="h-40 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {shop.image ? (
                      <img 
                        src={shop.image} 
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                      />
                  ) : null}
                  
                  {/* Fallback Image */}
                  <div className={`flex flex-col items-center justify-center text-gray-300 ${shop.image ? 'hidden' : 'flex'}`}>
                      <ImageIcon size={48} />
                      <span className="text-sm font-bold mt-1">No Image</span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                    <select 
                        value={shop.status || 'open'} 
                        onChange={(e) => handleStatusChange(shop.id, e.target.value, e)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border-none shadow-md cursor-pointer outline-none appearance-none text-center
                            ${shop.status === 'open' ? 'bg-green-500 text-white' : 
                              shop.status === 'closed' ? 'bg-red-500 text-white' : 'bg-orange-400 text-white'}
                        `}
                    >
                        <option value="open">OPEN</option>
                        <option value="closed">CLOSED</option>
                        <option value="holiday">HOLIDAY</option>
                    </select>
                  </div>
               </div>

               {/* Content */}
               <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{shop.name}</h3>
                  
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{shop.address || 'ไม่ระบุที่อยู่'}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium mb-4">
                    <Phone size={14} className="shrink-0" />
                    <span>{shop.phone || '-'}</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2 pt-4 border-t border-gray-50">
                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/shops/${shop.id}/menus`); }}
                        className="flex-1 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white py-2 rounded-lg text-xs font-bold transition flex justify-center items-center gap-1"
                    >
                        <List size={14}/> จัดการเมนู
                    </button>
                    <button 
                        onClick={(e) => handleDelete(shop.id, e)}
                        className="w-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition"
                        title="ลบร้าน"
                    >
                        <Trash2 size={16}/>
                    </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {isEditMode ? <Edit size={18} className="text-orange-600"/> : <Plus size={18} className="text-green-600"/>}
                        {isEditMode ? 'แก้ไขข้อมูลร้านค้า' : 'เพิ่มร้านค้าใหม่'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex justify-center mb-6">
                        <div className="relative group w-full h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-orange-400 transition">
                            {form.image ? (
                                <img src={form.image} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <ImageIcon className="mx-auto mb-2 opacity-50" size={32} />
                                    <span className="text-sm font-medium">คลิกเพื่ออัปโหลดรูปหน้าร้าน</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold backdrop-blur-sm">
                                    กำลังอัปโหลด...
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">ชื่อร้านค้า</label>
                            <input 
                                className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-200 outline-none transition" 
                                placeholder="เช่น I-Nong Food"
                                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">เบอร์โทร</label>
                                <input 
                                    className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-200 outline-none transition" 
                                    placeholder="02-xxx-xxxx"
                                    value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">ที่อยู่</label>
                                <input 
                                    className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-200 outline-none transition" 
                                    placeholder="เชียงใหม่"
                                    value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={`w-full text-white py-3.5 rounded-xl font-bold shadow-lg transition mt-4 flex justify-center items-center gap-2
                            ${isEditMode 
                                ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' 
                                : 'bg-green-600 hover:bg-green-700 shadow-green-200'}
                        `}
                    >
                        {isEditMode ? 'บันทึกการแก้ไข' : 'สร้างร้านค้า'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ManageShops;