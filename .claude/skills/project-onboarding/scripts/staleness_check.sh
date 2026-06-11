#!/usr/bin/env bash
# staleness_check.sh — cheap signals for whether PROJECT_CONTEXT.md is out of date.
# Compares the file's recorded basis (versions/commit/date) against the repo now.
# Read-only. Prints signals + a verdict hint; the model decides refresh vs read.
#
# Usage: bash staleness_check.sh [repo_dir]   (defaults to current dir)

set -uo pipefail
DIR="${1:-.}"
cd "$DIR" || { echo "Cannot cd to $DIR"; exit 1; }

CTX="PROJECT_CONTEXT.md"
if [ ! -f "$CTX" ]; then
  echo "No $CTX found -> GENERATE (no cache exists)."
  exit 0
fi

echo "Found $CTX"
echo "================================================="

STALE=0

# 1. Recorded commit vs current
REC_COMMIT=$(grep -oE 'commit [0-9a-f]{7,40}' "$CTX" | head -1 | awk '{print $2}')
CUR_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "")
if [ -n "$REC_COMMIT" ] && [ -n "$CUR_COMMIT" ]; then
  echo "commit: recorded=$REC_COMMIT  current=$CUR_COMMIT"
  if [ "${REC_COMMIT:0:7}" != "${CUR_COMMIT:0:7}" ]; then
    N=$(git rev-list --count "${REC_COMMIT}..HEAD" 2>/dev/null || echo "?")
    echo "  -> $N commits since the map was written"
    [ "$N" != "?" ] && [ "$N" -gt 30 ] 2>/dev/null && { echo "  -> large gap (>30 commits): likely stale"; STALE=1; }
  else
    echo "  -> same commit"
  fi
else
  echo "commit: (no recorded commit hash in basis block, or not a git repo)"
fi

# 2. Recorded date age
REC_DATE=$(grep -oE 'generated [0-9]{4}-[0-9]{2}-[0-9]{2}' "$CTX" | head -1 | awk '{print $2}')
if [ -n "$REC_DATE" ]; then
  NOW=$(date +%s); THEN=$(date -d "$REC_DATE" +%s 2>/dev/null || echo "$NOW")
  DAYS=$(( (NOW - THEN) / 86400 ))
  echo "generated: $REC_DATE  (~$DAYS days ago)"
  [ "$DAYS" -gt 90 ] && { echo "  -> >90 days old: re-verify"; STALE=1; }
fi

# 3. Key dependency versions: recorded vs package.json
echo
echo "Dependency spot-check (recorded basis vs package.json):"
if [ -f package.json ]; then
  # pull "name@version" tokens from the basis line(s)
  grep -oE '[a-z@][a-zA-Z0-9/_.-]+@[0-9]+(\.[0-9]+)*' "$CTX" | head -12 | while read -r tok; do
    name="${tok%@*}"; recv="${tok##*@}"
    # current version from package.json (strip ^ ~ etc.)
    curv=$(grep -oE "\"$name\"[[:space:]]*:[[:space:]]*\"[^\"]+\"" package.json 2>/dev/null \
           | head -1 | grep -oE '[0-9][^"]*' | head -1)
    if [ -n "$curv" ]; then
      rec_major="${recv%%.*}"; cur_major="$(echo "$curv" | grep -oE '^[0-9]+')"
      flag=""
      [ -n "$cur_major" ] && [ "$rec_major" != "$cur_major" ] && { flag="  <-- MAJOR CHANGED"; STALE=1; }
      echo "  $name: recorded $recv | package.json $curv$flag"
    else
      echo "  $name: recorded $recv | not found in package.json now$([ -n "$name" ] && echo '  <-- removed?')"
    fi
  done
else
  echo "  no root package.json (monorepo? check apps/*/package.json manually)"
fi

# 4. New top-level directories not mentioned in the file (advisory signal)
echo
echo "New top-level dirs not referenced in $CTX (advisory — a map need not list every dir):"
NEW=0
for d in */ ; do
  d="${d%/}"
  case "$d" in node_modules|.git|.next|dist|build|coverage|.turbo) continue;; esac
  grep -q "$d" "$CTX" || { echo "  - $d (not mentioned)"; NEW=$((NEW+1)); }
done
[ "$NEW" = 0 ] && echo "  (none)"
# Only treat as a staleness signal if SEVERAL new dirs appeared (structural change),
# not a single unmentioned folder like messages/ or public/.
[ "$NEW" -ge 3 ] 2>/dev/null && { echo "  -> $NEW unmentioned top-level dirs: possible structural change"; STALE=1; }

echo
echo "================================================="
if [ "$STALE" = 1 ]; then
  echo "VERDICT HINT: signals suggest STALE -> read the file, then REFRESH changed sections."
else
  echo "VERDICT HINT: no strong staleness signals -> file likely CURRENT, read and proceed."
fi
echo "(Heuristic only — confirm against the actual code; the code always wins.)"
