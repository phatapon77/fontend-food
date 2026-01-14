import React from 'react';
import { useParams } from 'react-router-dom';
import useCartStore from '../../../store/cartStore';

const ShopDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCartStore();
  
  // Mock Menu
  const menus = [
    { id: 101, menu_name: 'Signature Burger', price: 159, description: 'Beef patty with cheese' },
    { id: 102, menu_name: 'French Fries', price: 59, description: 'Crispy salted fries' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Menu (Shop ID: {id})</h1>
      <div className="space-y-4">
        {menus.map(item => (
           <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
             <div>
               <h3 className="font-bold text-lg">{item.menu_name}</h3>
               <p className="text-gray-500">{item.description}</p>
               <p className="text-orange-600 font-bold mt-1">{item.price} ฿</p>
             </div>
             <button 
               onClick={() => addToCart({...item}, parseInt(id))} 
               className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-200"
             >
               Add to Cart
             </button>
           </div>
        ))}
      </div>
    </div>
  );
};
export default ShopDetails;