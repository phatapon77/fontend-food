import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import useCartStore from '../../../store/cartStore';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, totalAmount, addToCart, removeFromCart, clearCart, currentRestaurantId } = useCartStore();

  const handleCheckout = () => {
    alert("Checkout API Payload ready! (Check console)");
    console.log({
       restaurant_id: currentRestaurantId,
       items: cart.map(i => ({ menu_id: i.id, qty: i.quantity, price: i.price })),
       total: totalAmount
    });
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="p-4 border-b flex justify-between items-center bg-orange-50">
          <h2 className="text-lg font-bold flex items-center gap-2">Your Cart</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? <p className="text-center text-gray-400 mt-10">Empty Cart</p> : 
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div><h4 className="font-semibold">{item.menu_name}</h4><p className="text-sm text-gray-500">{item.price} ฿</p></div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="p-1 bg-gray-100 rounded"><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item, currentRestaurantId)} className="p-1 bg-gray-100 rounded"><Plus size={14} /></button>
                </div>
              </div>
            ))
          }
        </div>
        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between mb-4 text-xl font-bold"><span>Total</span><span>{totalAmount} ฿</span></div>
            <button onClick={handleCheckout} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold">Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartDrawer;