import { loadSession } from "@/services/auth-service";

export function getCurrentUserId(): string | null {
  return loadSession()?.id ?? null;
}

export function requireUserId(): string {
  const id = getCurrentUserId();
  if (!id) throw new Error("Authentication required");
  return id;
}
