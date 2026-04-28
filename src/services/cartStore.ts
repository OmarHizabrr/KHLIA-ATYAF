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

