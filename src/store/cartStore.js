import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      shopId: null, // เก็บ ID ร้านค้าปัจจุบัน (เพื่อให้แน่ใจว่าสั่งร้านเดียว)
      shopName: '', // เก็บชื่อร้านเพื่อแสดงผล

      addToCart: (newItem) => {
        const { items, shopId } = get();

        // 1. เช็คว่าสั่งข้ามร้านหรือไม่?
        if (shopId && shopId !== newItem.shopId) {
          const confirmClear = window.confirm(
            "⚠️ คุณมีสินค้าจากร้านอื่นอยู่ในตะกร้า\nต้องการล้างตะกร้าเดิมเพื่อสั่งร้านนี้หรือไม่?"
          );
          if (!confirmClear) return;
          // ถ้าตกลง ให้ล้างของเก่าออก
          set({ items: [], shopId: null, shopName: '' });
        }

        // 2. เพิ่มสินค้า หรือ ปรับจำนวน
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id);
          
          let newItems;
          if (existingItem) {
            // ถ้ามีอยู่แล้ว ให้บวกจำนวนเพิ่ม
            newItems = state.items.map((item) =>
              item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          } else {
            // ถ้ายังไม่มี ให้เพิ่มใหม่
            newItems = [...state.items, { ...newItem, quantity: 1 }];
          }

          return { 
            items: newItems, 
            shopId: newItem.shopId,
            shopName: newItem.shopName || state.shopName // อัปเดตชื่อร้านถ้ามีส่งมา
          };
        });
      },

      decreaseQty: (itemId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0) // ถ้าเหลือ 0 ให้ลบออก
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId)
        }));
      },

      clearCart: () => set({ items: [], shopId: null, shopName: '' }),

      // ฟังก์ชันคำนวณยอดรวม
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'food-cart-storage', // ชื่อ key ใน LocalStorage
    }
  )
);

export default useCartStore;