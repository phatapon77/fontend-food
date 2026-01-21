import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { api } from '../../../services/api';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลร้านค้าจาก Backend API
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

  if (loading) return <div className="p-10 text-center">กำลังโหลดร้านค้า... 🍔</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">เลือกร้านอร่อยใกล้คุณ 😋</h1>
      
      {shops.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">ยังไม่มีร้านค้าในระบบ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Link to={`/shop/${shop.id}`} key={shop.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 block">
              <div className="h-48 overflow-hidden bg-gray-200 relative">
                <img 
                  src={shop.image || `https://placehold.co/600x400/orange/white?text=${shop.name}`} 
                  alt={shop.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1 text-gray-800 group-hover:text-orange-600 transition">{shop.name}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <MapPin size={16} className="text-orange-500"/> {shop.address}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopList;