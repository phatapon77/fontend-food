import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../../store/cartStore';
import { api } from '../../../services/api';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, increaseQty, decreaseQty, removeItem, clearCart, getTotal, addToCart, shopId } = useCartStore();
  const [loading, setLoading] = useState(false);

  const total = getTotal();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      // เตรียมข้อมูลส่งไป Backend
      const payload = {
        customer_id: 1, // Hardcode ไว้ก่อน (ในอนาคตดึงจาก Login)
        restaurant_id: shopId,
        total_amount: total,
        items: items.map(item => ({
            menu_id: item.id,
            qty: item.quantity,
            price: item.price
        }))
      };

      await api.createOrder(payload);
      
      alert("🎉 สั่งซื้อสำเร็จ! อาหารกำลังเดินทางไปหาคุณ");
      clearCart(); // ล้างตะกร้า
      navigate('/'); // กลับหน้าแรก
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-10 rounded-2xl shadow-sm text-center max-w-sm w-full">
                <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={40} className="text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">ตะกร้าว่างเปล่า</h2>
                <p className="text-gray-500 mb-8">ยังไม่ได้เลือกเมนูอร่อยๆ เลย</p>
                <button onClick={() => navigate('/')} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition">
                    ไปเลือกร้านอาหาร
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">ตะกร้าสินค้า 🛒</h1>
      </div>

      <div className="max-w-3xl mx-auto p-4">
        {/* รายการอาหาร */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="p-4 bg-orange-50 border-b border-orange-100">
                <p className="text-sm text-orange-800 font-bold">รายการอาหารจากร้าน</p>
            </div>
            
            <div className="divide-y divide-gray-100">
                {items.map((item) => (
                    <div key={item.id} className="p-4 flex gap-4 items-center">
                        <img 
                            src={item.image || 'https://placehold.co/100'} 
                            className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                            alt={item.name}
                        />
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                            <p className="text-orange-600 font-bold">{item.price} ฿</p>
                        </div>
                        
                        {/* ปุ่มเพิ่ม/ลด จำนวน */}
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                            <button 
                                onClick={() => decreaseQty(item.id)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-500"
                            >
                                {item.quantity === 1 ? <Trash2 size={16}/> : <Minus size={16}/>}
                            </button>
                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                                onClick={() => addToCart(item)} // เรียก addToCart ซ้ำเพื่อเพิ่มจำนวน
                                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-green-600"
                            >
                                <Plus size={16}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* สรุปยอดเงิน */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-24">
            <div className="flex justify-between mb-2 text-gray-500">
                <span>ค่าอาหาร</span>
                <span>{total} ฿</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-500">
                <span>ค่าส่ง (เหมาจ่าย)</span>
                <span>0 ฿</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold text-lg text-gray-800">ยอดสุทธิ</span>
                <span className="font-extrabold text-2xl text-orange-600">{total} ฿</span>
            </div>
        </div>
      </div>

      {/* ปุ่มสั่งซื้อ (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto">
            <button 
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-orange-200 transition flex justify-center items-center gap-2
                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 active:scale-95'}
                `}
            >
                {loading ? 'กำลังส่งออเดอร์...' : 'ยืนยันการสั่งซื้อ ✨'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;