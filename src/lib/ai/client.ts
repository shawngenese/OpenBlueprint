import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Gemini client (free) — requires GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY via https://aistudio.google.com/app/apikey
export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});

// Helper to get model instance (Gemini only)
export const getModel = (model: string = "gemini-3.6-flash") => google(model);

// Default model for MVP — Gemini (gemini-3.6-flash per API deprecation notice)
export const DEFAULT_MODEL = google("gemini-3.6-flash");
