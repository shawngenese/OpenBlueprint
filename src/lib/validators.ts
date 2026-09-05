import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const createProjectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  rawIdea: z.string().min(10, "Describe your idea in at least 10 characters").max(5000),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// Re-export AI schemas for shared client/server validation (Call 1 & 2)
export { clarifierSchema, clarifierQuestionSchema } from "@/lib/ai/schemas/clarifier";
export type { ClarifierOutput, ClarifierQuestion } from "@/lib/ai/schemas/clarifier";
export { blueprintSchema, BLUEPRINT_ORDER, BLUEPRINT_META } from "@/lib/ai/schemas/blueprint";
export type { BlueprintOutput, BlueprintSectionKey } from "@/lib/ai/schemas/blueprint";
