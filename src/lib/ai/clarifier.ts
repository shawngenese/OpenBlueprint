import { generateObject } from "ai";
import { DEFAULT_MODEL } from "./client";
import { AI_CONFIG } from "./config";
import { clarifierSchema, type ClarifierOutput } from "./schemas/clarifier";
import { CLARIFIER_SYSTEM_PROMPT, buildClarifierUserPrompt } from "./prompts/clarifier";
import { withRetry } from "./withRetry";

export async function generateClarifierQuestions(
  rawIdea: string,
  opts?: { projectTitle?: string; model?: typeof DEFAULT_MODEL }
): Promise<ClarifierOutput> {
  if (!rawIdea || rawIdea.trim().length < 10) {
    throw new Error("rawIdea must be at least 10 characters");
  }

  const model = opts?.model ?? DEFAULT_MODEL;

  const object = await withRetry(async () => {
    const { object } = await generateObject({
      model,
      schema: clarifierSchema,
      system: CLARIFIER_SYSTEM_PROMPT,
      prompt: buildClarifierUserPrompt(rawIdea, opts?.projectTitle),
      temperature: AI_CONFIG.clarifier.temperature,
    });
    return object;
  });

  // Extra runtime guard: schema already enforces <=5, but double-check
  if (object.questions.length > 5) {
    return { questions: object.questions.slice(0, 5) };
  }
  return object;
}

// Re-export for convenience
export { clarifierSchema };
export type { ClarifierOutput };
