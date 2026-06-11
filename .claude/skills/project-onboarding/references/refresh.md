# Refreshing a stale PROJECT_CONTEXT.md

When the file exists but may be out of date, update it surgically — refresh what changed, preserve what's still true and anything a human wrote. Don't regenerate from scratch unless it's hopelessly diverged.

## Detect staleness cheaply

Read the file's **basis block** (key dep versions, date, commit hash) and compare to reality. `scripts/staleness_check.sh <repo>` automates the cheap signals:
- Do the recorded key dependency versions still match `package.json`? (framework/React major bumps especially)
- Is the package manager / lockfile still the same?
- New or removed top-level directories or workspace packages since the map was written?
- How many commits / how much time since the recorded commit/date? (large gap = re-verify)
- Did config files (`next.config`, `tailwind.config`, `tsconfig` aliases) change materially?

A couple of diverging spot-checks = stale. If everything matches, the file is current — just read it and proceed.

## Refresh, don't rewrite

1. **Read the existing file** as the baseline — including human-added prose (gotchas, intent, rationale).
2. **Re-explore only the changed areas** — if deps changed, re-check the stack/libraries section; if new directories appeared, map them; if the framework version jumped, re-verify the rendering/router notes. Don't re-read the whole repo for a small drift.
3. **Update factual/auto-derived sections** to match current reality. Fix anything the code contradicts (the code always wins over a stale file).
4. **Preserve human content.** Gotchas, house rules, domain notes, and intent that aren't recoverable from code must survive. Never silently delete prose you can't re-derive — if it now seems wrong, flag it for the user rather than removing it.
5. **Update the basis block** — new versions, new date, new commit hash.
6. **Note what changed.** A one-line summary of what you updated so the user can sanity-check (e.g. "Updated: Next 14→15 (App Router APIs), added `packages/analytics`, state lib unchanged.").

## When to regenerate instead

If the project has changed so fundamentally that most sections are wrong (a rewrite, framework migration, major restructure), it's cleaner to regenerate — but still salvage the human-written gotchas/intent into the new file. Tell the user you regenerated rather than patched, and why.

## Conflict handling

If the file asserts X and the code shows Y: trust the code, fix the file, and if X looks like a deliberate human note rather than stale auto-content, mention the discrepancy to the user instead of overwriting blindly — they may know something you don't (e.g. an in-progress migration).
