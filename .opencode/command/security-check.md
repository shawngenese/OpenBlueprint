---
description: Audit project for security vulnerabilities, exposed secrets, and bad permissions
agent: build
---
1. Suriin ang codebase para sa mga hardcoded API keys o passwords.
2. Siguraduhing ang `.env` at `.env.local` ay nasa `.gitignore`.
3. Check ang Server Actions at API Routes para masigurong may authentication guard (Auth.js) at Zod input validation.
4. I-check ang dependencies gamit ang `npm audit`.