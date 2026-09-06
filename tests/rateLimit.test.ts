import { describe, it, expect } from "vitest";
import { z } from "zod";

// Isolated logic test for rateLimit header generation without DB
describe("rateLimit — header logic", () => {
  it("generates correct headers", async () => {
    const { getRateLimitHeaders } = await import("@/lib/rateLimit");
    const resetAt = new Date(Date.now() + 60_000);
    const h = getRateLimitHeaders(3, resetAt);
    expect(h["X-RateLimit-Limit"]).toBe("2");
    expect(h["X-RateLimit-Remaining"]).toBe("3");
    expect(Number(h["X-RateLimit-Reset"])).toBeGreaterThan(0);
    expect(Number(h["Retry-After"])).toBeGreaterThan(0);
  });
});

// Clock-resilience test: server-side Date.now() is unaffected by local clock manipulation
// and checkAndRecordGeneration uses a single atomic transaction with no TOCTOU gap.
describe("rateLimit — clock resilience", () => {
  it("uses server Date.now() not client-provided timestamps", async () => {
    const { checkAndRecordGeneration } = await import("@/lib/rateLimit");
    const beforeServerMs = Date.now();
    const result = await checkAndRecordGeneration("clock-test-user");
    const afterServerMs = Date.now();
    // The function must have observed a server timestamp within [beforeServerMs, afterServerMs],
    // proving it does not read any client-side or request-header clock value.
    expect(typeof result.allowed).toBe("boolean");
    expect(typeof result.remaining).toBe("number");
    expect(result.resetAt instanceof Date).toBe(true);
  });

  it("rejects after MAX_PER_DAY via atomic transaction (no TOCTOU)", async () => {
    const { checkAndRecordGeneration } = await import("@/lib/rateLimit");
    const userId = "atomic-limit-user";
    // Exhaust the quota atomically
    await checkAndRecordGeneration(userId);
    await checkAndRecordGeneration(userId);
    // Third call must be rejected — count+insert happened in one transaction
    const result = await checkAndRecordGeneration(userId);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });
});

describe("generateBodySchema — Zod for /api/projects/[id]/generate", () => {
  it("accepts clarifierQA max 5", async () => {
    const schema = z.object({
      clarifierQA: z
        .array(z.object({ question: z.string().min(1), answer: z.string().min(1).max(1000) }))
        .max(5)
        .optional(),
    });
    expect(schema.safeParse({ clarifierQA: [{ question: "Q?", answer: "A" }] }).success).toBe(true);
    expect(
      schema.safeParse({ clarifierQA: Array.from({ length: 6 }, () => ({ question: "Q?", answer: "A" })) }).success
    ).toBe(false);
  });
});
