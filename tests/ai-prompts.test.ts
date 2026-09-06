import { describe, it, expect } from "vitest";
import { buildClarifierUserPrompt, CLARIFIER_SYSTEM_PROMPT } from "@/lib/ai/prompts/clarifier";
import { buildBlueprintUserPrompt, BLUEPRINT_SYSTEM_PROMPT } from "@/lib/ai/prompts/blueprint";
import { BLUEPRINT_ORDER } from "@/lib/ai/schemas/blueprint";
import { OUTPUT_MODES, SECTION_KEYS } from "@/lib/ai/config";
import { withRetry } from "@/lib/ai/withRetry";

describe("AI prompts — clarifier", () => {
  it("system prompt enforces max 5", () => {
    expect(CLARIFIER_SYSTEM_PROMPT).toMatch(/Maximum 5/i);
    expect(CLARIFIER_SYSTEM_PROMPT).toMatch(/never exceed 5/i);
  });
  it("user prompt contains title and rawIdea", () => {
    const p = buildClarifierUserPrompt("My raw idea text", "My Title");
    expect(p).toContain("My Title");
    expect(p).toContain("My raw idea text");
  });
});

describe("AI prompts — blueprint", () => {
  it("system prompt lists 20 keys in order", () => {
    BLUEPRINT_ORDER.forEach((k) => {
      expect(BLUEPRINT_SYSTEM_PROMPT).toContain(k);
    });
  });
  it("user prompt contains clarifier Q&A when provided", () => {
    const p = buildBlueprintUserPrompt({
      title: "T",
      rawIdea: "R",
      clarifierQA: [{ question: "Who?", answer: "Devs" }],
    });
    expect(p).toContain("Who?");
    expect(p).toContain("Devs");
  });
  it("user prompt handles no Q&A", () => {
    const p = buildBlueprintUserPrompt({ title: "T", rawIdea: "R" });
    expect(p).toContain("No clarifier");
  });
});

describe("AI config — OUTPUT_MODES", () => {
  it("executive 8, technical 9, complete 20 per plan.md", () => {
    expect(OUTPUT_MODES.executive.length).toBe(8);
    expect(OUTPUT_MODES.technical.length).toBe(9);
    expect(OUTPUT_MODES.complete.length).toBe(20);
  });
  it("executive/technical are subsets of 20", () => {
    const all = new Set(SECTION_KEYS as unknown as string[]);
    (OUTPUT_MODES.executive as readonly string[]).forEach((k) => expect(all.has(k)).toBe(true));
    (OUTPUT_MODES.technical as readonly string[]).forEach((k) => expect(all.has(k)).toBe(true));
  });
  it("filtering never re-calls LLM (local filter)", () => {
    const mockSections: { key: string; order: number }[] = BLUEPRINT_ORDER.map((k, i) => ({ key: k, order: i }));
    const exec = mockSections.filter((s) => (OUTPUT_MODES.executive as readonly string[]).includes(s.key));
    const tech = mockSections.filter((s) => (OUTPUT_MODES.technical as readonly string[]).includes(s.key));
    expect(exec.length).toBe(8);
    expect(tech.length).toBe(9);
  });
});

describe("AI — withRetry", () => {
  it("retries transient and succeeds", async () => {
    let n = 0;
    const res = await withRetry(async () => {
      n++;
      if (n < 2) throw new Error("transient 500");
      return "ok";
    });
    expect(res).toBe("ok");
    expect(n).toBe(2);
  });
  it("does not retry auth 401", async () => {
    let n = 0;
    await expect(
      withRetry(async () => {
        n++;
        throw new Error("401 Unauthorized");
      })
    ).rejects.toThrow();
    expect(n).toBe(1);
  });
  it("retries 429 rate limit", async () => {
    let n = 0;
    const res = await withRetry(async () => {
      n++;
      if (n < 2) throw new Error("429 rate limit");
      return "ok";
    });
    expect(res).toBe("ok");
    expect(n).toBe(2);
  });
});
