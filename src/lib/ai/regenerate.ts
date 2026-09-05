import { generateObject } from "ai";
import { z } from "zod";
import { DEFAULT_MODEL } from "./client";
import { AI_CONFIG } from "./config";
import type { BlueprintSectionKey } from "./schemas/blueprint";
import { BLUEPRINT_META } from "./schemas/blueprint";
import { withRetry } from "./withRetry";

const regenerateSchema = z.object({
  content: z.string().min(30).max(8000).describe("Regenerated markdown content for the single section"),
});

export async function regenerateSection(args: {
  key: BlueprintSectionKey;
  title: string;
  currentContent: string;
  projectTitle: string;
  rawIdea: string;
  // Optional full context for coherence
  otherSections?: Array<{ key: string; title: string; content: string }>;
  instruction?: string;
  model?: typeof DEFAULT_MODEL;
}): Promise<string> {
  const { key, title, currentContent, projectTitle, rawIdea, otherSections, instruction, model } = args;
  const mdl = model ?? DEFAULT_MODEL;
  const meta = BLUEPRINT_META[key as BlueprintSectionKey];

  const system = `You are regenerating a SINGLE blueprint section. Update ONLY the section with key "${key}" (${meta?.title || title}).

Rules:
- Output JSON { content: "markdown..." } for that one section only.
- Keep markdown formatting, be substantive, align with overall blueprint.
- Do NOT output other sections. Do NOT wrap in code fences.
- Incorporate user instruction if provided; otherwise improve clarity, depth, and actionable detail.`;

  const contextBlock = otherSections?.length
    ? `Other sections (truncated for context):
${otherSections.slice(0, 8).map((s) => `- ${s.key} (${s.title}): ${s.content.slice(0, 300)}...`).join("\n")}`
    : "";

  const prompt = `Project: ${projectTitle}
Raw idea:
"""
${rawIdea}
"""

Current "${key}" content to revise:
"""
${currentContent}
"""

${contextBlock}

${instruction ? `User instruction for regeneration: "${instruction}"` : "Regenerate to be clearer, more detailed, and more actionable."}

Return JSON { content: "..." } for key "${key}" only.`;

  const { object } = await withRetry(() =>
    generateObject({
      model: mdl,
      schema: regenerateSchema,
      system,
      prompt,
      temperature: AI_CONFIG.regenerate.temperature,
    })
  );

  return object.content;
}
