import { z } from "zod";

export const clarifierQuestionSchema = z.object({
  question: z.string().min(10).max(300).describe("A single high-impact clarifying question to disambiguate the idea"),
  rationale: z.string().max(200).optional().describe("Brief why this question matters (optional)"),
  category: z.enum(["users", "problem", "features", "tech", "scope", "business"]).optional().describe("Question category"),
});

export const clarifierSchema = z.object({
  questions: z
    .array(clarifierQuestionSchema)
    .min(1)
    .max(5)
    .describe("Array of 1 to 5 high-impact clarifying questions. Must be <=5, no duplicates, each targets a different ambiguity"),
});

export type ClarifierOutput = z.infer<typeof clarifierSchema>;
export type ClarifierQuestion = z.infer<typeof clarifierQuestionSchema>;
