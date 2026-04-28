import FirestoreApi from "@/services/firestoreApi";
import type { Category } from "@/types/store";

const api = FirestoreApi.Api;

export function newCategoryDraft(): Category {
  return { id: "", name: "", image: "", sortOrder: 0 };
}

export async function upsertCategory(category: Category) {
  const id = category.id || api.getNewId("categories");
  const ref = api.getCategoryDoc(id);
  const payload: Category = { ...category, id };
  await api.setData({ docRef: ref, data: payload, merge: true });
  return id;
}

export async function deleteCategory(categoryId: string) {
  await api.deleteData(api.getCategoryDoc(categoryId));
}

