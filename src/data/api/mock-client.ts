/** Simulated network delay for offline demo API */
export async function mockDelay(minMs = 200, maxMs = 800): Promise<void> {
  const ms = minMs + Math.floor(Math.random() * (maxMs - minMs + 1));
  await new Promise((r) => setTimeout(r, ms));
}

export type ApiResult<T> = { data: T; ok: true } | { error: string; ok: false };

export async function wrapApi<T>(fn: () => T, delayMs = 120): Promise<ApiResult<T>> {
  try {
    await mockDelay(delayMs);
    return { data: fn(), ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error", ok: false };
  }
}
