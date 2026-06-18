import type { ReturnRequest } from "@/models";
import { GLOBAL_KEYS, readJSON, writeJSON, readUserTable, writeUserTable } from "@/utils/storage";
import { requireUserId } from "@/utils/user-context";
import { returnStock } from "./inventory-service";
import { getOrderById } from "./orders-service";

function allReturns(): ReturnRequest[] {
  return readJSON<ReturnRequest[]>(GLOBAL_KEYS.returns, []);
}

function saveAll(requests: ReturnRequest[]) {
  writeJSON(GLOBAL_KEYS.returns, requests);
}

export function getReturns(userId?: string): ReturnRequest[] {
  if (userId) {
    return [...allReturns(), ...readUserTable<ReturnRequest[]>(userId, "userReturns", [])]
      .filter((r) => r.userId === userId)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }
  return allReturns();
}

export function getStoreReturns(storeId: string): ReturnRequest[] {
  return allReturns().filter((r) => {
    const order = getOrderById(r.orderId);
    return order?.storeId === storeId;
  });
}

export function requestReturn(orderId: string, productId: string, productName: string, reason: string) {
  const userId = requireUserId();
  const req: ReturnRequest = {
    id: `RET-${Date.now().toString(36).toUpperCase()}`,
    orderId,
    userId,
    productId,
    productName,
    reason,
    status: "Requested",
    requestedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const all = allReturns();
  all.unshift(req);
  saveAll(all);
  const userList = readUserTable<ReturnRequest[]>(userId, "userReturns", []);
  userList.unshift(req);
  writeUserTable(userId, "userReturns", userList);
  return req;
}

export function updateReturnStatus(returnId: string, status: ReturnRequest["status"], storeId?: string) {
  const all = allReturns();
  const idx = all.findIndex((r) => r.id === returnId);
  if (idx < 0) throw new Error("Return not found");
  all[idx].status = status;
  all[idx].updatedAt = new Date().toISOString();
  saveAll(all);
  if (status === "Approved" || status === "Refunded") {
    const order = getOrderById(all[idx].orderId);
    if (order && storeId) returnStock(all[idx].productId, storeId, 1);
  }
  return all[idx];
}

export function approveReturn(returnId: string, storeId: string) {
  return updateReturnStatus(returnId, "Approved", storeId);
}

export function rejectReturn(returnId: string) {
  return updateReturnStatus(returnId, "Rejected");
}

export function markRefunded(returnId: string, storeId: string) {
  return updateReturnStatus(returnId, "Refunded", storeId);
}
