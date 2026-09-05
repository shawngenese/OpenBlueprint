# E2E Checklist — AI Project Consultant MVP

Manual flow: signup -> idea input -> clarify -> generate -> edit -> export PDF
Requires: `.env` with valid `DATABASE_URL` (Supabase/Neon) + `OPENAI_API_KEY` + `AUTH_SECRET`, `npx prisma migrate dev` applied.

## Pre-flight
- [ ] `npm install`
- [ ] `cp .env.example .env` and fill `DATABASE_URL`, `OPENAI_API_KEY`, `AUTH_SECRET` (`npx auth secret`)
- [ ] `npx prisma migrate dev --name init` (or `npx prisma db push` for quick)
- [ ] `npx prisma validate` → valid
- [ ] `npm run build` → ✓ Compiled successfully (14 routes)

## 1. Signup / Login
- [ ] `npm run dev` → http://localhost:3000
- [ ] Visit `/register` → create `e2e@test.com` / `password123` / `E2E User` → expect redirect to `/login?registered=1`
- [ ] `/login` → sign in with credentials → expect redirect to `/dashboard`
- [ ] Unauthenticated visit `/dashboard` → expect redirect to `/login?callbackUrl=/dashboard` (middleware.ts)
- [ ] Authenticated visit `/login` → expect redirect to `/dashboard` (middleware auth page guard)

## 2. Idea Input
- [ ] `/dashboard` → EmptyState visible when 0 projects → click `New Project` → `/project/new`
- [ ] `/project/new` → validation: empty title/rawIdea shows Zod errors (2-100, 10-5000)
- [ ] Fill `title: "Freelance Invoice Tracker"` + `rawIdea: "App for freelance designers..."` (150 chars) → Create → expect redirect to `/project/[id]` (status `draft`)
- [ ] `/dashboard` now shows 1 card with `draft` badge, title, rawIdea excerpt, `Continue` link

## 3. Clarify (Call 1)
- [ ] `POST /api/projects/[id]/clarify` → expect `200 { questions: 1-5 }`, each 10-300 chars, `prisma.project.status` → `questioning`
- [ ] If `OPENAI_API_KEY=""` → expect `500 {error: "OPENAI_API_KEY not configured"}` (retry via `withRetry` 3 attempts)
- [ ] Answer Q&A payload for next step: `[{question, answer}]` max 5

## 4. Generate (Call 2)
- [ ] `POST /api/projects/[id]/generate` with `{ clarifierQA: [...] }` → expect `200 { blueprint, sections: 20 }`, `status` → `generated`, `GenerationLog` count +1
- [ ] Verify `prisma.blueprint` + `prisma.section` 20 records with correct `key`, `title` from `BLUEPRINT_META`, `order 0-19`, `@@unique([blueprintId,key])`
- [ ] Trigger 6th generate in same day → expect `429 {error: "Rate limit exceeded..."} ` + headers `X-RateLimit-Limit:5`, `X-RateLimit-Remaining:0`, `Retry-After`
- [ ] Check Zod: `blueprintSchema` 20 keys validated; missing key → `500`

## 5. Edit & Regenerate
- [ ] `/project/[id]/blueprint` → 3 tabs `Executive (8) / Technical (9) / Complete (20)` filtering locally (no network on tab switch → verify via DevTools Network: 0 calls)
- [ ] Toggle `Executive` → 8 sections (`overview,problem,goals,features,roadmap,complexity,risks,techStack`), `Technical` → 9 sections — confirm `OUTPUT_MODES` per `Technical Specifications Summary`
- [ ] `GET /api/projects/[id]/blueprint?mode=executive` → expect 8 filtered server-side, same no-LLM guarantee
- [ ] Expand first section → click `Edit` → modify markdown → wait 1s → expect `PATCH /api/sections/[id]` → `Saved` badge (1s debounce)
- [ ] Click `Regen` → expect `POST /api/sections/[id]/regenerate` → only targeted `key` updated (check other sections unchanged), `GenerationLog` +1, `429` after 5

## 6. Export PDF
- [ ] `GET /api/projects/[id]/pdf?mode=complete` → expect `200 Content-Type: application/pdf`, `Content-Disposition: inline; filename="..."`, `Buffer` length >0
- [ ] `?mode=executive` → PDF with 8 sections, `?mode=technical` → 9 sections (same filtering as tabs)
- [ ] Unauthenticated `GET /api/projects/[id]/pdf` → `401`
- [ ] Missing blueprint → `404 {error: "Blueprint not found"}`

## 7. Polish & Error Handling
- [ ] `src/app/dashboard/loading.tsx` skeleton visible on slow 3G; `error.tsx` `AlertTriangle` + `Try again` works via `reset()`
- [ ] `src/lib/ai/withRetry.ts` → simulate 500 once → expect 3 attempts with backoff (check logs)
- [ ] Rate limit: after 5, wait until next day reset (midnight UTC) → `X-RateLimit-Reset` header

## Sign-off
- [ ] All `npm run build` routes present: `ƒ /dashboard`, `ƒ /project/new`, `ƒ /project/[id]`, `ƒ /project/[id]/blueprint`, `ƒ /api/projects/[id]/clarify`, `ƒ /api/projects/[id]/generate`, `ƒ /api/projects/[id]/blueprint`, `ƒ /api/projects/[id]/pdf`, `ƒ /api/sections/[id]`, `ƒ /api/sections/[id]/regenerate`, `ƒ /login`, `ƒ /register`
- [ ] `npx tsc --noEmit --skipLibCheck` → TSC OK
