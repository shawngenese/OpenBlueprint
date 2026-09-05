---
name: nextjs-app-router
description: Build scalable Next.js 15 App Router structures, Route Handlers, and Server Actions.
---

# Next.js 15 App Router Skill

When creating pages, routes, or server logic:

## Rules
- Keep route handlers inside `/app/api/[route]/route.ts`.
- Prefer Next.js **Server Actions** for form submissions and simple data mutation.
- Enforce strict separation between Server Components (default) and Client Components (`'use client'`).