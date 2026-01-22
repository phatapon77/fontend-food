import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Star, Clock, Bike, Utensils, ChevronRight } from 'lucide-react';
import { api } from '../../../services/api';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await api.getShops();
        setShops(response.data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  // ฟังก์ชันกรองร้านค้า
  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden pb-20 font-sans"
         style={{
             backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)',
             backgroundSize: '20px 20px'
         }}
    >
      
      {/* --- 🎨 Decoration: Floating Food Icons (พื้นหลังลายอาหาร) --- */}
      <div className="absolute top-20 left-10 text-9xl opacity-5 rotate-12 select-none pointer-events-none">🍕</div>
      <div className="absolute top-40 right-10 text-9xl opacity-5 -rotate-12 select-none pointer-events-none">🍔</div>
      <div className="absolute bottom-20 left-20 text-8xl opacity-5 rotate-45 select-none pointer-events-none">🍜</div>
      <div className="absolute top-1/2 right-1/4 text-9xl opacity-5 -rotate-6 select-none pointer-events-none">🥤</div>
      <div className="absolute bottom-1/3 left-1/4 text-8xl opacity-5 rotate-12 select-none pointer-events-none">🍦</div>

      <div className="relative z-10">
        
        {/* --- 1. Hero Section & Search --- */}
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 pt-10 pb-24 px-4 shadow-xl rounded-b-[2.5rem] relative overflow-hidden">
            {/* Graphic Circles */}
            <div className="absolute top-[-50%] left-[-10%] w-[600px] h-[600px] rounded-full border-[60px] border-white/5 animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl"></div>

            <div className="max-w-4xl mx-auto text-center text-white relative z-10">
                <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold mb-4 border border-white/30 text-orange-50">
                    🛵 ค่าส่งเริ่มต้น 0 บาท*
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-sm">
                    วันนี้กินอะไรดี? 😋
                </h1>
                
                {/* Search Box */}
                <div className="relative max-w-xl mx-auto mt-8 transform hover:scale-105 transition duration-300 group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="text-gray-400 group-focus-within:text-orange-500 transition-colors" size={22} />
                    </div>
                    <input 
                        type="text"
                        placeholder="ค้นหาร้านอาหาร, ชื่อเมนู..."
                        className="w-full pl-14 pr-6 py-4 rounded-full text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-300/50 font-medium text-lg placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>

        {/* --- 2. Shop Grid Header (ขยับขึ้นมาแทนที่ Slider) --- */}
        <div className="max-w-7xl mx-auto px-6 -mt-8 mb-6 flex items-center justify-between relative z-20">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white">
                <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg"><Utensils size={20}/></span>
                ร้านแนะนำใกล้คุณ
            </h2>
            <Link to="#" className="text-sm font-bold text-orange-600 hover:underline flex items-center bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                ดูทั้งหมด <ChevronRight size={16}/>
            </Link>
        </div>

        {/* --- 3. Shop Grid Content --- */}
        <div className="max-w-7xl mx-auto px-4 pb-10">
            {loading ? (
                /* Skeleton Loading */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-3xl shadow-sm h-72 animate-pulse border border-gray-100"></div>
                    ))}
                </div>
            ) : filteredShops.length === 0 ? (
                <div className="text-center py-20">
                    <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <span className="text-4xl">🍜</span>
                    </div>
                    <p className="text-gray-500 font-bold text-xl">ไม่พบร้านค้า</p>
                    <p className="text-gray-400 text-sm">ลองเปลี่ยนคำค้นหาดูนะ</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredShops.map((shop) => {
                        const isClosed = shop.status === 'closed';
                        const isHoliday = shop.status === 'holiday';
                        const isDisabled = isClosed || isHoliday;

                        return (
                            <Link 
                                to={isDisabled ? '#' : `/shop/${shop.id}`} 
                                key={shop.id} 
                                onClick={(e) => isDisabled && e.preventDefault()}
                                className={`group bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden relative transition-all duration-300 flex flex-col h-full
                                    ${isDisabled ? 'grayscale cursor-not-allowed opacity-90' : 'hover:shadow-2xl hover:-translate-y-1 hover:border-orange-100'}
                                `}
                            >
                                {/* Image Cover */}
                                <div className="h-52 overflow-hidden relative bg-gray-100">
                                    <img 
                                        src={shop.image || `https://placehold.co/600x400/orange/white?text=${shop.name}`} 
                                        alt={shop.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                                    />
                                    
                                    {/* Gradient for Text Shadow */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40"></div>

                                    {!isDisabled && (
                                        <>
                                            <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                                                แนะนำ
                                            </div>
                                            <div className="absolute bottom-3 right-3 bg-white text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                <Clock size={12} className="text-green-600"/> 15-25 น.
                                            </div>
                                        </>
                                    )}

                                    {/* Overlay Closed/Holiday */}
                                    {isClosed && (
                                        <div className="absolute inset-0 bg-gray-900/80 z-20 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-red-600 text-white px-6 py-2 rounded-xl font-black text-2xl shadow-xl transform -rotate-6 border-4 border-white/20">
                                                CLOSED
                                            </div>
                                        </div>
                                    )}
                                    {isHoliday && (
                                        <div className="absolute inset-0 bg-gray-900/80 z-20 flex items-center justify-center backdrop-blur-[2px]">
                                             <div className="text-center text-white transform rotate-3">
                                                <div className="text-5xl mb-2">✈️</div>
                                                <span className="font-bold text-xl bg-orange-500 px-4 py-1 rounded-full border-2 border-white/30">ร้านหยุด</span>
                                             </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content Details */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-extrabold text-gray-800 group-hover:text-orange-600 transition truncate w-full">
                                            {shop.name}
                                        </h3>
                                        <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100 flex-shrink-0">
                                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-xs font-bold text-gray-700">4.8</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-400 text-xs flex items-center gap-1 mb-4 line-clamp-1">
                                        <MapPin size={12}/> {shop.address}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between border-t border-dashed border-gray-100 pt-3">
                                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                            <Bike size={14} className="text-orange-500"/> ฿10
                                        </div>
                                        {isDisabled ? (
                                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">ปิด</span>
                                        ) : (
                                            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full group-hover:bg-orange-600 group-hover:text-white transition">
                                                สั่งเลย
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ShopList;