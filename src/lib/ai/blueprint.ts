import { generateObject } from "ai";
import { DEFAULT_MODEL } from "./client";
import { AI_CONFIG } from "./config";
import { blueprintSchema, type BlueprintOutput } from "./schemas/blueprint";
import { BLUEPRINT_SYSTEM_PROMPT, buildBlueprintUserPrompt } from "./prompts/blueprint";
import { withRetry } from "./withRetry";

export async function generateBlueprint(args: {
  title: string;
  rawIdea: string;
  clarifierQA?: Array<{ question: string; answer: string }>;
  model?: typeof DEFAULT_MODEL;
}): Promise<BlueprintOutput> {
  if (!args.rawIdea || args.rawIdea.trim().length < 10) throw new Error("rawIdea too short");
  if (!args.title || args.title.trim().length < 2) throw new Error("title too short");

  const model = args.model ?? DEFAULT_MODEL;

  const object = await withRetry(async () => {
    const { object } = await generateObject({
      model,
      schema: blueprintSchema,
      system: BLUEPRINT_SYSTEM_PROMPT,
      prompt: buildBlueprintUserPrompt(args),
      temperature: AI_CONFIG.generator.temperature,
    });
    return object;
  });

  // Schema guarantees 20 keys; extra runtime sanity
  const missing = Object.keys(blueprintSchema.shape).filter((k) => !(k in object));
  if (missing.length) throw new Error(`Missing blueprint keys: ${missing.join(", ")}`);

  return object;
}

export { blueprintSchema };
export type { BlueprintOutput };
