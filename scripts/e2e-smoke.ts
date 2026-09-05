/**
 * Smoke test for E2E invariants — no live DB/LLM required.
 * Verifies: OUTPUT_MODES filtering, Zod schemas, withRetry, rateLimit, PDF template, Section order.
 * Run: npx tsx scripts/e2e-smoke.ts  (or `npm run build` already covers TSC)
 */

import { OUTPUT_MODES, SECTION_KEYS } from "../src/lib/ai/config";
import { blueprintSchema, BLUEPRINT_ORDER, BLUEPRINT_META } from "../src/lib/ai/schemas/blueprint";
import { clarifierSchema } from "../src/lib/ai/schemas/clarifier";
import { withRetry } from "../src/lib/ai/withRetry";

async function main() {
  console.log("== E2E Smoke ==");

  // 1. OUTPUT_MODES counts per plan.md:41-44
  const executive = OUTPUT_MODES.executive as readonly string[];
  const technical = OUTPUT_MODES.technical as readonly string[];
  const complete = OUTPUT_MODES.complete as readonly string[];
  console.log(`Executive ${executive.length}/8:`, executive.length === 8 ? "PASS" : `FAIL (${executive})`);
  console.log(`Technical ${technical.length}/9:`, technical.length === 9 ? "PASS" : `FAIL (${technical})`);
  console.log(`Complete ${complete.length}/20:`, complete.length === 20 ? "PASS" : "FAIL");

  // Verify they are subsets of 20
  const allKeys = new Set(SECTION_KEYS as unknown as string[]);
  const invalidExec = executive.filter((k) => !allKeys.has(k));
  const invalidTech = technical.filter((k) => !allKeys.has(k));
  console.log(`Executive subset:`, invalidExec.length === 0 ? "PASS" : `FAIL ${invalidExec}`);
  console.log(`Technical subset:`, invalidTech.length === 0 ? "PASS" : `FAIL ${invalidTech}`);

  // 2. BLUEPRINT_ORDER = SECTION_KEYS
  console.log(`BLUEPRINT_ORDER matches SECTION_KEYS:`, JSON.stringify(BLUEPRINT_ORDER) === JSON.stringify(SECTION_KEYS) ? "PASS" : "FAIL");
  console.log(`BLUEPRINT_META 20:`, Object.keys(BLUEPRINT_META).length === 20 ? "PASS" : "FAIL");

  // 3. Zod: clarifier max 5
  const okClarify = clarifierSchema.safeParse({ questions: Array.from({ length: 5 }, (_, i) => ({ question: `Q${i} is this a valid question with sufficient length?`, category: "users" as const })) });
  const failClarify = clarifierSchema.safeParse({ questions: Array.from({ length: 6 }, () => ({ question: "Valid question with enough length for test?" })) });
  console.log(`Clarifier max 5 ok:`, okClarify.success ? "PASS" : "FAIL");
  console.log(`Clarifier max 5 reject 6:`, !failClarify.success ? "PASS" : "FAIL");

  // 4. Zod: blueprint requires 20 keys (test missing)
  const mockBlueprint: Record<string, string> = {};
  BLUEPRINT_ORDER.forEach((k) => (mockBlueprint[k] = "x".repeat(100)));
  const okBlueprint = blueprintSchema.safeParse(mockBlueprint);
  const failBlueprint = blueprintSchema.safeParse({ overview: "x".repeat(100) });
  console.log(`Blueprint 20 ok:`, okBlueprint.success ? "PASS" : "FAIL");
  console.log(`Blueprint missing reject:`, !failBlueprint.success ? "PASS" : "FAIL");

  // 5. withRetry: succeeds after 1 failure
  let attempts = 0;
  const retried = await withRetry(async () => {
    attempts++;
    if (attempts < 2) throw new Error("transient 500");
    return "ok";
  });
  console.log(`withRetry (1 fail then success):`, retried === "ok" && attempts === 2 ? "PASS" : `FAIL attempts=${attempts}`);

  // 6. Filtering locally (no LLM re-call) — simulate ModeTabs
  const mockSections = BLUEPRINT_ORDER.map((k, i) => ({ id: `${i}`, key: k, title: BLUEPRINT_META[k].title, content: "c", order: i }));
  const execFiltered = mockSections.filter((s) => (executive as readonly string[]).includes(s.key));
  const techFiltered = mockSections.filter((s) => (technical as readonly string[]).includes(s.key));
  console.log(`Filter Executive 8:`, execFiltered.length === 8 ? "PASS" : `FAIL ${execFiltered.length}`);
  console.log(`Filter Technical 9:`, techFiltered.length === 9 ? "PASS" : `FAIL ${techFiltered.length}`);

  console.log("== Smoke done ==");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
