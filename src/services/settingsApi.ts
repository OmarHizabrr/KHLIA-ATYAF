import FirestoreApi from "@/services/firestoreApi";
import type { StoreSettings } from "@/types/store";

const api = FirestoreApi.Api;

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "خلية أطياف",
  logo: "/logo.png",
  whatsapp: "",
  phone: "",
  address: "",
};

export async function getStoreSettings(): Promise<StoreSettings> {
  const ref = api.getSettingsDoc("global");
  const data = await api.getData(ref);
  if (!data) return DEFAULT_SETTINGS;
  return {
    storeName: (data.storeName as string) ?? DEFAULT_SETTINGS.storeName,
    logo: (data.logo as string) ?? DEFAULT_SETTINGS.logo,
    whatsapp: (data.whatsapp as string) ?? DEFAULT_SETTINGS.whatsapp,
    phone: (data.phone as string) ?? DEFAULT_SETTINGS.phone,
    address: (data.address as string) ?? DEFAULT_SETTINGS.address,
  };
}

export async function saveStoreSettings(settings: StoreSettings) {
  const ref = api.getSettingsDoc("global");
  await api.setData({
    docRef: ref,
    data: settings,
    merge: true,
  });
}

