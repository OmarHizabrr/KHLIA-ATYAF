import FirestoreApi from "@/services/firestoreApi";
import type { Product } from "@/types/store";

const api = FirestoreApi.Api;

function stripUndefined<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

export function newProductDraft(): Product {
  return {
    id: "",
    name: "",
    description: "",
    price: 0,
    currencyCode: "",
    currencySymbol: "",
    oldPrice: undefined,
    images: [],
    categoryId: "",
    features: [],
    stock: 0,
    isActive: true,
    isFeatured: false,
    createdAt: undefined,
  };
}

export async function upsertProduct(product: Product) {
  const id = product.id || api.getNewId("products");
  const ref = api.getProductDoc(id);
  const payload = stripUndefined({ ...product, id });
  await api.setData({
    docRef: ref,
    data: payload,
    merge: true,
  });
  return id;
}

export async function deleteProduct(productId: string) {
  await api.deleteData(api.getProductDoc(productId));
}

