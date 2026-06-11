# PROJECT_CONTEXT.md template

The file Claude generates and later reads. Keep it compact and high-signal — a map a future Claude reads in seconds, not an exhaustive index. Omit sections that don't apply rather than padding. Record a basis block so staleness can be checked cheaply.

Fill this structure (adapt headings to the project; don't force irrelevant ones):

```markdown
# Project Context — <project name>

> Auto-generated onboarding map for Claude. Human edits welcome — they're preserved on refresh.
> Basis: <package manager> · key deps: <framework@ver, react@ver, …> · generated <YYYY-MM-DD> · commit <hash if available>

## What this is
1 short paragraph: purpose, domain, who uses it. Plain language.

## Stack
- Language / framework: <e.g. TypeScript · Next.js 15 (App Router)>
- Package manager / build: <pnpm · Turbopack>
- Key libraries: <state, data, styling, forms, i18n, auth — the ones that define the app>

## Architecture & structure
- Shape: <single app | monorepo: list apps/packages and their roles>
- Rendering model: <SSR/RSC/CSR split; server vs client component convention>
- Key directories (what lives where):
  - `<dir>` — <role>
  - … (only the ones that matter)
- Path aliases: <@/* → src/*, etc.>

## Front-end specifics   (omit if not a front-end project)
- Routing: <App Router, file-based; route groups …>
- State: <Zustand for UI state in src/stores; React Query for server state>
- Data/API: <React Query + Axios client in src/lib/api.ts, auth interceptor; REST backend at …>
- Styling & design system: <Tailwind + shadcn/ui; tokens in …; primitives in components/ui>
- Forms/validation: <RHF + Zod; schemas in …>
- i18n / direction: <next-intl; locales en/fa, default fa; RTL via logical props; Jalali dates via jalali-plugin-dayjs>
- Auth: <mechanism; protected-route boundary>

## Conventions
- Naming & files: <PascalCase components, kebab files, feature folders …>
- Imports: <@/ alias, deep imports over barrels …>
- Component style: <cn() from lib/utils, cva variants …>
- Tests: <Vitest + Testing Library, Playwright e2e; where tests live>
- Lint/format: <eslint config, prettier, husky pre-commit>

## How to run
- Install: `<cmd>`   Dev: `<cmd>`   Build: `<cmd>`   Test: `<cmd>`
- Required env vars (names only): `<NAME>` — <what it's for>, …  (never values)

## Domain vocabulary
- `<Term>` — <meaning>   (entities, acronyms, project-specific jargon a newcomer wouldn't know)

## Integration points
- <Backend API / service / infra it depends on, even if out of repo>

## Gotchas & house rules   (preserve human-added notes here)
- <Non-obvious constraints, sharp edges, "don't do X" rules>

## Deeper docs
- <links/paths to real docs instead of inlining them>
```

## Writing rules
- **Map, not dump.** State inferred architecture in plain terms; don't paste code or list every file.
- **Specific beats vague.** "State via Zustand, stores in `src/stores/`" not "uses state management."
- **Mark uncertainty.** "appears to…" when evidence is thin; don't assert one example as a universal rule.
- **Compact.** If it's getting long, you're indexing instead of mapping — cut to what changes decisions.
- **Basis block is mandatory** — it's what makes the cheap staleness check possible later.
- **Secrets:** env var names + purpose only. Never values, never `.env` contents.
