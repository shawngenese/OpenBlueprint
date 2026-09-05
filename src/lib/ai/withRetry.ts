/**
 * Generic retry with exponential backoff for LLM calls.
 * Retries on network / 5xx / Zod validation errors, not on 4xx auth.
 */

type RetryOpts = {
  attempts?: number; // total attempts, default 3
  baseDelayMs?: number; // initial delay, default 500
  maxDelayMs?: number; // cap, default 4000
};

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOpts = {}): Promise<T> {
  const attempts = opts.attempts ?? 3;
  const baseDelayMs = opts.baseDelayMs ?? 500;
  const maxDelayMs = opts.maxDelayMs ?? 4000;

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      const message = e instanceof Error ? e.message : String(e);
      // Do not retry on auth / client errors (4xx except 429)
      const isAuthError = /401|403|unauthorized|forbidden/i.test(message);
      const isRateLimit = /429|rate.?limit/i.test(message);
      const shouldRetry = !isAuthError || isRateLimit;

      if (attempt === attempts || !shouldRetry) throw e;

      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      // Add jitter 0-20%
      const jitter = delay * 0.2 * Math.random();
      await new Promise((r) => setTimeout(r, delay + jitter));
    }
  }

  throw lastError;
}
