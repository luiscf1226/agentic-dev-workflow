# AGENTS.md — router for any harness

Skills live in `skills/`. Each is a self-contained folder with a `SKILL.md`.
Load the one whose description matches the task; ignore the rest.

**Working on this repo itself?** Run `./setup.sh` once after cloning. It wires
`.claude/skills`, `.cursor/skills`, and `.codex/skills` to `skills/` so all three harnesses see one
source, then verifies every skill. This repo is a **documentation library — no build, no test suite,
no CI**; never claim tests pass. Edit `skills/<name>/SKILL.md` directly, never through a harness
symlink path. Full notes: `CLAUDE.md`.

To make these skills available in this harness, load `skills/install/SKILL.md` (or run `./install.sh`).

**Always start with `orient`** if `.agentic/project.md` is missing or stale. It maps the repo (stack,
verified commands, conventions, roles, risk areas) into one file every other skill reads instead of
re-discovering. Two entry paths:
- **New project:** `orient` (once a skeleton exists) → `problem → spec → phases → issues → design → …`
- **Existing project:** `orient` → jump straight to whatever the task needs (`problem` for a new feature,
  `run-batch` for a backlog, `security-audit` / `improve-ui-ux` for a pass over what's there).

The full order is
`orient → problem → spec → phases → issues → design → plan-parallelize → execute-plan → pr-no-mistakes`,
but each is independent — run any subset. `handoff` is a cross-cutting rescue: invoke it from inside
`execute-plan` when a session hits a bad approach, lost context, or a deliberate session switch.
`run-batch` is the batch driver: give one agent an ordered list of issues and it loops
`plan-parallelize --single -> execute-plan -> pr-no-mistakes` per issue without stopping between them.
Use it when 1-5 agents (one per harness/worktree) each own a track of the backlog.
`pr-review-page` is a post-PR companion: after a PR is open, it produces a self-contained interactive
HTML review (summary, DB tables, endpoints, before/after screenshots) reviewers read instead of the diff.

Five more companions are also independent (not part of the core order) — load any of them when
the task matches:
`improve-ui-ux`, `security-audit`, `create-test-plan-demo`, `create-video`, `add-logger-watchdog`.

**External skills** referenced but not shipped here — install separately or skip the step:
`no-mistakes` (the PR gate), `address-pr-comments` (answers PR questions), `run` (launch the app for
screenshots), `lavish-axi` (interactive HTML plans).
After `git pull`, refresh installed copies with `./install.sh -g` (or project-scoped `./install.sh`).

## Non-negotiables (apply to every skill)
1. **Surface assumptions before building.** If requirements conflict, stop and ask.
2. **Touch only what you're asked.** No drive-by refactors.
3. **Leave evidence.** A task is not done without proof (test run, screenshot, query, log).
4. **Keep PRs small.** One concern per PR.
5. **A human owns irreversible calls** (problem agreement, merge to main).
6. **Never invent a project command.** Test/lint/run commands come from `.agentic/project.md` (verified by
   `orient`) or from the repo — a fabricated command that appears to pass is worse than no evidence.

Full rules: `constitution.md`.
