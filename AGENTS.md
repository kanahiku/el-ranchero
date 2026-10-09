# Agent instructions

Follow **[ONBOARDING.md](./ONBOARDING.md)**. Figma order: design system (`src/brand.ts`) → atoms (`Button`, `Headline`, …) → shared sections (`FAQs`, `Hero2`, …) → pages.

```
npm run dev      # localhost:4321
npm run build    # production
npm run check    # astro + eslint + prettier
```

Tokens: `src/brand.ts`. Copy desktop and mobile type from Figma; derive mobile only if the file has none. Identity: `src/config/site.ts` + `contact.ts`. Widgets: `src/registry/components.json`.
