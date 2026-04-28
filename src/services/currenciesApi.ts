import FirestoreApi from "@/services/firestoreApi";
import type { Currency } from "@/types/store";

const api = FirestoreApi.Api;

export function newCurrencyDraft(): Currency {
  return {
    id: "",
    code: "",
    name: "",
    symbol: "",
    rate: 1,
    isDefault: false,
    isActive: true,
  };
}

export async function upsertCurrency(currency: Currency) {
  const id = currency.id || api.getNewId("currencies");
  const ref = api.getCurrencyDoc(id);
  const payload: Currency = { ...currency, id, code: currency.code.toUpperCase().trim() };
  await api.setData({ docRef: ref, data: payload, merge: true });
  return id;
}

export async function deleteCurrency(currencyId: string) {
  await api.deleteData(api.getCurrencyDoc(currencyId));
}

