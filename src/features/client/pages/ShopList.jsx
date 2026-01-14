import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const ShopList = () => {
  // Mock Data
  const shops = [
    { id: 1, name: 'Burger King Clone', address: 'Bangkok', image: 'https://placehold.co/600x400/orange/white?text=Burger' },
    { id: 2, name: 'Sushi Express', address: 'Chiang Mai', image: 'https://placehold.co/600x400/black/white?text=Sushi' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Restaurants Near You 🍔</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <Link to={`/shop/${shop.id}`} key={shop.id} className="group bg-white rounded-xl shadow hover:shadow-xl overflow-hidden block">
            <img src={shop.image} alt={shop.name} className="w-full h-48 object-cover group-hover:scale-105 transition" />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-1">{shop.name}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-1"><MapPin size={14}/> {shop.address}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default ShopList;