# Exploration: building the picture from scratch

Goal: understand an unfamiliar repo efficiently — breadth first, highest-signal sources first, then targeted depth. Don't read everything; read the things that explain the most per byte, then sample.

Run `scripts/explore.sh <repo>` first — it gathers the cheap high-signal facts in one pass (manifests, dependency lists, directory tree, config files, scripts, env var names, monorepo layout). Then go deeper where it matters.

## Order of operations (high signal → low)

**1. Manifests & metadata (read first — most signal).**
- `package.json`: name, scripts (`dev`/`build`/`test`/`lint` reveal the toolchain), dependencies + devDependencies (the stack, in one place), `packageManager`, `engines`, `workspaces` (monorepo).
- Lockfile presence tells the package manager (`pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `package-lock.json` → npm, `bun.lockb` → bun).
- `README.md` / `CONTRIBUTING.md` / `docs/`: the team's own words on purpose, setup, conventions. Often the fastest route to "what is this."
- Monorepo configs: `turbo.json`, `nx.json`, `pnpm-workspace.yaml`, `lerna.json` → multiple packages; map them.

**2. Config files (reveal the architecture without reading source).**
- Framework config: `next.config.*`, `vite.config.*`, `nuxt.config.*`, `astro.config.*`, `remix.config.*`, `angular.json` — identifies framework + key options (output mode, aliases, plugins).
- Language/build: `tsconfig.json` (path aliases like `@/*`, strictness, target), `.babelrc`, `bunfig`.
- Styling: `tailwind.config.*` (design tokens, plugins), `postcss.config.*`, presence of CSS-in-JS deps.
- Quality: `.eslintrc*`/`eslint.config.*`, `.prettierrc*`, `.editorconfig`, `commitlint`, Husky hooks — the enforced conventions.
- Env: `.env.example`/`.env.sample` (names only — never values), and where env is read.
- CI/CD: `.github/workflows/*`, `Dockerfile`, `docker-compose.*`, k8s manifests — how it builds/deploys and what infra it assumes.

**3. Structure (the shape).**
- Top-level directory tree (2–3 levels, skip `node_modules`/build dirs). Name the major areas and infer their roles (`app/` or `pages/` → routes; `components/`; `lib`/`utils`; `hooks`; `stores`/`state`; `services`/`api`; `types`; `styles`; `public`; `tests`/`__tests__`).
- For a monorepo: list packages/apps and what each is, plus shared packages (`packages/ui`, `packages/config`).
- Routing model: file-based (Next app/pages, Remix, Nuxt) vs config-based (React Router) — determines how navigation/pages work.

**4. Representative samples (depth, but bounded).**
Read a *few* real files to learn conventions, not to catalog everything:
- 1–2 route/page files → data fetching, layout, server/client boundary.
- 2–3 components → composition style, props typing, styling approach, `cn()`/variant patterns.
- A state store / context → state management in practice.
- An API/service module → how the backend is called, client setup, auth headers.
- A test file → testing framework and style.
- The root layout/entry → providers, global setup, where `dir`/`lang`/theme are set.

## Inferring vs reading

You're building a *map*, so infer the system from these signals rather than reading line-by-line. Three buttons styled the same way = a convention; one example = a hypothesis (mark it "appears to"). State the architecture in plain terms with enough specificity to be useful ("data fetching via React Query, query hooks in `src/queries/`, Axios client in `src/lib/api.ts` with auth interceptor").

## Bounding the effort

Large repo? Sample representatively and say so. Don't open hundreds of files. Cover every *category* above with at least a spot-check; go deep only where the picture is unclear or a known upcoming task needs it. The output is a concise context file, not an exhaustive index.
