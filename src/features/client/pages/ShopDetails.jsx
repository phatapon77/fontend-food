import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useCartStore from '../../../store/cartStore';
import { api } from '../../../services/api';

const ShopDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCartStore();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ฟังก์ชันดึงเมนูของจริงจาก Backend
    const fetchMenus = async () => {
      try {
        const response = await api.getMenuByShopId(id);
        setMenus(response.data);
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [id]);

  if (loading) return <div className="p-10 text-center">กำลังโหลดเมนู... ⏳</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">รายการอาหาร (ร้าน ID: {id})</h1>
      
      {menus.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
           <p className="text-gray-500">ร้านนี้ยังไม่มีเมนูอาหารครับ 🍜</p>
        </div>
      ) : (
        <div className="space-y-4">
          {menus.map(item => (
             <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
               <div>
                 <h3 className="font-bold text-lg text-gray-800">{item.menu_name}</h3>
                 <p className="text-gray-500 text-sm">{item.description}</p>
                 <p className="text-orange-600 font-bold mt-1">{Number(item.price).toFixed(0)} ฿</p>
               </div>
               <button 
                 onClick={() => addToCart({...item}, parseInt(id))} 
                 className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-200 transition active:scale-95"
               >
                 ใส่ตะกร้า +
               </button>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopDetails;