import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      currentRestaurantId: null,
      totalAmount: 0,
      addToCart: (item, restaurantId) => {
        const { currentRestaurantId } = get();
        if (currentRestaurantId && currentRestaurantId !== restaurantId) {
          if (!window.confirm("เปลี่ยนร้าน? ตะกร้าเดิมจะถูกล้าง")) return;
          set({ cart: [], currentRestaurantId: restaurantId, totalAmount: 0 });
        }
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          const newCart = existing 
            ? state.cart.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...state.cart, { ...item, quantity: 1 }];
          return {
            cart: newCart,
            currentRestaurantId: restaurantId,
            totalAmount: newCart.reduce((sum, i) => sum + (i.price * i.quantity), 0)
          };
        });
      },
      removeFromCart: (itemId) => {
        set((state) => {
          const newCart = state.cart.filter((i) => i.id !== itemId);
          return {
             cart: newCart, 
             totalAmount: newCart.reduce((sum, i) => sum + (i.price * i.quantity), 0),
             currentRestaurantId: newCart.length === 0 ? null : state.currentRestaurantId 
          };
        });
      },
      clearCart: () => set({ cart: [], currentRestaurantId: null, totalAmount: 0 }),
    }),
    { name: 'food-cart-storage' }
  )
);
export default useCartStore;