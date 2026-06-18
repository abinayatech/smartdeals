import type { Product, Store, Category, Deal, Order, Notification } from "./mock-data";
import { products, stores, categories, deals, seedOrders, seedNotifications } from "./mock-data";
import { getAccounts } from "./auth-service";
import { KEYS, readJSON, writeJSON } from "./storage";

type AdminOverrides = {
  products?: Product[];
  stores?: Store[];
  categories?: Category[];
  deals?: Deal[];
  orders?: Order[];
  notifications?: Notification[];
};

function getOverrides(): AdminOverrides {
  return readJSON<AdminOverrides>(KEYS.adminData, {});
}

function saveOverrides(overrides: AdminOverrides) {
  writeJSON(KEYS.adminData, overrides);
}

export function getAdminProducts(): Product[] {
  return getOverrides().products ?? products;
}

export function getAdminStores(): Store[] {
  return getOverrides().stores ?? stores;
}

export function getAdminCategories(): Category[] {
  return getOverrides().categories ?? categories;
}

export function getAdminDeals(): Deal[] {
  return getOverrides().deals ?? deals;
}

export function getAdminOrders(): Order[] {
  const userOrders = readJSON<Order[]>(KEYS.orders, []);
  return getOverrides().orders ?? [...userOrders, ...seedOrders];
}

export function getAdminNotifications(): Notification[] {
  const userNotifs = readJSON<Notification[]>(KEYS.notifications, []);
  return getOverrides().notifications ?? [...userNotifs, ...seedNotifications];
}

export function getAdminUsers() {
  return getAccounts();
}

export function adminCreateProduct(product: Product) {
  const list = [...getAdminProducts(), product];
  saveOverrides({ ...getOverrides(), products: list });
  return product;
}

export function adminUpdateProduct(id: string, updates: Partial<Product>) {
  const list = getAdminProducts().map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveOverrides({ ...getOverrides(), products: list });
}

export function adminDeleteProduct(id: string) {
  const list = getAdminProducts().filter((p) => p.id !== id);
  saveOverrides({ ...getOverrides(), products: list });
}

export function adminCreateStore(store: Store) {
  const list = [...getAdminStores(), store];
  saveOverrides({ ...getOverrides(), stores: list });
}

export function adminUpdateStore(id: string, updates: Partial<Store>) {
  const list = getAdminStores().map((s) => (s.id === id ? { ...s, ...updates } : s));
  saveOverrides({ ...getOverrides(), stores: list });
}

export function adminDeleteStore(id: string) {
  const list = getAdminStores().filter((s) => s.id !== id);
  saveOverrides({ ...getOverrides(), stores: list });
}

export function adminCreateCategory(cat: Category) {
  const list = [...getAdminCategories(), cat];
  saveOverrides({ ...getOverrides(), categories: list });
}

export function adminUpdateCategory(id: string, updates: Partial<Category>) {
  const list = getAdminCategories().map((c) => (c.id === id ? { ...c, ...updates } : c));
  saveOverrides({ ...getOverrides(), categories: list });
}

export function adminDeleteCategory(id: string) {
  const list = getAdminCategories().filter((c) => c.id !== id);
  saveOverrides({ ...getOverrides(), categories: list });
}

export function adminCreateDeal(deal: Deal) {
  const list = [...getAdminDeals(), deal];
  saveOverrides({ ...getOverrides(), deals: list });
}

export function adminDeleteDeal(id: string) {
  const list = getAdminDeals().filter((d) => d.id !== id);
  saveOverrides({ ...getOverrides(), deals: list });
}

export function adminUpdateOrderStatus(id: string, status: Order["status"]) {
  const list = getAdminOrders().map((o) => (o.id === id ? { ...o, status } : o));
  saveOverrides({ ...getOverrides(), orders: list });
}

export function adminDeleteNotification(id: string) {
  const list = getAdminNotifications().filter((n) => n.id !== id);
  saveOverrides({ ...getOverrides(), notifications: list });
}

export function getAnalytics() {
  const allOrders = getAdminOrders();
  const allUsers = getAdminUsers();
  const delivered = allOrders.filter((o) => o.status === "Delivered");
  const revenue = delivered.reduce((s, o) => s + o.total, 0);
  const savings = delivered.reduce((s, o) => s + o.discount, 0);

  const productSales: Record<string, { name: string; count: number; revenue: number }> = {};
  for (const o of delivered) {
    for (const item of o.items) {
      if (!productSales[item.productId]) productSales[item.productId] = { name: item.name, count: 0, revenue: 0 };
      productSales[item.productId].count += item.qty;
      productSales[item.productId].revenue += item.price * item.qty;
    }
  }
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const storeSales: Record<string, { name: string; count: number; revenue: number }> = {};
  for (const o of delivered) {
    if (!storeSales[o.storeId]) storeSales[o.storeId] = { name: o.store, count: 0, revenue: 0 };
    storeSales[o.storeId].count++;
    storeSales[o.storeId].revenue += o.total;
  }
  const topStores = Object.values(storeSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const weekly = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const dayStr = day.toISOString().slice(0, 10);
    const dayOrders = allOrders.filter((o) => o.placedAt.slice(0, 10) === dayStr);
    return { day: day.toLocaleDateString("en-IN", { weekday: "short" }), orders: dayOrders.length, revenue: dayOrders.reduce((s, o) => s + o.total, 0) };
  });

  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthStr = d.toISOString().slice(0, 7);
    const monthOrders = allOrders.filter((o) => o.placedAt.slice(0, 7) === monthStr);
    const deliveredMonth = monthOrders.filter((o) => o.status === "Delivered");
    return {
      month: d.toLocaleDateString("en-IN", { month: "short" }),
      orders: monthOrders.length,
      revenue: monthOrders.reduce((s, o) => s + o.total, 0),
      savings: deliveredMonth.reduce((s, o) => s + o.discount, 0),
    };
  });

  const weeklySavings = weekly.map((w, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const dayStr = day.toISOString().slice(0, 10);
    const dayOrders = delivered.filter((o) => o.placedAt.slice(0, 10) === dayStr);
    return { ...w, savings: dayOrders.reduce((s, o) => s + o.discount, 0) };
  });

  return {
    totalUsers: allUsers.length,
    totalOrders: allOrders.length,
    totalRevenue: revenue,
    totalSavings: savings,
    topProducts,
    topStores,
    weekly,
    weeklySavings,
    monthly,
  };
}
