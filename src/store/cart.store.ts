"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * ============================================================
 * CARRITO DE COMPRA — Estado global con Zustand + persistencia
 * ============================================================
 * - El carrito inicia SIEMPRE vacío (items: []).
 * - Persiste solo `items` en localStorage (entre recargas).
 * - No almacena información sensible.
 * - Usa los datos reales del producto: id, name, price, image_url.
 * ============================================================
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

/** Datos mínimos del producto necesarios para agregarlo al carrito. */
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: CartProduct) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      /** Agrega un producto o incrementa su cantidad si ya existe. */
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                quantity: 1,
              },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),

      /** Disminuye la cantidad, nunca por debajo de 1. */
      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "surprises-cart",
      // Solo se persisten los productos; `isOpen` no debe persistirse.
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/** Unidades totales (suma de cantidades), no productos distintos. */
export const selectTotalItems = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

/** Subtotal = SUM(price × quantity). */
export const selectSubtotal = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
