import FirestoreApi from "@/services/firestoreApi";
import type { Order, OrderStatus } from "@/types/store";

const api = FirestoreApi.Api;

export async function createOrder(order: Omit<Order, "id">) {
  const id = api.getNewId("orders");
  const ref = api.getOrderDoc(id);
  const payload: Order = { ...order, id };
  await api.setData({
    docRef: ref,
    data: payload,
    merge: true,
  });
  return id;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const ref = api.getOrderDoc(orderId);
  await api.updateData({
    docRef: ref,
    data: { status },
  });
}

