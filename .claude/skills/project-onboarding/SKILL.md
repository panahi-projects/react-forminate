---
name: project-onboarding
description: Rapidly orient an unfamiliar Claude to a codebase at the start of a chat, so it understands the project's architecture, stack, conventions, and structure before doing any task — instead of guessing or asking the user to re-explain. Generates a committed context file (PROJECT_CONTEXT.md) once, reads it on later chats for instant context, and re-explores to refresh it when stale. Front-end aware (framework, routing, state, styling, design system, i18n, API layer) but works on any repo. Use this skill at the start of a new conversation about a codebase Claude hasn't seen, or when the user says things like "get familiar with this project", "understand my repo", "onboard to this codebase", "what is this project", "catch up on my project", "try to understand the project", "I'm starting fresh — learn the project first", or asks a project-specific question that requires architectural context Claude doesn't yet have.
---

# Project Onboarding

Get an unfamiliar Claude up to speed on a codebase fast and accurately, so it can act like someone who already works on the project rather than a stranger asking the user to re-explain everything each session.

The mechanism is a committed **`PROJECT_CONTEXT.md`** at the repo root: a compact, high-signal map of the project. Generate it once by exploring the repo; on later chats, read it for instant context; refresh it by re-exploring when it's stale or the user asks. The file is the cache; exploration is how it's built and kept current.

## Decision: read, refresh, or generate

At the start of working with a repo, decide which path you're on:

1. **`PROJECT_CONTEXT.md` exists and looks current** → read it, and you're oriented. Do a quick staleness check (below). Don't re-explore the whole repo unnecessarily — that's the point of the cache.
2. **It exists but looks stale** → read it for the baseline, then re-explore the parts likely to have changed and update the file. See `references/refresh.md`.
3. **It doesn't exist** → explore the repo and generate it. See `references/exploration.md` then `references/context-file-template.md`.

**Staleness check (cheap):** compare the file's record of its own basis against reality — does the dependency list still match `package.json`? Did the framework/major versions change? Are there new top-level directories? Has it been a long time / many commits since it was written (if a timestamp or commit hash is recorded in the file)? If a couple of spot-checks diverge, treat as stale and refresh the affected sections rather than regenerating blindly. `scripts/staleness_check.sh` automates the cheap signals.

Always prefer the file when it's good: the whole value is _not_ re-reading the entire codebase every chat. But never trust a clearly-wrong file over the actual code — if the file says Redux and the repo uses Zustand, the code wins and the file gets fixed.

## What "understanding the project" means

The goal is enough context to make correct decisions without asking the user basics they've effectively already documented in their code. A good onboarding captures:

- **What the project is** — purpose, domain, who uses it (one short paragraph).
- **Stack & versions** — language, framework, major libraries, package manager, build tooling.
- **Architecture & structure** — top-level layout, where things live, module/package boundaries (monorepo?), the request/render model (SSR/CSR/RSC, client/server split).
- **Front-end specifics** (when applicable) — framework & router, state management, styling system & design tokens, component library, data-fetching layer, forms, i18n/RTL, auth.
- **Conventions** — naming, file organization, import style, how components/features are structured, testing approach, lint/format rules.
- **How to run it** — install, dev, build, test, env vars needed (names, not secrets).
- **Domain vocabulary** — project-specific terms, entities, and acronyms a newcomer wouldn't know.
- **Integration points** — backend APIs, third-party services, infra it depends on (note even if out of repo).
- **Gotchas** — non-obvious constraints, known sharp edges, "don't do X" rules the team follows.

`references/context-file-template.md` is the concrete structure to fill.

## Workflow

### Generating (no file yet)

1. **Explore systematically**, breadth before depth — manifests and config first (they're the highest signal per byte), then structure, then representative samples. `scripts/explore.sh` gathers the cheap high-signal facts (manifests, dep lists, dir tree, configs, scripts, env var names) in one pass. Follow `references/exploration.md` for what to read and in what order, and `references/frontend-signals.md` for detecting front-end specifics.
2. **Synthesize, don't dump.** The file is a _map_, not a file listing. Infer the architecture and conventions from what you read; state them plainly. Prefer "state via Zustand, stores in `src/stores/`" over pasting code.
3. **Write `PROJECT_CONTEXT.md`** using the template. Record the basis for staleness checks (key dep versions, a date, and the commit hash if available). Keep it compact — aim for something a future Claude reads in seconds, not a novel. Link out to deeper docs rather than inlining them.
4. **Verify before claiming.** Mark anything inferred-but-uncertain as such. Don't assert a convention you saw once as if it's universal; say "appears to..." when evidence is thin.

### Reading (file exists, current)

Read it, internalize the map, do a cheap staleness spot-check, then proceed with the user's actual task already oriented. Don't announce a big "onboarding" ceremony — just be context-aware. If a specific area is relevant to the task and the file is thin there, read those actual files to go deeper.

### Refreshing (file exists, stale)

Read the file, run the staleness check, re-explore the changed areas, and update only those sections — preserving still-accurate content and any human-added notes. See `references/refresh.md`. Note what changed so the user can sanity-check.

## Honesty & safety notes

- **Don't invent.** If you can't determine something (why a choice was made, an undocumented intent), say so and, if it matters, ask — don't fabricate rationale. Inferred architecture is a hypothesis from the code, not ground truth.
- **Respect human edits.** `PROJECT_CONTEXT.md` may contain notes a person wrote (gotchas, intent) that aren't recoverable from code. On refresh, update factual/auto-derived sections but preserve human prose; never silently delete it.
- **Secrets:** record env var _names_ and what they're for, never their values; never read or transcribe `.env` contents, keys, or tokens into the file.
- **Big repos:** don't try to read everything. Sample representatively (a few real components/routes/modules), state that the picture is sampled, and go deeper only where a task needs it.
- **Generic but adaptive:** this works on any repo, but weight the front-end sections when it's a front-end project and skip cleanly when a section doesn't apply (e.g. no i18n). Don't force irrelevant headings.
- This pairs with the project's other skills (perf, i18n, design-system, design-to-code): a good `PROJECT_CONTEXT.md` gives those audits their baseline. Mention that context exists; don't duplicate their work here.
