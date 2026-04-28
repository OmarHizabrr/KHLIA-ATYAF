import FirestoreApi from "@/services/firestoreApi";
import type { Banner } from "@/types/store";

const api = FirestoreApi.Api;

export function newBannerDraft(): Banner {
  return { id: "", title: "", image: "", link: "" };
}

export async function upsertBanner(banner: Banner) {
  const id = banner.id || api.getNewId("banners");
  const ref = api.getBannerDoc(id);
  const payload: Banner = { ...banner, id };
  await api.setData({ docRef: ref, data: payload, merge: true });
  return id;
}

export async function deleteBanner(bannerId: string) {
  await api.deleteData(api.getBannerDoc(bannerId));
}

