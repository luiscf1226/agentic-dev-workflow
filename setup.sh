#!/usr/bin/env bash
# Agentic Dev Workflow — dev setup.
#
# Wires THIS repo up for Claude Code, Cursor, and Codex so an agent working on the
# library can load its own skills. Symlinks each harness's skills/ at the real
# skills/ folder — one source of truth, no copies to drift.
#
# Falls back to copying where symlinks aren't available (Windows without developer
# mode). Copies are NOT live: re-run this script after editing skills/.
#
# To install the library into a DIFFERENT project, use ./install.sh instead.
set -euo pipefail

cd "$(dirname "$0")"
ROOT="$(pwd)"

# harness dir : entry file the harness reads for project instructions
HARNESSES=(
  ".claude:CLAUDE.md"
  ".cursor:.cursor/rules/agentic-dev-workflow.mdc"
  ".codex:AGENTS.md"
)

# SETUP_MODE=copy forces the no-symlink path (also used to test it).
MODE="${SETUP_MODE:-symlink}"
copies_made=0

link_skills() {
  local dir="$1"
  mkdir -p "$dir"

  # Already a correct symlink? Nothing to do.
  if [ -L "$dir/skills" ]; then
    rm -f "$dir/skills"
  elif [ -d "$dir/skills" ]; then
    rm -rf "$dir/skills"
  fi

  if [ "$MODE" = "symlink" ] && ln -sfn ../skills "$dir/skills" 2>/dev/null \
     && [ -f "$dir/skills/orient/SKILL.md" ]; then
    echo "  ✓ $dir/skills -> ../skills (symlink)"
  else
    rm -rf "$dir/skills"
    mkdir -p "$dir/skills"
    cp -R skills/. "$dir/skills/"
    copies_made=1
    echo "  ✓ $dir/skills (copy — re-run setup.sh after editing skills/)"
  fi
}

echo "Agentic Dev Workflow — dev setup"
echo "repo: $ROOT"
echo

# Detect symlink support up front so the message is accurate.
if [ "$MODE" = "copy" ]; then
  echo "note: SETUP_MODE=copy — using copies instead of symlinks"
  echo
elif ! ln -sfn skills .__symlink_probe 2>/dev/null; then
  MODE="copy"
  echo "note: symlinks unavailable — falling back to copies"
  echo
fi
rm -f .__symlink_probe

echo "Wiring harnesses:"
for entry in "${HARNESSES[@]}"; do
  link_skills "${entry%%:*}"
done

echo
echo "Entry files (project instructions each harness reads):"
for entry in "${HARNESSES[@]}"; do
  file="${entry#*:}"
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file  MISSING — that harness has no project instructions"
  fi
done

echo
echo "Verifying skills:"
missing=0
for f in skills/*/SKILL.md; do
  d="$(basename "$(dirname "$f")")"
  n="$(sed -n '2s/^name: //p' "$f")"
  [ "$n" = "$d" ] || { echo "  ✗ frontmatter name '$n' != dir '$d'"; missing=1; }
done
while read -r t; do
  [ -f "$t" ] || { echo "  ✗ referenced template missing: $t"; missing=1; }
done < <(grep -rho "templates/[a-z0-9._-]*\.[a-z]*" skills/ ./*.md | sort -u)
[ "$missing" -eq 0 ] && echo "  ✓ $(ls -1 skills | wc -l | tr -d ' ') skills, all frontmatter and template refs valid"

echo
echo "Done. Claude Code: CLAUDE.md + .claude/skills"
echo "      Cursor:      .cursor/rules/*.mdc + .cursor/skills"
echo "      Codex:       AGENTS.md + .codex/skills"
[ "$copies_made" -eq 1 ] && echo
[ "$copies_made" -eq 1 ] && echo "REMINDER: copies are not live — re-run ./setup.sh after editing skills/."
exit 0
