import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api'; // ตรวจสอบ path ให้ถูกต้องตามโปรเจกต์คุณ
import { ArrowLeft, Star, Plus } from 'lucide-react';
import useCartStore from '../../../store/cartStore';

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const addToCart = useCartStore((state) => state.addToCart);

  // ✅ ระบบแปลชื่อเมนู (Updated: แก้คีย์ให้ตรงกับ Database เป๊ะๆ)
  const menuTranslations = {
    // ชื่อต้องตรงกับใน Database ทุกตัวอักษร
    'Khao Soi Kai Special (Chicken Leg)': 'ข้าวซอยไก่พิเศษ (น่องโต)',
    'Sai Ua (Northern Herbal Sausage)': 'ไส้อั่วสมุนไพร (สูตรคุณยาย)',
    'Nam Prik Ong Set (Dip with Veg)': 'ชุดน้ำพริกอ่อง + ผักสด',
    'Traditional Khao Soi Kai': 'ข้าวซอยไก่ดั้งเดิม',
    'Hang Lay Curry (Pork Belly)': 'แกงฮังเลหมูสามชั้น',
    'Khanom Jeen Nam Ngiao': 'ขนมจีนน้ำเงี้ยว',
    'Sticky Rice': 'ข้าวเหนียว',
    'Chrysanthemum Tea': 'น้ำเก๊กฮวยเย็น',
    'Iced Tea': 'ชาเย็น',
    
    // หมวดหมู่
    'Main Course': 'อาหารจานหลัก',
    'Appetizer': 'ของทานเล่น',
    'Curry': 'ประเภทแกง',
    'Noodles': 'เมนูเส้น',
    'Side Dish': 'เครื่องเคียง',
    'Beverage': 'เครื่องดื่ม',
    'Soup': 'ซุป'
  };

  // ✅ ฟังก์ชันจัดรูปแบบชื่อ (ไทยตัวใหญ่ + อังกฤษตัวเล็ก)
  const getBilingualName = (englishName) => {
    // ลองหาคำแปลจากชื่อเต็ม
    let thaiName = menuTranslations[englishName];
    
    // ถ้าไม่เจอ ลองตัดวงเล็บออกแล้วหาใหม่ (เผื่อ Database มีวงเล็บแต่ Dictionary ไม่มี)
    if (!thaiName && englishName.includes('(')) {
        const cleanName = englishName.split('(')[0].trim();
        thaiName = menuTranslations[cleanName];
    }

    if (thaiName) {
      return (
        <div>
          <span className="block text-lg font-bold text-gray-800 leading-tight">{thaiName}</span>
          <span className="block text-xs font-normal text-gray-400 mt-1">{englishName}</span>
        </div>
      );
    }
    // ถ้าไม่มีคำแปล ให้โชว์ชื่อเดิม
    return <span className="text-lg font-bold text-gray-800">{englishName}</span>;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopRes = await api.getShopById(id);
        const menuRes = await api.getMenuByShopId(id);
        
        // รองรับกรณี API ส่งมาเป็น Array หรือ Object
        setShop(Array.isArray(shopRes.data) ? shopRes.data[0] : shopRes.data); 
        setMenus(menuRes.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const translateCategory = (cat) => {
    if (!cat) return 'ทั่วไป';
    // ใช้ตัวแปรเดียวกับด้านบนจะได้แก้ที่เดียว
    return menuTranslations[cat] || cat; 
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-orange-500 font-bold animate-pulse">
        กำลังโหลดข้อมูลอร่อยๆ... 🍜
    </div>
  );
  
  if (!shop) return (
    <div className="flex flex-col justify-center items-center h-screen text-gray-500">
        <p className="text-xl">ไม่พบร้านค้านี้ 😢</p>
        <button onClick={() => navigate('/')} className="mt-4 text-orange-600 hover:underline">กลับหน้าหลัก</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 truncate">{shop.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Info Banner */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start border border-gray-100">
            <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden shadow-inner bg-gray-200 shrink-0 relative group">
                <img 
                    src={shop.image || `https://placehold.co/600x400/orange/white?text=${encodeURIComponent(shop.name)}`} 
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://placehold.co/600x400/orange/white?text=No+Image';
                    }}
                />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{shop.name}</h1>
                <p className="text-gray-500 mb-4 flex items-center justify-center md:justify-start gap-1">
                    📍 {shop.address || 'ไม่ระบุที่อยู่'}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold border border-green-100">
                         <Star size={16} fill="currentColor" /> 4.8
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="text-gray-600 font-medium">เปิดให้บริการ 09:00 - 20:00</div>
                </div>
            </div>
        </div>

        {/* Menu List */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-l-4 border-orange-500 pl-3">
            รายการอาหาร
        </h2>

        {menus.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                <div className="text-6xl mb-4 opacity-50">🍽️</div>
                <p className="text-gray-400 text-lg">ร้านนี้ยังไม่มีเมนูอาหาร</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menus.map((menu) => (
                    <div key={menu.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col relative">
                        
                        {/* Image Section */}
                        <div className="h-56 relative overflow-hidden bg-orange-50">
                            <img 
                                src={menu.image} 
                                alt={menu.menu_name || menu.name} 
                                className={`w-full h-full object-cover transition duration-500 ${!menu.image ? 'hidden' : 'block'}`}
                                onError={(e) => { 
                                    e.target.style.display = 'none'; 
                                    e.target.nextSibling.style.display = 'flex'; 
                                }} 
                            />
                            
                            {/* Fallback Image */}
                            <div className={`w-full h-full flex flex-col items-center justify-center text-orange-400 font-bold bg-orange-50 absolute inset-0 ${menu.image ? 'hidden' : 'flex'}`}>
                                <span className="text-5xl mb-3 filter drop-shadow-sm transform group-hover:scale-110 transition">🍲</span>
                                <span className="text-lg text-orange-500/70">ไม่มีรูปภาพ</span>
                            </div>

                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm border border-gray-100">
                                {translateCategory(menu.category)}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-grow">
                            <div className="mb-2">
                                {/* ✅ เรียกใช้ฟังก์ชันแสดงชื่อ 2 ภาษา (รองรับทั้ง menu_name และ name) */}
                                {getBilingualName(menu.menu_name || menu.name)}
                            </div>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[1.5em]">
                                {menu.description || '-'}
                            </p>
                            
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-dashed border-gray-200">
                                <div className="text-xl font-extrabold text-gray-900">
                                    {menu.price} <span className="text-sm font-medium text-gray-400">฿</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        addToCart({
                                            id: menu.id,
                                            name: menu.menu_name || menu.name, // ใช้ชื่อที่มีอยู่
                                            price: menu.price,
                                            shopId: shop.id,
                                            image: menu.image
                                        });
                                    }}
                                    className="bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-orange-200 flex items-center gap-2 active:scale-95"
                                >
                                    <Plus size={18} strokeWidth={3} /> ใส่ตะกร้า
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetails;