import { Product } from '@prisma/client';
import create from 'zustand';

type Item = Product & { quantity: number };
type CartItems = { [key: string]: Item };
interface CartState {
  items: CartItems;
  addToCart: (product: Product, quantity: number) => void;
}

const storageItems: CartItems = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '{}') : {};

export const useCartStore = create<CartState>((set) => ({
  items: storageItems,
  addToCart: (product, quantity) => {
    set((state) => {
      const item: Item = { ...product, quantity };

      const updatedCart = {
        items: {
          ...state.items,
          [product.id]: {
            ...item,
            quantity: (state.items[product.id]?.quantity || 0) + quantity,
          },
        },
      };

      // persist cart to local storage
      localStorage.setItem('cart', JSON.stringify(updatedCart.items));

      return updatedCart;
    });
  },
}));
