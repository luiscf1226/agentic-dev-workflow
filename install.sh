#!/usr/bin/env bash
# Agentic Dev Workflow — installer.
# Copies the skill library into any agent harness (Claude Code, Copilot, Cursor, Codex, Gemini CLI).
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)/skills"

# harness marker dir : human label
HARNESSES=(
  ".claude:Claude Code"
  ".github:GitHub Copilot / VS Code"
  ".cursor:Cursor"
  ".codex:Codex"
  ".gemini:Gemini CLI"
)

usage() {
  cat <<'EOF'
Agentic Dev Workflow installer

Usage: ./install.sh [option]

Options:
  (no args)     Auto-detect a harness in the current project and install there
  -g, --global  Install for all projects (~/.claude/skills)
  -a, --all     Install into every harness dir already present in the project
  -t DIR        Install into an explicit skills directory
  -h, --help    Show this help

Project-scope layouts that are auto-detected:
  .claude/skills    Claude Code
  .github/skills    GitHub Copilot / VS Code
  .cursor/skills    Cursor
  .codex/skills     Codex
  .gemini/skills    Gemini CLI

If none are present, the skills install into .claude/skills.
EOF
}

copy_into() {
  local dest="$1"
  mkdir -p "$dest"
  cp -R "$SRC/." "$dest/"
  echo "✓ installed skills → $dest"
}

case "${1:-}" in
  -h|--help)
    usage; exit 0 ;;
  -g|--global)
    copy_into "$HOME/.claude/skills"; exit 0 ;;
  -t)
    [ -n "${2:-}" ] || { echo "error: -t needs a directory" >&2; exit 1; }
    copy_into "$2"; exit 0 ;;
  -a|--all)
    found=0
    for entry in "${HARNESSES[@]}"; do
      marker="${entry%%:*}"
      [ -d "$marker" ] && { copy_into "$marker/skills"; found=1; }
    done
    [ "$found" -eq 1 ] || { echo "no harness dirs found; run with no args to create .claude/skills"; exit 1; }
    exit 0 ;;
  "")
    # Auto-detect: install into the first existing harness, else default to Claude Code.
    for entry in "${HARNESSES[@]}"; do
      marker="${entry%%:*}"; label="${entry#*:}"
      if [ -d "$marker" ]; then
        echo "detected $label"
        copy_into "$marker/skills"; exit 0
      fi
    done
    echo "no harness detected — defaulting to Claude Code"
    copy_into ".claude/skills"; exit 0 ;;
  *)
    echo "unknown option: $1" >&2; usage; exit 1 ;;
esac
