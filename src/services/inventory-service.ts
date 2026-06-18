import type { InventoryRecord } from "@/models";
import { products } from "@/lib/mock-data";
import { GLOBAL_KEYS, readJSON, writeJSON } from "@/utils/storage";
import { createSeededRandom, randInt } from "@/lib/seeded-random";

function allInventory(): InventoryRecord[] {
  let records = readJSON<InventoryRecord[]>(GLOBAL_KEYS.inventory, []);
  if (records.length === 0) {
    const rand = createSeededRandom(99);
    records = products.map((p) => ({
      productId: p.id,
      storeId: p.storeId,
      stockAvailable: randInt(rand, 20, 500),
      stockSold: randInt(rand, 5, 200),
      reservedStock: randInt(rand, 0, 30),
      returnedStock: randInt(rand, 0, 15),
    }));
    writeJSON(GLOBAL_KEYS.inventory, records);
  }
  return records;
}

export function getInventory(productId: string, storeId?: string): InventoryRecord | undefined {
  const records = allInventory();
  if (storeId) return records.find((r) => r.productId === productId && r.storeId === storeId);
  return records.find((r) => r.productId === productId);
}

export function getStoreInventory(storeId: string): InventoryRecord[] {
  return allInventory().filter((r) => r.storeId === storeId);
}

export function updateInventory(productId: string, storeId: string, updates: Partial<Omit<InventoryRecord, "productId" | "storeId">>) {
  const records = allInventory();
  const idx = records.findIndex((r) => r.productId === productId && r.storeId === storeId);
  if (idx >= 0) {
    records[idx] = { ...records[idx], ...updates };
  } else {
    records.push({
      productId,
      storeId,
      stockAvailable: updates.stockAvailable ?? 100,
      stockSold: updates.stockSold ?? 0,
      reservedStock: updates.reservedStock ?? 0,
      returnedStock: updates.returnedStock ?? 0,
    });
  }
  writeJSON(GLOBAL_KEYS.inventory, records);
  return records.find((r) => r.productId === productId && r.storeId === storeId)!;
}

export function reserveStock(productId: string, storeId: string, qty: number) {
  const inv = getInventory(productId, storeId);
  if (!inv || inv.stockAvailable < qty) throw new Error("Insufficient stock");
  updateInventory(productId, storeId, {
    stockAvailable: inv.stockAvailable - qty,
    reservedStock: inv.reservedStock + qty,
  });
}

export function sellStock(productId: string, storeId: string, qty: number) {
  const inv = getInventory(productId, storeId);
  if (!inv) return;
  updateInventory(productId, storeId, {
    reservedStock: Math.max(0, inv.reservedStock - qty),
    stockSold: inv.stockSold + qty,
  });
}

export function returnStock(productId: string, storeId: string, qty: number) {
  const inv = getInventory(productId, storeId);
  if (!inv) return;
  updateInventory(productId, storeId, {
    returnedStock: inv.returnedStock + qty,
    stockAvailable: inv.stockAvailable + qty,
  });
}
