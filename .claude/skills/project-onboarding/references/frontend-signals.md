# Front-end signals: what to detect and how

When the repo is a front-end project, capture these specifics — they're what a newcomer most needs and what generic onboarding usually misses. Detect each from dependencies + config + a sample, and record the concrete answer in the context file. Skip cleanly any that don't apply.

## Framework & rendering model
- **Framework**: Next.js / Remix / Vite+React / Nuxt / SvelteKit / Astro / Angular / plain CRA — from deps + config file present.
- **Router**: Next App Router (`app/`) vs Pages Router (`pages/`); React Router; file-based vs config. This changes almost everything downstream.
- **Rendering**: SSR / SSG / ISR / CSR / RSC. For Next App Router, note the Server vs Client Component split convention. Determines where data fetching and interactivity live.
- **Meta-version**: major framework version (Next 13 vs 15, React 18 vs 19) — APIs differ enough to matter.

## State management
- Detect: Redux/Redux Toolkit, Zustand, Jotai, Recoil, MobX, XState, or just React Context + hooks, or server-state-only via a data lib. Where stores/contexts live.
- Note server-state vs client-state split (e.g. React Query for server data, Zustand for UI state).

## Data fetching / API layer
- Library: React Query (TanStack), SWR, Apollo/urql (GraphQL), tRPC, or raw fetch/Axios.
- Client setup: base URL, auth (interceptors, token handling), error handling pattern, where query/mutation hooks live.
- Backend shape: REST / GraphQL / tRPC / RPC; where the API contract/types come from (OpenAPI, generated types, shared package).

## Styling & design system
- Approach: Tailwind / CSS Modules / styled-components / Emotion / vanilla-extract / Sass / plain CSS.
- Design tokens: `tailwind.config` theme, CSS custom properties, a tokens file/package.
- Component library: shadcn/ui (`components/ui/` + `components.json`), Radix, MUI, Chakra, Mantine, Ant, or bespoke. Where primitives live (incl. monorepo `packages/ui`).
- Theming: dark/light mechanism, theme provider.

## Forms & validation
- React Hook Form / Formik / native; validation via Zod / Yup / Valibot. Where schemas live.

## i18n & direction
- Library: next-intl / i18next / react-intl / Lingui / custom; locale set & default; catalog location.
- **RTL/direction**: is `dir`/`lang` locale-driven? Logical CSS conventions? Relevant for Farsi/Arabic projects — flag the convention so future work follows it.
- Locale-specific formatting: calendar (Jalali/Shamsi), currency, digit system.

## Auth & sessions
- Mechanism: NextAuth/Auth.js, Clerk, custom JWT, session cookies, OAuth providers. Where the auth boundary and protected routes are.

## Build, quality & testing
- Bundler/build (Webpack via Next, Vite, Turbopack), TypeScript strictness, path aliases.
- Lint/format/commit conventions actually enforced (hooks).
- Testing: Jest/Vitest (unit), Testing Library, Playwright/Cypress (e2e), Storybook (component dev). What's actually present and run.

## How to record
For each applicable area, one concrete line: the choice + where it lives + any notable convention. E.g. "Styling: Tailwind + shadcn/ui; tokens in `tailwind.config.ts` + `globals.css` CSS vars; primitives in `components/ui/`; RTL-aware via logical properties." Specific enough that a future Claude follows the house style without re-deriving it.
