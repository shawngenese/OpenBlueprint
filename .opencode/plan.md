# Plan — AI Project Consultant (MVP)

## Master Blueprint Checklist

### Phase 1: Foundation (Week 1)
- [x] Initialize Next.js 15 App Router with TypeScript, Tailwind CSS, and shadcn/ui.
- [x] Set up Prisma ORM and configure PostgreSQL connection schema (User, Project, Blueprint, Section models).
- [x] Configure Auth.js (NextAuth) for Google, GitHub, and Credentials support.
- [x] Build `/dashboard` route (project card listing, create/delete project triggers).
- [x] Build `/project/new` raw idea input interface.

### Phase 2: AI Core (Week 2)
- [x] Configure Vercel `ai` SDK client with `gpt-4o-mini`.
- [x] Implement Call 1 (Clarifier Prompt + Zod schema validation for max 5 questions).
- [x] Implement Call 2 (Blueprint Generator Prompt + 20-section Zod schema parser).
- [x] Create `/api/projects/[id]/clarify` and `/api/projects/[id]/generate` routes.
- [x] Implement DB persistence logic for structured sections post-generation.

### Phase 3: Editor & Section Management (Week 3)
- [x] Build `/project/[id]/blueprint` layout with tabs for Executive, Technical, and Complete modes.
- [x] Build collapsible 20-section component with inline markdown editing and 1-second auto-save debounce.
- [x] Create `/api/sections/[id]/regenerate` endpoint for isolated per-section AI updates.
- [x] Implement mode filtering logic for sections without triggering LLM re-calls.

### Phase 4: PDF Export & Guardrails (Week 4)
- [x] Implement `@react-pdf/renderer` templates for Executive, Technical, and Complete document layouts.
- [x] Create `GET /api/projects/[id]/pdf` endpoint to stream rendered PDFs.
- [x] Add auth middleware guards to protect `/dashboard` and `/project/*` routes.
- [x] Implement UI loading states, empty states, and LLM retry/error handling.

### Phase 5: Polish & Deployment (Week 5)
- [x] Add user-level rate limiting (max 5 generations per user per day).
- [x] Configure Vercel deployment and production environment variables.
- [x] Conduct end-to-end testing (signup -> idea input -> clarify -> generate -> edit -> export PDF).

---

## Technical Specifications Summary
- **Primary Model:** OpenAI `gpt-4o-mini`
- **Section Keys (20):** `overview`, `problem`, `goals`, `targetUsers`, `roles`, `features`, `functionalReq`, `nonFunctionalReq`, `techStack`, `altStacks`, `architecture`, `database`, `api`, `uiPages`, `security`, `scalability`, `roadmap`, `complexity`, `risks`, `future`
- **Output Modes & Filters:**
  - **Executive:** `overview`, `problem`, `goals`, `features`, `roadmap`, `complexity`, `risks`, `techStack` (summary)
  - **Technical:** `techStack`, `altStacks`, `architecture`, `database`, `api`, `uiPages`, `security`, `scalability`, `roadmap`
  - **Complete:** All 20 sections