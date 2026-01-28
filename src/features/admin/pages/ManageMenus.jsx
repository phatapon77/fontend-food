import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, X, UploadCloud, Image as ImageIcon, Save, Utensils, Search } from 'lucide-react';
import api from '../../../services/api';

const ManageMenus = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [restaurantId, setRestaurantId] = useState(params.restaurantId || params.id || null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- 1. ตรวจสอบ ID ร้านค้า ---
  useEffect(() => {
    const initializeShopId = async () => {
        if (params.restaurantId || params.id) {
            setRestaurantId(params.restaurantId || params.id);
            return;
        }
        try {
            const res = await api.get('/restaurants');
            if (res.data && res.data.length > 0) setRestaurantId(res.data[0].id);
        } catch (error) { console.error(error); }
    };
    initializeShopId();
  }, [params]);

  // --- 2. ดึงข้อมูลเมนู ---
  const fetchMenus = async () => {
    if (!restaurantId) return;
    try {
      setLoading(true);
      const res = await api.get(`/menus?restaurant_id=${restaurantId}`);
      setMenus(res.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { if (restaurantId) fetchMenus(); }, [restaurantId]);

  // --- 3. เปิด/ปิด Modal ---
  const openModal = (menu = null) => {
    if (menu) {
      // โหมดแก้ไข
      setCurrentMenu(menu);
      setPreviewImage(menu.image);
    } else {
      // โหมดเพิ่มใหม่
      setCurrentMenu({ 
        restaurant_id: restaurantId, 
        menu_name: '', 
        price: '', 
        category: 'Main Course', 
        description: '', 
        image: '', 
        is_available: true 
      });
      setPreviewImage(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMenu(null);
    setPreviewImage(null);
  };

  // --- 4. อัปโหลดรูป (รองรับ Ctrl+V) ---
  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      // อัปเดต URL รูปใน state
      setCurrentMenu(prev => ({ ...prev, image: res.data.imageUrl }));
      setPreviewImage(res.data.imageUrl);
    } catch (error) { 
        alert("อัปโหลดรูปไม่สำเร็จ"); 
    } finally { 
        setUploading(false); 
    }
  };

  const handleImageUpload = (e) => {
    uploadFile(e.target.files[0]);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        uploadFile(file);
        break;
      }
    }
  };

  // --- 5. บันทึกข้อมูล (Save) ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!restaurantId) return;

    try {
      // เตรียมข้อมูลส่ง Backend
      const payload = { 
        ...currentMenu, 
        restaurant_id: restaurantId,
        // กันเหนียว: บางที Backend ใช้ name หรือ menu_name
        menu_name: currentMenu.menu_name || currentMenu.name, 
        description: currentMenu.description || '', 
        is_available: true 
      };

      if (currentMenu.id) {
        // แก้ไข (PUT)
        await api.put(`/menus/${currentMenu.id}`, payload);
      } else {
        // สร้างใหม่ (POST)
        await api.post('/menus', payload);
      }
      
      fetchMenus(); // โหลดข้อมูลใหม่
      closeModal(); // ปิด Modal
    } catch (error) { 
        console.error(error);
        alert("บันทึกไม่สำเร็จ: " + (error.response?.data?.message || error.message)); 
    }
  };

  // --- 6. ลบเมนู (Delete) ---
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("ยืนยันลบเมนูนี้?")) return;
    try { 
        await api.delete(`/menus/${id}`); 
        fetchMenus(); 
    } catch (error) { console.error(error); }
  };

  const filteredMenus = menus.filter(menu => 
    (menu.menu_name || menu.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- UI Render ---
  if (loading && !menus.length) return <div className="h-screen flex items-center justify-center bg-[#F9FAFB] text-gray-400">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/admin/shops')} className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">จัดการเมนูอาหาร</h1>
                    <p className="text-gray-500 text-sm mt-1">จัดการรายการอาหารทั้งหมดในร้านของคุณ</p>
                </div>
            </div>
            <div className="flex gap-3">
                <div className="relative hidden md:block">
                    <input type="text" placeholder="ค้นหาเมนู..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 w-64 transition-all" />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
                <button onClick={() => openModal()} className="hidden md:flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95">
                    <Plus size={20} /> เพิ่มเมนูใหม่
                </button>
            </div>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div onClick={() => openModal()} className="md:hidden flex flex-col items-center justify-center h-40 border-2 border-dashed border-orange-300 bg-orange-50 rounded-2xl cursor-pointer hover:bg-orange-100 transition-colors">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm mb-2"><Plus size={24} /></div>
                <span className="font-semibold text-orange-600">เพิ่มเมนูใหม่</span>
            </div>

            {filteredMenus.map((menu) => (
            <div key={menu.id} onClick={() => openModal(menu)} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative flex flex-col">
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {menu.image ? (
                        <img src={menu.image} alt={menu.menu_name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300"><Utensils size={32} className="mb-2 opacity-50" /><span className="text-xs">No Image</span></div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase text-gray-600 shadow-sm">{menu.category}</span>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1 group-hover:text-orange-600 transition-colors">{menu.menu_name || menu.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow font-light">{menu.description || '-'}</p>
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                         <div className="font-bold text-xl text-gray-900">{menu.price} <span className="text-sm font-normal text-gray-400">฿</span></div>
                         <button onClick={(e) => handleDelete(menu.id, e)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all md:opacity-0 md:group-hover:opacity-100"><Trash2 size={18} /></button>
                    </div>
                </div>
            </div>
            ))}
        </div>

        {!loading && filteredMenus.length === 0 && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><Utensils size={32} /></div>
                <p className="text-gray-500 font-medium">ยังไม่มีรายการอาหาร</p>
                <button onClick={() => openModal()} className="mt-4 text-orange-600 font-semibold hover:underline">เพิ่มเมนูแรกของคุณเลย</button>
            </div>
        )}
      </div>

      {/* --- Modal --- */}
      {isModalOpen && currentMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">{currentMenu.id ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}</h2>
                <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} className="p-6">
                <div className="flex gap-6 mb-6">
                    {/* กล่องอัปโหลดรูป (Paste ได้) */}
                    <div 
                        onPaste={handlePaste}
                        tabIndex="0"
                        className="w-32 h-32 flex-shrink-0 relative group cursor-pointer rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-orange-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-300"
                        title="คลิกแล้วกด Ctrl+V เพื่อวางรูป"
                    >
                        {previewImage ? (
                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 px-2 text-center">
                                <UploadCloud size={24} />
                                <span className="text-[10px] mt-1 font-medium">รูปเมนู</span>
                                <span className="text-[8px] text-gray-300">คลิก หรือ Ctrl+V</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">...</div>}
                    </div>

                    <div className="flex-grow space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">ชื่อเมนู</label>
                            <input type="text" required value={currentMenu.menu_name || currentMenu.name || ''} onChange={(e) => setCurrentMenu({...currentMenu, menu_name: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-200 text-gray-800 font-medium" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">ราคา</label>
                            <input type="number" required value={currentMenu.price || ''} onChange={(e) => setCurrentMenu({...currentMenu, price: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-200 text-gray-800 font-medium" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">หมวดหมู่</label>
                        <select value={currentMenu.category || 'Main Course'} onChange={(e) => setCurrentMenu({...currentMenu, category: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-200 text-gray-700">
                            <option value="Main Course">Main Course</option>
                            <option value="Appetizer">Appetizer</option>
                            <option value="Soup">Soup</option>
                            <option value="Beverage">Beverage</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">รายละเอียด</label>
                        <textarea rows="2" value={currentMenu.description || ''} onChange={(e) => setCurrentMenu({...currentMenu, description: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-200 text-gray-600 resize-none" />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={closeModal} className="flex-1 py-3.5 text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">ยกเลิก</button>
                    <button type="submit" disabled={uploading} className="flex-[2] py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 flex justify-center items-center gap-2">
                        {uploading ? 'กำลังบันทึก...' : 'บันทึก'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenus;