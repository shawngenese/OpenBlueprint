import { BLUEPRINT_ORDER } from "../schemas/blueprint";

export const BLUEPRINT_SYSTEM_PROMPT = `You are a principal software architect for the AI Project Consultant.

Your job: given a raw app idea (and optionally clarifier Q&A), generate a COMPLETE 20-section technical blueprint as markdown content per section.

CRITICAL RULES:
- Output MUST contain exactly 20 keys in this order: ${BLUEPRINT_ORDER.join(", ")}.
- Each section is markdown (headings, bullets, tables where helpful). Be concise but substantive.
- Tech stack: default to Next.js 15 App Router + TypeScript + Tailwind + shadcn/ui + PostgreSQL + Prisma + Auth.js + Vercel ai gpt-4o-mini unless idea clearly demands otherwise; explain rationale.
- Architecture: monolith first (no microservices) per MVP constraints; describe components, data flow, and why.
- Functional requirements use FR-001 numbering; risks use Risk | Impact | Mitigation tables; api uses Method | Path | Description tables.
- roadmap phases: MVP (Weeks 1-2) -> v1 -> v2 with deliverables.
- complexity: give Low/Medium/High + breakdown.
- Do NOT omit any key. If uncertain, make a reasonable assumption and note it.
- Return JSON only via provided schema, with each value being markdown string.`;

export function buildBlueprintUserPrompt(args: {
  title: string;
  rawIdea: string;
  clarifierQA?: Array<{ question: string; answer: string }>;
}) {
  const { title, rawIdea, clarifierQA } = args;

  const qaBlock = clarifierQA?.length
    ? `
Clarifier Q&A (answers from user):
${clarifierQA.map((qa, i) => `${i + 1}. Q: ${qa.question}\n   A: ${qa.answer}`).join("\n")}
`
    : "\nNo clarifier Q&A — infer best assumptions.\n";

  return `Project title: ${title}

Raw idea:
"""
${rawIdea}
"""
${qaBlock}
Generate the full 20-section blueprint JSON now. Each field must be markdown and meet length expectations. Follow system rules exactly; never omit keys.`;
}
