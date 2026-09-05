---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces using Next.js 15, Tailwind CSS, and shadcn/ui.
---

# Frontend Design Skill

When generating UI components or pages, follow these strict visual guidelines:

## Aesthetic Rules
1. **Typography:** Avoid defaulting to generic system fonts like Inter/Arial without intent. Pair clean display headers with high-legibility body fonts.
2. **Color & Contrast:** Use sharp accents on neutral bases rather than washed-out primary colors. Define colors using Tailwind standard variables or CSS custom properties.
3. **Component Styling:**
   - Use `shadcn/ui` primitive components as building blocks.
   - Avoid using emoji's.
   - Add subtle micro-interactions (hover states, subtle active transitions).
   - Maintain generous spatial padding (`p-6`, `gap-4`) and clear visual hierarchy.
4. **Layout Structure:**
   - Build fully responsive layouts (`sm:`, `md:`, `lg:` breakpoints).
   - Ensure dynamic UI states exist for **Loading**, **Empty**, and **Error** conditions.

## Next.js 15 & React Constraints
- Mark interactive components with `'use client';` at the top of the file.
- Keep components small and focused (< 150 lines per component file).
- Use Lucide React icons for consistent icon design.