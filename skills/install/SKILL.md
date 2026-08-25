---
name: install
description: Use to install (or update) the Agentic Dev Workflow skill library into the current agent harness — Claude Code, GitHub Copilot, Cursor, Codex, or Gemini CLI. Detects the harness, copies all skills (core + companions) into the right folder, and verifies them. Use for "install the workflow", "set up these skills", "add the agentic dev skills", "install for any harness", "update skills after git pull".
license: MIT
---

# Install

## When to use
When the user wants the workflow skills available in their agent — first-time
setup **or** a refresh after `git pull` brought new/updated skills. Works for a
one-off project or globally.

## Procedure
1. **Find the source.** Locate this repo's `skills/` directory (the folder this
   `install/SKILL.md` lives in). If the user only has the published package, run
   `npx skills add <repo> --skill <name>` for each skill, or clone the repo first.
2. **Pick the scope.** Ask once if unclear:
   - *Project* — install for this repo only (default).
   - *Global* — install for every project on the machine.
3. **Detect the harness** by which marker directory exists, then target its
   `skills/` subfolder:
   | Harness | Project dir | Global dir |
   |---------|-------------|------------|
   | Claude Code | `.claude/skills/` | `~/.claude/skills/` |
   | GitHub Copilot / VS Code | `.github/skills/` | — |
   | Cursor | `.cursor/skills/` | — |
   | Codex | `.codex/skills/` + point `AGENTS.md` at `skills/` | — |
   | Gemini CLI | `.gemini/skills/` | — |

   If no marker is present, default to `.claude/skills/`.
4. **Install.** Easiest path is the bundled script — it auto-detects:
   ```bash
   ./install.sh           # auto-detect harness, project scope
   ./install.sh -g        # global (~/.claude/skills)
   ./install.sh -a        # every harness dir present in the project
   ./install.sh -t DIR    # explicit target
   ```
   After pulling updates from this repo:
   ```bash
   git pull origin master && ./install.sh -g
   ```
   Or copy by hand: `mkdir -p <dest> && cp -R skills/. <dest>/`.
5. **Verify.** List the destination and confirm **all** SKILL.md folders landed —
   core workflow **and** companions:

   | Group | Skills |
   |-------|--------|
   | Entry (1) | `orient` |
   | Core (8) | `problem`, `spec`, `phases`, `issues`, `design`, `plan-parallelize`, `execute-plan`, `pr-no-mistakes` |
   | Companions | `install`, `orchestrate-team`, `run-batch`, `handoff`, `pr-review-page`, `improve-ui-ux`, `security-audit`, `create-test-plan-demo`, `create-video`, `add-logger-watchdog` |

   In Claude Code, confirm skills appear (e.g. `/problem`, `/improve-ui-ux`).
   Report the destination path back to the user.

## Output
- All skills (core + companions) copied into the harness's skills directory,
  verified, with the path reported.

## Rules
- Never overwrite a user's unrelated skills — only write the folders this library owns.
- Copy `templates/`, `constitution.md`, and `AGENTS.md` alongside if the harness reads from the repo root.
  Skills reference `templates/` directly (`project.md`, `phases.md`, `sub-plan.md`, `baton.md`,
  `batch-ledger.md`, `team-run.md`, `pr-description.md`, `pr-review.html`) — an install without them half-works.
- **Team installs:** everyone on a repo should run the same version. After `git pull`, re-run
  `./install.sh -g` so no teammate is running stale skills against a shared project map.
- Prefer `./install.sh -g` for team Claude Code installs so companions stay in sync after pull.
