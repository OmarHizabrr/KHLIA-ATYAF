export type StoreSettings = {
  storeName: string;
  logo: string;
  whatsapp: string;
  phone: string;
  address: string;
};

export type Category = {
  id: string;
  name: string;
  image?: string;
  sortOrder?: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currencyCode?: string;
  currencySymbol?: string;
  oldPrice?: number;
  images: string[];
  categoryId: string;
  features: string[];
  stock: number;
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: unknown;
};

export type OrderStatus = "جديد" | "قيد التنفيذ" | "تم التجهيز" | "تم التسليم";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  currencyCode?: string;
  currencySymbol?: string;
  qty: number;
  image?: string;
};

export type CurrencyTotal = {
  code: string;
  symbol: string;
  total: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  totalsByCurrency?: CurrencyTotal[];
  status: OrderStatus;
  createdAt?: unknown;
};

export type Banner = {
  id: string;
  title: string;
  image: string;
  link?: string;
};

export type Currency = {
  id: string;
  code: string;
  name: string;
  symbol: string;
  rate: number;
  isDefault: boolean;
  isActive: boolean;
};

