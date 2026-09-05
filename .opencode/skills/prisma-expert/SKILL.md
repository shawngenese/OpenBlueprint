---
name: prisma-expert
description: Manage Prisma schema updates, PostgreSQL migrations, and type-safe database queries.
---

# Prisma & Database Skill

When managing the database layer, follow these strict rules:

## Schema Rules
- Use PostgreSQL-compatible column types (`@db.Text`, `@db.JsonB`, `DateTime`).
- Always map model names cleanly and ensure required relations have explicit cascade behavior (`onDelete: Cascade`).
- Maintain enum definitions for bounded values (e.g., project statuses: `draft | questioning | generated`).

## Queries & Migrations
- Write database updates using type-safe Prisma client actions.
- Run `npx prisma validate` after changing `schema.prisma`.
- Recommend running `npx prisma migrate dev` whenever the schema changes.