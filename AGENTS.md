# AGENTS.md — Rules & Guidelines for AI Project Consultant

## Project Context
You are building an AI Project Consultant MVP that turns rough app ideas into structured, editable, exportable technical blueprints.

## Core Tech Stack
- **Framework:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Database & ORM:** PostgreSQL (Supabase/Neon) + Prisma
- **Auth:** Auth.js (NextAuth v5) — Google + GitHub OAuth + Credentials
- **AI Integration:** OpenAI `gpt-4o-mini` via Vercel `ai` SDK (JSON mode)
- **Validation:** Zod schemas (shared client/server)
- **PDF Generation:** `@react-pdf/renderer` (Server-side rendering)
- **Deployment:** Vercel

## Installed Skills & When to Use
Load skills from `.opencode/skills/` using the skill tool when performing relevant tasks:
- **`frontend-design`**: Use when creating or styling UI pages, forms, tabs, or components.
- **`nextjs-app-router`**: Use when creating Next.js pages, API routes, or Server Actions.
- **`prisma-expert`**: Use when altering `prisma/schema.prisma` or writing database access functions.
- **`zod-schema-builder`**: Use when creating validation for API routes or OpenAI structured outputs.

## Strict Architectural Rules
1. **Monolith First:** Absolutely NO microservices, background job queues, or external state managers.
2. **Data Structure:** Store blueprints as individual `Section` records mapped to `Blueprint`, NOT as unformatted chat history blobs.
3. **AI Call Constraints:**
   - Call 1 (Clarifier) asks a MAXIMUM of 5 high-impact questions.
   - Call 2 (Generator) must validate against the 20-section Zod schema.
   - Per-section regeneration updates ONLY the targeted section key (`Section.key`).
4. **Output Modes:** Executive vs. Technical vs. Complete view modes MUST filter existing sections on the client or server query—NEVER trigger an LLM re-call when toggling tabs.
5. **Code Style:**
   - Keep interactive client code in dedicated `'use client'` files under `/components`.
   - Keep business logic under `/lib`.
   - Enforce type-safety across all server inputs using Zod.

## Step-by-Step Task Execution Protocol
1. Read `.opencode/plan.md` before starting any milestone task.
2. Execute tasks strictly in the order laid out in Section 10 (Build Phases).
3. Confirm proposed database schema changes or dependency installations before executing them.