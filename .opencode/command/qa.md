---
description: Perform quality control, check for bugs, missing types, and runtime errors
agent: build
---
1. Patakbuhin ang `npx tsc --noEmit` para masigurong walang TypeScript type errors.
2. Patakbuhin ang `npm run lint` para ma-check ang code formatting at anti-patterns.
3. Suriin ang mga huling nabagong files para sa mga posibleng memory leaks, unhandled promises, o kulang na error boundaries.
4. Magbigay ng summary ng nahanap na issue at ayusin ang mga ito.