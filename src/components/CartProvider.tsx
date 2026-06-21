"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type CartItem = {
  productId: string;
  productName: string;
  priceCents: number;
  currency: "USD";
  image: string;
  quantity: number;
  color?: string;
};

type AddCartItemInput = {
  productId: string;
  productName: string;
  priceCents: number;
  currency: "USD";
  image: string;
  quantity?: number;
  color?: string;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  subtotalCents: number;
  isCartOpen: boolean;
  addItem: (item: AddCartItemInput) => void;
  updateQuantity: (productId: string, color: string | undefined, quantity: number) => void;
  removeItem: (productId: string, color?: string) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CART_STORAGE_KEY = "aerolift-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (rawCart) {
      try {
        const parsed = JSON.parse(rawCart) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item) =>
                item.productId &&
                item.productName &&
                Number.isFinite(item.priceCents) &&
                item.image &&
                item.quantity > 0
            )
          );
        }
      } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [hydrated, items]);

  const addItem = useCallback((input: AddCartItemInput) => {
    const quantity = Math.max(1, input.quantity ?? 1);
    const color = input.color;

    setItems((currentItems) => {
      const matchIndex = currentItems.findIndex((item) => item.productId === input.productId && item.color === color);

      if (matchIndex === -1) {
        return [
          ...currentItems,
          {
            productId: input.productId,
            productName: input.productName,
            priceCents: input.priceCents,
            currency: input.currency,
            image: input.image,
            quantity,
            color
          }
        ];
      }

      return currentItems.map((item, index) =>
        index === matchIndex
          ? {
              ...item,
              quantity: item.quantity + quantity
            }
          : item
      );
    });
  }, []);

  const totalQuantity = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const subtotalCents = useMemo(() => items.reduce((total, item) => total + item.priceCents * item.quantity, 0), [items]);
  const updateQuantity = useCallback((productId: string, color: string | undefined, quantity: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => (item.productId === productId && item.color === color ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);
  const removeItem = useCallback((productId: string, color?: string) => {
    setItems((currentItems) => currentItems.filter((item) => !(item.productId === productId && item.color === color)));
  }, []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const value = useMemo(
    () => ({ items, totalQuantity, subtotalCents, isCartOpen, addItem, updateQuantity, removeItem, openCart, closeCart }),
    [addItem, closeCart, isCartOpen, items, openCart, removeItem, subtotalCents, totalQuantity, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
