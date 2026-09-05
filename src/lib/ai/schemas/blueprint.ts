import { z } from "zod";

// 20 canonical keys — must match prisma/schema.prisma SectionKey enum and SECTION_KEYS in config.ts
export const blueprintSchema = z.object({
  overview: z.string().min(50).max(5000).describe("Executive overview: 2-3 paragraphs summarizing the product vision, value prop, and scope"),
  problem: z.string().min(50).max(5000).describe("Problem statement: who suffers, pain points, why now, consequences of inaction"),
  goals: z.string().min(50).max(5000).describe("Goals & success metrics: measurable outcomes, KPIs, business objectives"),
  targetUsers: z.string().min(50).max(5000).describe("Target users: personas, segments, needs, jobs-to-be-done"),
  roles: z.string().min(30).max(5000).describe("Roles & permissions: user roles, access levels, RBAC matrix in markdown table"),
  features: z.string().min(100).max(8000).describe("Features: prioritized list (Must/Should/Could) with brief descriptions, markdown bullets/tables"),
  functionalReq: z.string().min(50).max(8000).describe("Functional requirements: numbered FR-001 etc, clear, testable, markdown list"),
  nonFunctionalReq: z.string().min(50).max(5000).describe("Non-functional requirements: performance, scalability, security, accessibility, etc."),
  techStack: z.string().min(50).max(5000).describe("Recommended tech stack: frontend, backend, DB, infra, with rationale, markdown table"),
  altStacks: z.string().min(30).max(5000).describe("Alternative stacks: 2-3 options with trade-offs, when to choose each"),
  architecture: z.string().min(100).max(8000).describe("Architecture: high-level diagram description, components, data flow, patterns (monolith/modular)"),
  database: z.string().min(50).max(5000).describe("Database design: entities, relations, indexes, example Prisma schema snippet"),
  api: z.string().min(50).max(8000).describe("API design: REST endpoints table (Method Path Description) + auth, pagination, error handling"),
  uiPages: z.string().min(50).max(5000).describe("UI pages & flows: page list, key user journeys, wireframe notes, markdown list/table"),
  security: z.string().min(50).max(5000).describe("Security: auth, authorization, data protection, OWASP considerations"),
  scalability: z.string().min(50).max(5000).describe("Scalability & performance: caching, CDN, scaling strategies, bottlenecks"),
  roadmap: z.string().min(100).max(5000).describe("Roadmap: phased milestones (MVP -> v1 -> v2) with timelines, deliverables, markdown table"),
  complexity: z.string().min(30).max(3000).describe("Complexity assessment: overall rating (Low/Medium/High) + breakdown by area"),
  risks: z.string().min(50).max(5000).describe("Risks & mitigations: technical, product, market risks in table Risk | Impact | Mitigation"),
  future: z.string().min(30).max(5000).describe("Future enhancements: backlog ideas, nice-to-haves, extensibility points"),
});

export type BlueprintOutput = z.infer<typeof blueprintSchema>;
export type BlueprintSectionKey = keyof BlueprintOutput;

// Ordered keys for DB persistence and UI rendering — canonical order per plan.md:40
export const BLUEPRINT_ORDER: BlueprintSectionKey[] = [
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
];

// Human-readable meta for each section (title + short hint)
export const BLUEPRINT_META: Record<BlueprintSectionKey, { title: string; hint: string }> = {
  overview: { title: "Overview", hint: "Vision & scope" },
  problem: { title: "Problem Statement", hint: "Pain & why now" },
  goals: { title: "Goals & Metrics", hint: "KPIs & objectives" },
  targetUsers: { title: "Target Users", hint: "Personas" },
  roles: { title: "Roles & Permissions", hint: "RBAC" },
  features: { title: "Features", hint: "Must/Should/Could" },
  functionalReq: { title: "Functional Requirements", hint: "Testable FRs" },
  nonFunctionalReq: { title: "Non-Functional Requirements", hint: "NFRs" },
  techStack: { title: "Tech Stack", hint: "Recommended" },
  altStacks: { title: "Alternative Stacks", hint: "Trade-offs" },
  architecture: { title: "Architecture", hint: "Components & flow" },
  database: { title: "Database Design", hint: "Entities & schema" },
  api: { title: "API Design", hint: "Endpoints" },
  uiPages: { title: "UI Pages & Flows", hint: "Journeys" },
  security: { title: "Security", hint: "Auth & protection" },
  scalability: { title: "Scalability", hint: "Performance" },
  roadmap: { title: "Roadmap", hint: "Phased plan" },
  complexity: { title: "Complexity", hint: "Rating" },
  risks: { title: "Risks & Mitigations", hint: "Risk table" },
  future: { title: "Future Enhancements", hint: "Backlog" },
};
