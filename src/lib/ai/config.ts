// AI configuration per AGENTS.md + .opencode/plan.md

export const AI_CONFIG = {
  model: "gemini-3.6-flash" as const,
  // Call 1 (Clarifier) — max 5 high-impact questions
  clarifier: {
    maxQuestions: 5,
    temperature: 0.7,
  },
  // Call 2 (Generator) — 20-section blueprint
  generator: {
    temperature: 0.5,
  },
  // Per-section regeneration
  regenerate: {
    temperature: 0.5,
  },
} as const;

// Section keys (20) — canonical order for blueprint generation and DB persistence
export const SECTION_KEYS = [
  "overview",
  "problem",
  "goals",
  "targetUsers",
  "roles",
  "features",
  "functionalReq",
  "nonFunctionalReq",
  "techStack",
  "altStacks",
  "architecture",
  "database",
  "api",
  "uiPages",
  "security",
  "scalability",
  "roadmap",
  "complexity",
  "risks",
  "future",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

// Output mode filters — MUST filter existing sections, NEVER re-call LLM (AGENTS.md Rule 4)
export const OUTPUT_MODES = {
  executive: ["overview", "problem", "goals", "features", "roadmap", "complexity", "risks", "techStack"],
  technical: ["techStack", "altStacks", "architecture", "database", "api", "uiPages", "security", "scalability", "roadmap"],
  complete: [...SECTION_KEYS],
} as const;
