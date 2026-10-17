import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "./types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("navro-cart");
    if (!raw) return [];
    const parsed: CartItem[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) =>
      item && item.product && Number.isInteger(item.product.id) &&
      Number.isInteger(item.quantity) && item.quantity > 0,
    ) : [];
  } catch (error) {
    console.warn("The saved cart could not be restored.", error);
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    localStorage.setItem("navro-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0),
    add(product) {
      const maxQuantity = product.is_demo ? 20 : Math.min(20, product.stock_quantity);
      if (maxQuantity < 1) return;
      setItems((current) => {
        const existing = current.find((item) => item.product.id === product.id);
        if (existing) return current.map((item) => item.product.id === product.id
          ? { product, quantity: Math.min(maxQuantity, item.quantity + 1) }
          : item);
        return [...current, { product, quantity: 1 }];
      });
    },
    setQuantity(productId, quantity) {
      setItems((current) => current.map((item) => {
        if (item.product.id !== productId) return item;
        const maxQuantity = item.product.is_demo ? 20 : Math.min(20, item.product.stock_quantity);
        return { ...item, quantity: Math.max(1, Math.min(maxQuantity || 1, quantity)) };
      }));
    },
    remove(productId) {
      setItems((current) => current.filter((item) => item.product.id !== productId));
    },
    clear() {
      setItems([]);
    },
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}
