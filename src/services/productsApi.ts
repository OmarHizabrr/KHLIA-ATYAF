import FirestoreApi from "@/services/firestoreApi";
import type { Product } from "@/types/store";

const api = FirestoreApi.Api;

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
  const payload: Product = { ...product, id };
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

