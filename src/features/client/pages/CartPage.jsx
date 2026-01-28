import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../../store/cartStore'; 
import { api } from '../../../services/api';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Utensils, ChefHat, QrCode, CreditCard, Banknote, CheckCircle, ScanLine } from 'lucide-react';

// ❌ ลบบรรทัด import ที่ error ออกไปแล้วครับ
// import myQrCode from '../../../assets/promptpay.jpg'; 

const CartPage = () => {
  const navigate = useNavigate();
  const { items, increaseQty, decreaseQty, clearCart, getTotal, addToCart, shopId } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QR');
  const [shopData, setShopData] = useState(null);

  const total = getTotal();

  // ✅ 1. ดึงข้อมูลร้านค้า (เพื่อเอารูป QR ที่คุณอัปโหลดใน Admin มาแสดง)
  useEffect(() => {
    const fetchShopData = async () => {
        if (!shopId) return;
        try {
            const res = await api.get(`/restaurants/${shopId}`);
            const data = Array.isArray(res.data) ? res.data[0] : res.data;
            setShopData(data);
        } catch (error) {
            console.error("Error fetching shop data:", error);
        }
    };
    fetchShopData();
  }, [shopId]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const payload = {
        customer_id: 1, 
        restaurant_id: shopId,
        total_amount: total,
        payment_method: paymentMethod, 
        items: items.map(item => ({
            menu_id: item.id,
            qty: item.quantity,
            price: item.price
        }))
      };

      await api.createOrder(payload);
      alert(`🎉 สั่งซื้อสำเร็จ!\nขอบคุณที่ใช้บริการครับ`);
      clearCart();
      navigate('/'); 
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = () => {
      if(window.confirm("ต้องการล้างตะกร้าทั้งหมดใช่ไหม?")) {
          clearCart();
      }
  }

  // --- 🛠️ ส่วนจัดการรูป QR Code ---
  // ถ้ามีรูปจาก Admin (shopData.promptpay_image) ให้ใช้รูปนั้น
  // ถ้าไม่มี ให้ใช้รูป "ตัวอย่าง" จากเน็ตแทน (แก้ขัดไปก่อน)
  const qrImageToShow = shopData?.promptpay_image 
    ? shopData.promptpay_image 
    : "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"; 

  if (items.length === 0) {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
             <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-sm w-full relative z-10 border border-gray-50">
                <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <ShoppingBag size={48} className="text-orange-400 opacity-80" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-2">ตะกร้าว่างเปล่า</h2>
                <button onClick={() => navigate('/')} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 transform transition active:scale-95">
                    ไปเลือกร้านอาหาร
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-40 font-sans">
      
      <div className="bg-white sticky top-0 z-40 shadow-sm/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition text-gray-600">
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-extrabold text-gray-800">ยืนยันออเดอร์</h1>
        </div>
        <button onClick={handleClearCart} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition">
            <Trash2 size={20} />
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-orange-50/50 border-b border-orange-100 flex items-center gap-2">
                <ChefHat size={18} className="text-orange-600" />
                <p className="text-sm text-orange-800 font-bold">รายการอาหาร</p>
            </div>
            <div className="divide-y divide-gray-50">
                {items.map((item) => (
                    <div key={item.id} className="p-5 flex gap-5 items-center hover:bg-gray-50/50 transition duration-300">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm border border-gray-100">
                            {item.image ? (
                                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300"><Utensils size={24} /></div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-lg leading-tight truncate mb-1">{item.name}</h3>
                            <p className="text-orange-600 font-extrabold">{item.price} ฿</p>
                        </div>
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                            <button onClick={() => decreaseQty(item.id)} className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-500 transition active:scale-90">
                                {item.quantity === 1 ? <Trash2 size={16}/> : <Minus size={16}/>}
                            </button>
                            <span className="font-bold w-8 text-center text-gray-800">{item.quantity}</span>
                            <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-600 transition active:scale-90">
                                <Plus size={16}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">เลือกวิธีการชำระเงิน</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div onClick={() => setPaymentMethod('QR')} className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all relative ${paymentMethod === 'QR' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 hover:border-orange-200 text-gray-500'}`}>
                    <QrCode size={28} />
                    <span className="text-sm font-bold">สแกนจ่าย</span>
                    {paymentMethod === 'QR' && <div className="absolute top-2 right-2 text-orange-500"><CheckCircle size={16} fill="currentColor" className="text-white"/></div>}
                </div>
                <div onClick={() => setPaymentMethod('CASH')} className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all relative ${paymentMethod === 'CASH' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 hover:border-orange-200 text-gray-500'}`}>
                    <Banknote size={28} />
                    <span className="text-sm font-bold">เงินสด</span>
                    {paymentMethod === 'CASH' && <div className="absolute top-2 right-2 text-orange-500"><CheckCircle size={16} fill="currentColor" className="text-white"/></div>}
                </div>
                <div onClick={() => setPaymentMethod('CARD')} className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all relative ${paymentMethod === 'CARD' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 hover:border-orange-200 text-gray-500'}`}>
                    <CreditCard size={28} />
                    <span className="text-sm font-bold">บัตรเครดิต</span>
                    {paymentMethod === 'CARD' && <div className="absolute top-2 right-2 text-orange-500"><CheckCircle size={16} fill="currentColor" className="text-white"/></div>}
                </div>
            </div>

            {/* ✅ QR Code Display */}
            {paymentMethod === 'QR' && (
                <div className="mt-6 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-[#1A365D] p-5 rounded-2xl shadow-xl w-full max-w-[280px] text-center text-white relative overflow-hidden">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <ScanLine size={24} className="text-blue-300" />
                            <span className="font-bold text-lg tracking-wide">PromptPay</span>
                        </div>
                        
                        <div className="bg-white p-3 rounded-xl mx-auto mb-4 w-fit">
                            {/* 🔥 ใช้ตัวแปร qrImageToShow ที่เตรียมไว้ด้านบน */}
                            <img 
                                src={qrImageToShow} 
                                alt="PromptPay QR" 
                                className="w-40 h-40 object-contain"
                            />
                        </div>

                        <div className="text-blue-200 text-xs mb-1">ยอดชำระรวม</div>
                        <div className="text-3xl font-black text-white">{total} ฿</div>
                        
                        <div className="mt-4 pt-4 border-t border-white/20 text-[10px] text-blue-300">
                             FoodApp Delivery Official
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 animate-pulse">👇 สแกนเพื่อชำระเงินได้เลย</p>
                </div>
            )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">สรุปยอดชำระ</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-gray-500 text-sm">
                    <span>ค่าอาหาร ({items.reduce((a,b)=>a+b.quantity,0)} รายการ)</span>
                    <span className="font-medium">{total} ฿</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                    <span>ค่าจัดส่ง (Delivery Fee)</span>
                    <span className="text-green-600 font-bold">ฟรี</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-2"></div>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 text-lg">ยอดสุทธิ</span>
                    <span className="font-black text-3xl text-orange-600">{total} <span className="text-sm font-normal text-gray-400">฿</span></span>
                </div>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-bold uppercase">ยอดรวมทั้งหมด</span>
                <span className="text-2xl font-black text-gray-900 leading-none">{total} ฿</span>
            </div>
            
            <button onClick={handleCheckout} disabled={loading} className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg text-white shadow-xl shadow-orange-200 transition-all flex justify-center items-center gap-2 transform active:scale-95 ${loading ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-gray-900 hover:bg-black'}`}>
                {loading ? (
                    <div className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>กำลังประมวลผล...</div>
                ) : (
                    <>{paymentMethod === 'QR' ? 'แนบสลิป & ยืนยัน' : 'ยืนยันการสั่งซื้อ'} <ShoppingBag size={20} /></>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;