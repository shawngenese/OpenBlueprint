---
name: zod-schema-builder
description: Construct robust Zod schemas for AI prompt response parsing and API request validation.
---

# Zod Schema Validation Skill

When constructing schemas for LLM JSON outputs or API endpoints:

## Rules
- Define schemas as standard TypeScript types using `z.infer<typeof schema>`.
- For LLM outputs, make key arrays explicit and provide `.describe()` strings on fields to assist model parsing.
- Always implement fallbacks and strict bounds (e.g., `z.array().min(0).max(5)` for clarification questions).