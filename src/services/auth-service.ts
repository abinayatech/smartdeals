import { GLOBAL_KEYS, readJSON, writeJSON, removeKey } from "@/utils/storage";
import type { SessionTokens, SessionUser, StoredAccount } from "@/models";
import { formatPhone } from "@/validators/auth.validator";

export type { StoredAccount, SessionUser };

const DEMO_ACCOUNTS: StoredAccount[] = [
  {
    id: "admin-1",
    fullName: "Admin User",
    email: "admin@smartdeal.com",
    mobile: "+91 98765 43210",
    password: "Admin@123",
    role: "admin",
    joinedAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "demo-1",
    fullName: "Demo User",
    email: "demo@smartdeal.com",
    mobile: "+91 91234 56789",
    password: "Demo@123",
    role: "user",
    joinedAt: new Date("2024-06-01").toISOString(),
  },
  {
    id: "dealer-1",
    fullName: "Dealer User",
    email: "dealer@smartdeal.com",
    mobile: "+91 99887 76655",
    password: "Dealer@123",
    role: "dealer",
    storeId: "s1",
    joinedAt: new Date("2024-03-01").toISOString(),
  },
];

function ensureAccounts(): StoredAccount[] {
  let accounts = readJSON<StoredAccount[]>(GLOBAL_KEYS.accounts, []);
  if (accounts.length === 0) {
    accounts = [...DEMO_ACCOUNTS];
    writeJSON(GLOBAL_KEYS.accounts, accounts);
  }
  return accounts;
}

function generateToken(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

export function createSessionTokens(): SessionTokens {
  const tokens: SessionTokens = {
    accessToken: generateToken("sd_access"),
    refreshToken: generateToken("sd_refresh"),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  writeJSON(GLOBAL_KEYS.sessionToken, tokens);
  return tokens;
}

export function validateAccessToken(): boolean {
  const tokens = readJSON<SessionTokens | null>(GLOBAL_KEYS.sessionToken, null);
  if (!tokens) return true; // legacy sessions without tokens
  return new Date(tokens.expiresAt).getTime() > Date.now();
}

export function refreshSessionToken(): SessionTokens | null {
  const tokens = readJSON<SessionTokens | null>(GLOBAL_KEYS.sessionToken, null);
  if (!tokens?.refreshToken) return null;
  return createSessionTokens();
}

export function getAccounts(): StoredAccount[] {
  return ensureAccounts();
}

export function findAccountByEmail(email: string): StoredAccount | undefined {
  return ensureAccounts().find((a) => a.email.toLowerCase() === email.toLowerCase());
}

export function registerAccount(data: {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}): StoredAccount {
  const accounts = ensureAccounts();
  if (accounts.some((a) => a.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const account: StoredAccount = {
    id: crypto.randomUUID(),
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    mobile: formatPhone(data.mobile),
    password: data.password,
    role: "user",
    joinedAt: new Date().toISOString(),
  };
  accounts.push(account);
  writeJSON(GLOBAL_KEYS.accounts, accounts);
  return account;
}

export function validateCredentials(email: string, password: string): StoredAccount | null {
  const account = findAccountByEmail(email);
  if (!account || account.password !== password) return null;
  return account;
}

export function toSessionUser(account: StoredAccount): SessionUser {
  return {
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    mobile: account.mobile,
    role: account.role,
    storeId: account.storeId,
    avatar: account.avatar,
  };
}

export function updateAccount(id: string, updates: Partial<Pick<StoredAccount, "fullName" | "mobile" | "avatar" | "password">>) {
  const accounts = ensureAccounts();
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx === -1) return;
  accounts[idx] = { ...accounts[idx], ...updates };
  writeJSON(GLOBAL_KEYS.accounts, accounts);
}

export function getRememberMe(): boolean {
  return readJSON(GLOBAL_KEYS.remember, false);
}

export function setRememberMe(value: boolean) {
  writeJSON(GLOBAL_KEYS.remember, value);
}

export function saveSession(user: SessionUser | null) {
  writeJSON(GLOBAL_KEYS.user, user);
  if (user) createSessionTokens();
}

export function loadSession(): SessionUser | null {
  return readJSON<SessionUser | null>(GLOBAL_KEYS.user, null);
}

export function clearSession() {
  removeKey(GLOBAL_KEYS.user);
  removeKey(GLOBAL_KEYS.sessionToken);
  removeKey(GLOBAL_KEYS.refreshToken);
}

/** @deprecated use GLOBAL_KEYS from utils/storage */
export const KEYS = {
  user: GLOBAL_KEYS.user,
  remember: GLOBAL_KEYS.remember,
  accounts: GLOBAL_KEYS.accounts,
  cart: "smartdeal.cart",
  favorites: "smartdeal.favorites",
  orders: "smartdeal.orders",
  notifications: "smartdeal.notifications",
  planner: "smartdeal.planner",
  plannerHistory: "smartdeal.plannerHistory",
  settings: "smartdeal.settings",
  addresses: "smartdeal.addresses",
  adminData: GLOBAL_KEYS.adminData,
  checkout: "smartdeal.checkout",
  lastReceipt: "smartdeal.lastReceipt",
  plan: "smartdeal.plan",
  compare: "smartdeal.compare",
};
