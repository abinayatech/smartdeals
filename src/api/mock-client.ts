export function mockDelay(minMs = 200, maxMs = 800): Promise<void> {
  const ms = minMs + Math.floor(Math.random() * (maxMs - minMs + 1));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function wrapApi<T>(fn: () => T | Promise<T>): Promise<ApiResult<T>> {
  try {
    await mockDelay();
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function apiCall<T>(fn: () => T | Promise<T>): Promise<T> {
  const result = await wrapApi(fn);
  if (!result.ok) throw new Error(result.error);
  return result.data;
}
