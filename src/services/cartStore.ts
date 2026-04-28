import type { OrderItem } from "@/types/store";

const KEY = "khlia:cart:v1";

export function getCartItems(): OrderItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OrderItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function setCartItems(items: OrderItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function clearCart() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function addToCart(item: OrderItem) {
  const items = getCartItems();
  const idx = items.findIndex((x) => x.productId === item.productId);
  if (idx >= 0) {
    const next = [...items];
    next[idx] = { ...next[idx], qty: (next[idx].qty || 0) + (item.qty || 1) };
    setCartItems(next);
    return;
  }
  setCartItems([{ ...item, qty: item.qty || 1 }, ...items]);
}

export function updateCartQty(productId: string, qty: number) {
  const items = getCartItems();
  const next = items
    .map((x) => (x.productId === productId ? { ...x, qty } : x))
    .filter((x) => (x.qty || 0) > 0);
  setCartItems(next);
}

export function removeFromCart(productId: string) {
  const items = getCartItems();
  setCartItems(items.filter((x) => x.productId !== productId));
}

