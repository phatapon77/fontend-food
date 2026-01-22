import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import useCartStore from '../../../store/cartStore';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, increaseQty, decreaseQty, removeItem, getTotal } = useCartStore();
  const total = getTotal();

  // ถ้าปิดอยู่ ไม่ต้องแสดงอะไรเลย (หรือใช้ CSS translate ก็ได้ แต่วิธีนี้ง่ายกว่า)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* 1. ฉากหลังสีดำจางๆ (กดแล้วปิด) */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* 2. กล่องตะกร้าเลื่อนมาจากขวา */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="text-orange-600" /> ตะกร้าสินค้า
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Content (รายการสินค้า) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag size={64} className="opacity-20" />
              <p>ไม่มีสินค้าในตะกร้า</p>
              <button 
                onClick={onClose}
                className="text-orange-600 font-bold hover:underline"
              >
                ไปเลือกซื้ออาหารกันเถอะ
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                <img 
                  src={item.image || 'https://placehold.co/100'} 
                  alt={item.name} 
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                  <p className="text-orange-600 font-bold text-sm">{item.price} ฿</p>
                  
                  {/* ปุ่มปรับจำนวน */}
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                        onClick={() => decreaseQty(item.id)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
                    >
                        {item.quantity === 1 ? <Trash2 size={12}/> : <Minus size={12}/>}
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                        // เนื่องจากใน store เราอาจจะไม่มี increaseQty แยก (ใช้ addToCart แทนได้) 
                        // หรือถ้าคุณเพิ่ม increaseQty ใน store แล้วก็ใช้ได้เลย
                        // สมมติใช้ logic: addToCart({...item}) เพื่อเพิ่ม
                        onClick={() => useCartStore.getState().addToCart(item)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
                    >
                        <Plus size={12}/>
                    </button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="self-start text-gray-300 hover:text-red-500">
                    <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer (ปุ่มสั่งซื้อ) */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-white safe-area-bottom">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">ยอดรวมทั้งหมด</span>
              <span className="text-2xl font-extrabold text-orange-600">{total} ฿</span>
            </div>
            <button 
              onClick={() => {
                onClose();
                navigate('/cart'); // ไปหน้า Checkout
              }}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 hover:bg-orange-700 active:scale-95 transition"
            >
              ดูตะกร้า / ชำระเงิน
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;