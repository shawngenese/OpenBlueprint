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
- [x] Implement Call 1 (Clarifier Prompt + Zod schema validation for max 5 questions; counts toward 2/day rate limit).
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
- [x] Add user-level rate limiting (max 2 generations/clarifications per user per day).
- [x] Configure Vercel deployment and production environment variables.
- [x] Conduct end-to-end testing (signup -> idea input -> clarify -> generate -> edit -> export PDF).

### Phase 6: Landing Foundation & Design System (Week 6)
- [x] Replace `Geist` with `Inter` (300/400/500/600/700) and map verified Flat Design tokens to `globals.css` (`#0D9488` primary, `#EA580C` CTA, `#F0FDFA` bg, `#134E4A` fg, `#E8F1F4` muted, `#99F6E4` border, `#475569` muted-fg).
- [x] Update `src/app/layout.tsx` metadata (title/desc/OG/json-ld) and replace `src/app/page.tsx` boilerplate with server-composed shell (`max-w-6xl` 12-col grid, `Suspense` for `auth()` streaming per Next.js guideline).
- [x] Build sticky `Nav` (`components/landing/nav.tsx`) — auth-aware CTA (`auth()` `lib/auth.ts` → `Dashboard`/`New Project` vs `Sign in`/`Start blueprint`), `scroll-padding-top` for fixed nav, `focus-visible:ring-2` on every control, `≥44×44px` targets with `gap-2` spacing.
- [x] Establish responsive baseline (`375/768/1024/1440`), semantic `header/main/section/footer`, no horizontal scroll, and dark-mode token parity.

### Phase 7: Hero & Interactive Product Demo (Week 6)
- [x] Build `Hero` (`components/landing/hero.tsx`) — headline/lede/dual CTA + `2 generations/day` helper, left 6-col editorial on 12-col grid, `Inter 600 32pt -0.5` H1, `16px/1.5 <80ch` body, single indigo/teal accent moment.
- [x] Implement `hero-sheet.tsx` client island — centered sheet preview with `Executive`/`Technical`/`Complete` tabs filtering `BLUEPRINT_ORDER`/`BLUEPRINT_META` (`lib/ai/schemas/blueprint.ts:31-76`) per `plan.md:41-44` locally (no LLM), keyboard `aria-selected`, `prefers-reduced-motion` fallback to static state, pause when offscreen.
- [x] Build `HowItWorks` (`components/landing/how-it-works.tsx`) — 3-col hairline sequence `raw idea → ≤5 clarifier questions (Zod max 5)` → `generate 20 validated sections` with `Section` records (`schema.prisma:131-144`) note and `1s` debounce.
- [x] Build `SectionsShowcase` (`components/landing/sections-showcase.tsx`) — `4×5` mono grid (`+1.2` tracking label) of 20 keys with live filter demo mirroring `components/blueprint/mode-tabs.tsx` behavior.

### Phase 8: Content, Trust & Polish (Week 7)
- [x] Build `FeatureBreakdown` + `Comparison` + `StackStrip` (`components/landing/*`) — 6 Flat cards (Lucide SVG only, no emoji, `150-200ms` hover), Section-records vs chat-blob comparison table, stack row (`Prisma`/`pg`/`Auth.js`/`gpt-4o-mini`/`Zod`/`@react-pdf/renderer`/`shadcn/ui`).
- [x] Build `FinalCTA` + `Footer` (`components/landing/final-cta.tsx`, `footer.tsx`) — CTA band (`Video center + CTA right/bottom` pattern), auth-aware copy (`10-char` `createProjectSchema` hint), links to `/login`/`/register`/`/dashboard`.
- [x] Accessibility & performance pass — contrast `4.5:1`, `alt`/`aria-label`, focus not obscured, `prefers-reduced-motion` on hero stagger (`gsap` Subtle `300-400ms power1.out y:12` only if JS, otherwise CSS), WebP/lazy/`aspect-video` reserve (`CLS <0.1`), `cursor-pointer` + `transition 150-300ms`, `WebP/AVIF` where applicable.
- [x] SEO & verification — `sitemap.ts`/`robots.ts` + `viewport` meta if missing, `npm run typecheck && lint && build` + manual `auth` branches (logged-in/out), keyboard-only and `light/dark` audit at `375/768/1024/1440`.

---

## Technical Specifications Summary
- **Primary Model:** OpenAI `gemini-3.6-flash`
- **Section Keys (20):** `overview`, `problem`, `goals`, `targetUsers`, `roles`, `features`, `functionalReq`, `nonFunctionalReq`, `techStack`, `altStacks`, `architecture`, `database`, `api`, `uiPages`, `security`, `scalability`, `roadmap`, `complexity`, `risks`, `future`
- **Output Modes & Filters:**
  - **Executive:** `overview`, `problem`, `goals`, `features`, `roadmap`, `complexity`, `risks`, `techStack` (summary)
  - **Technical:** `techStack`, `altStacks`, `architecture`, `database`, `api`, `uiPages`, `security`, `scalability`, `roadmap`
  - **Complete:** All 20 sections