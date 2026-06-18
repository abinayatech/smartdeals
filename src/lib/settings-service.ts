import { KEYS, readJSON, writeJSON } from "./storage";

export type UserSettings = {
  account: { emailNotifications: boolean; smsAlerts: boolean; language: string };
  security: { twoFactor: boolean; loginAlerts: boolean; sessionTimeout: number };
  notifications: { priceDrops: boolean; orderUpdates: boolean; aiSuggestions: boolean; deals: boolean; marketing: boolean };
  appearance: { theme: "light" | "dark" | "system"; reducedMotion: boolean; compactMode: boolean };
  privacy: { shareData: boolean; locationAccess: boolean; personalizedAds: boolean; analytics: boolean };
};

export type Address = {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  isDefault: boolean;
};

const DEFAULT_SETTINGS: UserSettings = {
  account: { emailNotifications: true, smsAlerts: true, language: "en" },
  security: { twoFactor: false, loginAlerts: true, sessionTimeout: 30 },
  notifications: { priceDrops: true, orderUpdates: true, aiSuggestions: true, deals: true, marketing: false },
  appearance: { theme: "light", reducedMotion: false, compactMode: false },
  privacy: { shareData: false, locationAccess: true, personalizedAds: false, analytics: true },
};

const DEFAULT_ADDRESSES: Address[] = [
  { id: "addr-1", label: "Home", line1: "42 Hill Road", line2: "Bandra West", city: "Mumbai", pincode: "400050", isDefault: true },
  { id: "addr-2", label: "Office", line1: "BKC Tower 2, G Block", city: "Mumbai", pincode: "400051", isDefault: false },
];

export function getSettings(): UserSettings {
  return readJSON(KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(settings: UserSettings) {
  writeJSON(KEYS.settings, settings);
  applyTheme(settings.appearance.theme);
}

export function updateSettings<K extends keyof UserSettings>(section: K, updates: Partial<UserSettings[K]>) {
  const settings = getSettings();
  settings[section] = { ...settings[section], ...updates };
  saveSettings(settings);
  return settings;
}

export function getAddresses(): Address[] {
  return readJSON<Address[]>(KEYS.addresses, DEFAULT_ADDRESSES);
}

export function saveAddresses(addresses: Address[]) {
  writeJSON(KEYS.addresses, addresses);
}

export function addAddress(addr: Omit<Address, "id">) {
  const addresses = getAddresses();
  const newAddr = { ...addr, id: crypto.randomUUID() };
  if (newAddr.isDefault) addresses.forEach((a) => (a.isDefault = false));
  addresses.push(newAddr);
  saveAddresses(addresses);
  return newAddr;
}

export function deleteAddress(id: string) {
  const addresses = getAddresses().filter((a) => a.id !== id);
  saveAddresses(addresses);
}

export function applyTheme(theme: "light" | "dark" | "system") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else if (theme === "light") root.classList.remove("dark");
  else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  }
}

export type SubscriptionPlan = "free" | "plus" | "pro" | "enterprise";

export function getSubscription(): SubscriptionPlan {
  return readJSON<SubscriptionPlan>(KEYS.plan, "free");
}

export function setSubscription(plan: SubscriptionPlan) {
  writeJSON(KEYS.plan, plan);
}
