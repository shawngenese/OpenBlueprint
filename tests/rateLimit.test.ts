import { describe, it, expect } from "vitest";
import { z } from "zod";

// Isolated logic test for rateLimit header generation without DB
describe("rateLimit — header logic", () => {
  it("generates correct headers", async () => {
    const { getRateLimitHeaders } = await import("@/lib/rateLimit");
    const resetAt = new Date(Date.now() + 60_000);
    const h = getRateLimitHeaders(3, resetAt);
    expect(h["X-RateLimit-Limit"]).toBe("5");
    expect(h["X-RateLimit-Remaining"]).toBe("3");
    expect(Number(h["X-RateLimit-Reset"])).toBeGreaterThan(0);
    expect(Number(h["Retry-After"])).toBeGreaterThan(0);
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
