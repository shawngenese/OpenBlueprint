import { prisma } from "@/lib/db";

const MAX_PER_DAY = 2;

// In-memory fallback for dev without DB or for fast path (also helps Vercel cold starts)
// Key: userId, Value: { count, resetAt }
const memory = new Map<string, { count: number; resetAt: number }>();

function getTodayWindow() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const resetAt = new Date(start);
  resetAt.setDate(resetAt.getDate() + 1);
  return { start, resetAt };
}

// Atomic check-and-record: single DB transaction so there is no TOCTOU race
// between counting existing logs and inserting a new one. Returns the updated
// remaining count (0 when limit exhausted, never negative).
export async function checkAndRecordGeneration(
  userId: string,
  opts?: { projectId?: string; type?: string; key?: string }
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const { start, resetAt } = getTodayWindow();

  // Sync memory fallback so dev path stays fast & consistent with server clock
  const now = Date.now();
  const memEntry = memory.get(userId);
  if (!memEntry || now >= memEntry.resetAt) {
    memory.set(userId, { count: 0, resetAt: resetAt.getTime() });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const count = await tx.generationLog.count({
        where: { userId, createdAt: { gte: start } },
      });
      if (count >= MAX_PER_DAY) {
        return { allowed: false, remaining: 0, resetAt };
      }
      await tx.generationLog.create({
        data: { ...opts!, userId },
      });
      return { allowed: true, remaining: MAX_PER_DAY - count - 1, resetAt };
    });

    // Keep memory in sync on the success path
    if (result.allowed) {
      const entry = memory.get(userId);
      if (entry) entry.count += 1;
    }
    return result;
  } catch {
    // DB unreachable — fall back to in-memory only
    const entry = memory.get(userId)!;
    if (!entry || entry.count >= MAX_PER_DAY) {
      return { allowed: false, remaining: 0, resetAt };
    }
    entry.count += 1;
    return { allowed: true, remaining: MAX_PER_DAY - entry.count, resetAt };
  }
}

// Kept for callers that only need the remaining count / resetAt (no side effect)
export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const { start, resetAt } = getTodayWindow();

  try {
    const count = await prisma.generationLog.count({
      where: { userId, createdAt: { gte: start } },
    });
    const remaining = Math.max(0, MAX_PER_DAY - count);
    return { allowed: count < MAX_PER_DAY, remaining, resetAt };
  } catch {
    const now = Date.now();
    const entry = memory.get(userId);
    if (!entry || now >= entry.resetAt) {
      memory.set(userId, { count: 0, resetAt: resetAt.getTime() });
      return { allowed: true, remaining: MAX_PER_DAY, resetAt };
    }
    const remaining = Math.max(0, MAX_PER_DAY - entry.count);
    return { allowed: entry.count < MAX_PER_DAY, remaining, resetAt: new Date(entry.resetAt) };
  }
}

export function getRateLimitHeaders(remaining: number, resetAt: Date) {
  const retryAfter = Math.max(0, Math.ceil((resetAt.getTime() - Date.now()) / 1000));
  return {
    "X-RateLimit-Limit": String(MAX_PER_DAY),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.floor(resetAt.getTime() / 1000)),
    "Retry-After": String(retryAfter),
  };
}
