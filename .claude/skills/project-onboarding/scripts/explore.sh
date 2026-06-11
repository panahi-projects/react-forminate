#!/usr/bin/env bash
# explore.sh — gather high-signal facts about an unfamiliar repo in one pass, to
# seed PROJECT_CONTEXT.md. Read-only; prints a structured summary. Does NOT read
# .env values or secrets (only env var NAMES from example files).
#
# Usage: bash explore.sh [repo_dir]   (defaults to current dir)

set -uo pipefail
DIR="${1:-.}"
cd "$DIR" || { echo "Cannot cd to $DIR"; exit 1; }

sec() { echo; echo "================================================="; echo "$1"; echo "================================================="; }
have() { command -v "$1" >/dev/null 2>&1; }

sec "PROJECT ROOT"
pwd
echo "git: $(git rev-parse --short HEAD 2>/dev/null || echo 'not a git repo')  branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '-')"
echo "last commit: $(git log -1 --format='%ci' 2>/dev/null || echo '-')"

sec "PACKAGE MANAGER (from lockfile)"
for lf in pnpm-lock.yaml yarn.lock package-lock.json bun.lockb; do
  [ -f "$lf" ] && echo "  $lf  -> $(case $lf in pnpm*) echo pnpm;; yarn*) echo yarn;; package-lock*) echo npm;; bun*) echo bun;; esac)"
done

sec "package.json — name, scripts, deps"
if [ -f package.json ]; then
  if have node; then
    node -e '
      const p=require("./package.json");
      console.log("name:", p.name||"-", " version:", p.version||"-");
      console.log("packageManager:", p.packageManager||"-");
      if(p.workspaces) console.log("workspaces:", JSON.stringify(p.workspaces));
      console.log("\nscripts:");
      for(const[k,v]of Object.entries(p.scripts||{})) console.log("  "+k+": "+v);
      const deps=Object.keys(p.dependencies||{}); const dev=Object.keys(p.devDependencies||{});
      console.log("\ndependencies ("+deps.length+"): "+deps.join(", "));
      console.log("\ndevDependencies ("+dev.length+"): "+dev.join(", "));
    ' 2>/dev/null || cat package.json
  else
    echo "(node not available — raw scripts/deps)"
    grep -nE '"(scripts|dependencies|devDependencies)"' package.json
  fi
else
  echo "  no package.json at root — check subdirs (monorepo apps/*)?"
fi

sec "MONOREPO / WORKSPACES"
for f in pnpm-workspace.yaml turbo.json nx.json lerna.json; do [ -f "$f" ] && echo "  found: $f"; done
for d in packages apps; do
  [ -d "$d" ] && { echo "  $d/:"; ls -1 "$d" 2>/dev/null | sed 's/^/    - /'; }
done

sec "FRAMEWORK / BUILD CONFIG (presence = signal)"
for f in next.config.* vite.config.* nuxt.config.* astro.config.* remix.config.* svelte.config.* angular.json tsconfig.json; do
  [ -f "$f" ] 2>/dev/null && echo "  $f"
done | sort -u

sec "STYLING / DESIGN SYSTEM"
for f in tailwind.config.* postcss.config.* components.json; do [ -f "$f" ] 2>/dev/null && echo "  $f"; done
[ -f components.json ] && { echo "  -- components.json:"; cat components.json 2>/dev/null | head -20 | sed 's/^/     /'; }

sec "QUALITY / CONVENTIONS"
for f in .eslintrc .eslintrc.js .eslintrc.cjs .eslintrc.json eslint.config.js eslint.config.mjs .prettierrc .prettierrc.json .editorconfig commitlint.config.js; do
  [ -f "$f" ] && echo "  $f"
done
[ -d .husky ] && { echo "  .husky/ hooks:"; ls -1 .husky 2>/dev/null | grep -v '_' | sed 's/^/    - /'; }

sec "CI / DEPLOY / INFRA"
[ -d .github/workflows ] && { echo "  .github/workflows:"; ls -1 .github/workflows 2>/dev/null | sed 's/^/    - /'; }
for f in Dockerfile docker-compose.yml docker-compose.yaml; do [ -f "$f" ] && echo "  $f"; done
ls k8s/ kubernetes/ manifests/ 2>/dev/null | head -1 >/dev/null && echo "  k8s manifests directory present"

sec "ENV VAR NAMES (from example files only — never values)"
for f in .env.example .env.sample .env.template; do
  [ -f "$f" ] && { echo "  $f:"; grep -oE '^[A-Z0-9_]+' "$f" 2>/dev/null | sed 's/^/    - /'; }
done
echo "  (NOTE: real .env files are intentionally NOT read.)"

sec "TOP-LEVEL STRUCTURE (2 levels, excluding noise)"
if have tree; then
  tree -L 2 -I 'node_modules|.next|dist|build|.git|coverage|.turbo' 2>/dev/null | head -80
else
  find . -maxdepth 2 \( -name node_modules -o -name .next -o -name dist -o -name build -o -name .git -o -name coverage \) -prune -o -type d -print 2>/dev/null | grep -v '^\.$' | head -60
fi

sec "SRC LAYOUT (common front-end dirs, if present)"
BASE="."; [ -d src ] && BASE="src"
for d in app pages components hooks stores store state lib utils services api queries types styles public locales messages i18n features context providers; do
  [ -d "$BASE/$d" ] && echo "  $BASE/$d/  ($(find "$BASE/$d" -type f 2>/dev/null | wc -l | tr -d ' ') files)"
done

sec "ROUTING MODEL HINT"
[ -d app ] || [ -d src/app ] && echo "  Next.js App Router (app/) likely"
[ -d pages ] || [ -d src/pages ] && echo "  Pages Router (pages/) likely"
grep -rl "createBrowserRouter\|react-router" src 2>/dev/null | head -1 >/dev/null && echo "  react-router present"

sec "DETECTED KEY LIBRARIES (grep package.json)"
if [ -f package.json ]; then
  for lib in next react vue svelte @angular/core \
             redux @reduxjs/toolkit zustand jotai recoil mobx xstate \
             @tanstack/react-query swr @apollo/client urql @trpc/client \
             axios tailwindcss styled-components @emotion/react @stitches \
             react-hook-form formik zod yup valibot \
             next-intl i18next react-intl @lingui/core \
             next-auth @clerk/nextjs \
             vitest jest @testing-library/react @playwright/test cypress storybook; do
    grep -q "\"$lib\"" package.json && echo "  ✓ $lib"
  done
fi

echo
echo "Done. Use these facts to write PROJECT_CONTEXT.md (see context-file-template.md)."
echo "Infer architecture/conventions; sample a few real files for depth; mark uncertain items."
