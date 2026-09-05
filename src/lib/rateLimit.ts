import { prisma } from "@/lib/db";

const MAX_PER_DAY = 5;

// In-memory fallback for dev without DB or for fast path (also helps Vercel cold starts)
// Key: userId, Value: { count, resetAt }
const memory = new Map<string, { count: number; resetAt: number }>();

function getTodayWindow() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const resetAt = new Date(start);
  resetAt.setDate(resetAt.getDate() + 1);
  return { start, end, resetAt };
}

export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const { start, resetAt } = getTodayWindow();

  // Try DB count; fallback to memory if DB unreachable
  try {
    const count = await prisma.generationLog.count({
      where: { userId, createdAt: { gte: start } },
    });
    const remaining = Math.max(0, MAX_PER_DAY - count);
    return { allowed: count < MAX_PER_DAY, remaining, resetAt };
  } catch {
    // In-memory fallback
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

export async function recordGeneration(
  userId: string,
  opts?: { projectId?: string; type?: string; key?: string }
): Promise<void> {
  const { projectId, type = "generate", key } = opts || {};

  // Update memory
  const { resetAt } = getTodayWindow();
  const now = Date.now();
  const entry = memory.get(userId);
  if (!entry || now >= entry.resetAt) {
    memory.set(userId, { count: 1, resetAt: resetAt.getTime() });
  } else {
    entry.count += 1;
  }

  // Try DB persist (non-blocking failure)
  try {
    await prisma.generationLog.create({
      data: { userId, projectId, type, key },
    });
  } catch {
    // ignore — memory already tracked
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
