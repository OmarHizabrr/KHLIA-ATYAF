import type { Currency, CurrencyTotal, OrderItem } from "@/types/store";

export function groupTotalsByCurrency(items: OrderItem[]): CurrencyTotal[] {
  const map = new Map<string, CurrencyTotal>();

  for (const item of items) {
    const code = item.currencyCode || "";
    const symbol = item.currencySymbol || code || "ر.س";
    const key = code || symbol;
    const lineTotal = (item.price || 0) * (item.qty || 0);
    const prev = map.get(key);

    if (prev) {
      prev.total += lineTotal;
    } else {
      map.set(key, { code, symbol, total: lineTotal });
    }
  }

  return Array.from(map.values());
}

export function totalInDefaultCurrency(items: OrderItem[], currencies: Currency[]) {
  const defaultCurrency = currencies.find((c) => c.isDefault) ?? null;
  if (!defaultCurrency) return { total: 0, defaultCurrency: null as Currency | null };

  const byCode = new Map<string, Currency>();
  for (const currency of currencies) {
    byCode.set(currency.code, currency);
  }

  let total = 0;
  for (const item of items) {
    const lineTotal = (item.price || 0) * (item.qty || 0);
    const itemCurrency = byCode.get(item.currencyCode || "");

    if (!itemCurrency || !itemCurrency.rate || !defaultCurrency.rate) {
      total += lineTotal;
      continue;
    }

    total += lineTotal * (defaultCurrency.rate / itemCurrency.rate);
  }

  return { total, defaultCurrency };
}

