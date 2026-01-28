import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Phone, Search, Plus, Edit, Trash2, X, Image as ImageIcon, List, QrCode } from 'lucide-react';
import api from '../../../services/api';

const ManageShops = () => {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [form, setForm] = useState({ 
    id: null, 
    name: '', 
    address: '', 
    phone: '', 
    image: '', 
    promptpay_image: '', 
    status: 'open' 
  });
  
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      setLoading(true);
      const res = await api.get('/restaurants'); 
      if (res.data && Array.isArray(res.data)) {
        setShops(res.data);
      } else {
        setShops([]);
      }
    } catch (error) {
      console.error("Error loading shops:", error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setForm({ id: null, name: '', address: '', phone: '', image: '', promptpay_image: '', status: 'open' });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (shop) => {
    setForm({
      id: shop.id,
      name: shop.name || '',
      address: shop.address || '',
      phone: shop.phone || '',
      image: shop.image || '',
      promptpay_image: shop.promptpay_image || '', 
      status: shop.status || 'open'
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // --- Upload Function ---
  const uploadFile = async (file, type) => {
    if (!file) return;
    
    if (type === 'cover') setUploadingCover(true);
    else setUploadingQr(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (type === 'cover') {
        setForm(prev => ({ ...prev, image: res.data.imageUrl }));
      } else {
        setForm(prev => ({ ...prev, promptpay_image: res.data.imageUrl }));
      }
    } catch (error) {
      alert("อัปโหลดไม่สำเร็จ: " + error.message);
    } finally {
      if (type === 'cover') setUploadingCover(false);
      else setUploadingQr(false);
    }
  };

  const handleFileChange = (e, type) => {
    uploadFile(e.target.files[0], type);
  };

  const handlePaste = (e, type) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        uploadFile(file, type);
        break; 
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("กรุณาระบุชื่อร้าน");
    
    try {
      const payload = {
        name: form.name,
        address: form.address,
        phone: form.phone,
        image: form.image || "",
        promptpay_image: form.promptpay_image || "",
        status: form.status
      };

      if (isEditMode) {
        await api.put(`/restaurants/${form.id}`, payload);
      } else {
        await api.post('/restaurants', payload);
      }
      setIsModalOpen(false);
      loadShops();
    } catch (err) {
      console.error(err);
      alert("บันทึกไม่สำเร็จ: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("ยืนยันการลบร้านค้านี้?")) return;
    try {
      await api.delete(`/restaurants/${id}`);
      loadShops();
    } catch (err) {
      alert("ลบไม่สำเร็จ");
    }
  };

  const handleStatusChange = async (id, newStatus, e) => {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    
    try {
      // 1. Optimistic Update
      setShops(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));

      // 2. ส่งไปที่ Server
      console.log(`Updating Shop ID: ${id} -> ${newStatus}`);
      await api.put(`/restaurants/${id}/status`, { status: newStatus });

    } catch (err) { 
      console.error("Status Update Error:", err);
      loadShops(); 
      alert(`เปลี่ยนสถานะไม่ได้: ${err.response?.data?.error || err.message}`); 
    }
  };

  const filteredShops = shops.filter(shop => 
    (shop.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Store className="text-orange-600" size={32} /> จัดการร้านค้า
                </h1>
                <p className="text-gray-500 mt-1 ml-1 font-medium">
                    คุณมีร้านค้าทั้งหมด <span className="text-orange-600 font-bold">{shops.length}</span> แห่ง
                </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder="ค้นหาร้าน..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={openAddModal} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition-all active:scale-95 whitespace-nowrap">
                    <Plus size={20} /> เพิ่มร้านใหม่
                </button>
            </div>
        </div>

        {/* Grid List */}
        {loading ? (
            <div className="h-96 flex items-center justify-center text-gray-400 font-medium">กำลังโหลด...</div>
        ) : filteredShops.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><Store className="text-gray-300" size={32} /></div>
                <p className="text-gray-500 font-medium">ยังไม่มีร้านค้าในระบบ</p>
                <button onClick={openAddModal} className="mt-4 text-orange-600 font-bold hover:underline">สร้างร้านแรกเลย!</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredShops.map((shop) => (
                    <div key={shop.id} onClick={() => openEditModal(shop)} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full relative">
                        <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                            {shop.image ? (
                                <img src={shop.image} alt={shop.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-300"><ImageIcon size={40} /><span className="text-xs font-bold mt-1">No Image</span></div>
                            )}
                            
                            {/* 🔥 [แก้ไข] เปลี่ยนคำว่า CLOSED -> ร้านปิด */}
                            {(shop.status === 'closed') && (
                                <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-[2px] z-10 flex items-center justify-center transition-all duration-300">
                                    <h2 className="text-white text-3xl font-black tracking-widest border-4 border-white/80 px-6 py-2 rounded-xl transform -rotate-6 shadow-2xl opacity-90">
                                        ร้านปิด
                                    </h2>
                                </div>
                            )}

                            {/* QR Icon Badge */}
                            {shop.promptpay_image && (
                                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-blue-600 flex items-center gap-1 shadow-sm z-0">
                                    <QrCode size={12} /> มี QR
                                </div>
                            )}

                            {/* 🔥 ปุ่มเปลี่ยนสถานะ */}
                            <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
                                <select 
                                    value={shop.status || 'open'} 
                                    onClick={(e) => e.stopPropagation()} 
                                    onChange={(e) => handleStatusChange(shop.id, e.target.value, e)}
                                    className={`text-[10px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-full border-none shadow-lg cursor-pointer outline-none appearance-none text-center transition-all hover:scale-105 active:scale-95
                                        ${shop.status === 'open' ? 'bg-green-500 text-white hover:bg-green-600 ring-2 ring-green-200' : 
                                          shop.status === 'closed' ? 'bg-red-500 text-white hover:bg-red-600 ring-2 ring-red-200' : 'bg-gray-500 text-white'}
                                    `}
                                >
                                    <option value="open">🟢 เปิด</option>
                                    <option value="closed">🔴 ปิด</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-orange-600 transition-colors">{shop.name}</h3>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><MapPin size={14} className="shrink-0 text-gray-400" /><span className="truncate">{shop.address || 'ไม่ระบุที่อยู่'}</span></div>
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-6"><Phone size={14} className="shrink-0" /><span>{shop.phone || 'ไม่มีเบอร์โทร'}</span></div>
                            <div className="mt-auto flex gap-2 pt-4 border-t border-gray-50">
                                <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/shops/${shop.id}/menus`); }} className="flex-1 bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white py-2.5 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2"><List size={16}/> เมนู</button>
                                <button onClick={(e) => handleDelete(shop.id, e)} className="w-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* --- Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {isEditMode ? <Edit size={20} className="text-orange-500"/> : <Plus size={20} className="text-green-500"/>}
                        {isEditMode ? 'แก้ไขข้อมูลร้านค้า' : 'เพิ่มร้านค้าใหม่'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 transition"><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* 1. รูปหน้าร้าน */}
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase ml-1">รูปหน้าร้าน (Cover)</label>
                             <div onPaste={(e) => handlePaste(e, 'cover')} tabIndex="0" className="relative group w-full h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-400 flex items-center justify-center overflow-hidden cursor-pointer transition-all focus:ring-2 focus:ring-orange-200 outline-none">
                                {form.image ? (<img src={form.image} className="w-full h-full object-cover" alt="Cover" />) : (<div className="text-center text-gray-400"><ImageIcon className="mx-auto mb-2 opacity-50" size={32} /><span className="text-xs font-medium">รูปหน้าร้าน</span></div>)}
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                {uploadingCover && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">อัปโหลด...</div>}
                             </div>
                        </div>
                        {/* 2. QR Code */}
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-1"><QrCode size={14} className="text-blue-500"/> QR Code รับเงิน</label>
                             <div onPaste={(e) => handlePaste(e, 'qr')} tabIndex="0" className="relative group w-full h-48 bg-blue-50/30 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 flex items-center justify-center overflow-hidden cursor-pointer transition-all focus:ring-2 focus:ring-blue-200 outline-none">
                                {form.promptpay_image ? (<img src={form.promptpay_image} className="w-full h-full object-contain p-2" alt="QR Code" />) : (<div className="text-center text-blue-400"><QrCode className="mx-auto mb-2 opacity-50" size={32} /><span className="text-xs font-medium">วางรูป QR ตรงนี้</span><p className="text-[10px] opacity-70 mt-1">คลิกแล้วกด Ctrl+V</p></div>)}
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'qr')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                {uploadingQr && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">อัปโหลด...</div>}
                             </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div><label className="text-xs font-bold text-gray-500 uppercase ml-1 block">ชื่อร้านค้า</label><input className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-200 outline-none transition font-medium" placeholder="เช่น I-Nong Food" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase ml-1 block">เบอร์โทร</label><input className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-200 outline-none transition" placeholder="02-xxx-xxxx" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase ml-1 block">ที่อยู่</label><input className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-200 outline-none transition" placeholder="เช่น เชียงใหม่" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                        </div>
                    </div>

                    <button type="submit" className={`w-full text-white py-4 rounded-xl font-bold shadow-lg transition mt-6 flex justify-center items-center gap-2 active:scale-95 ${isEditMode ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}>
                        {isEditMode ? 'บันทึกการแก้ไข' : 'สร้างร้านค้าทันที'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ManageShops;