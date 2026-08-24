# Agentic Dev Workflow

An **agent-agnostic** library of independent skills for shipping software with an AI agent.
Each step is its own skill in the open [Agent Skills](https://agentskills.io) format, so you can
run **one, several, or all** of them — with Claude Code, Codex, Cursor, Gemini CLI, or any harness
that supports the standard. No step depends on another; pick what you need.

## Start here (new teammate)
1. Install the skills into your harness — `./install.sh` (see [Install](#install)).
2. **Run `orient`.** It maps the repo into `.agentic/project.md`: stack, *verified* commands, layout,
   conventions, roles, risk areas. Every other skill reads that file instead of guessing, so you and
   your teammates work from the same picture. Commit it — it's a team artifact.
3. Then pick your path:

| Your situation | Path |
|---|---|
| **Existing project**, need to understand it | `orient` — that's the whole job |
| **Existing project**, one task | `orient` → `plan-parallelize --single` → `execute-plan` → `pr-no-mistakes` |
| **Existing project**, a backlog | `orient` → `plan-parallelize` → `run-batch` per agent |
| **Existing project**, a pass over quality | `orient` → `security-audit` / `improve-ui-ux` |
| **New project**, from nothing | `problem` → `spec` → `phases` → `issues` → `design` → `orient` → build |

Nothing is coupled — jump to whichever skill matches the task.

## Entry skill
| Step | Skill | What it does |
|------|-------|--------------|
| 0 | `orient` | Maps an existing/new repo into `.agentic/project.md` — the shared team baseline |

## The 8 skills
| Step | Skill | What it does |
|------|-------|--------------|
| 1 | `problem` | Grills you until the problem is agreed, emits a concept graph |
| 2 | `spec` | Consolidates requirements into one source-of-truth `spec.md` |
| 3 | `phases` | Breaks work into ordered phases + dependency graph |
| 4 | `issues` | Turns phases into GitHub issues (gh CLI or GitHub MCP) |
| 5 | `design` | Full screens + design system, exports tokens |
| 6 | `plan-parallelize` | Master plan + per-issue sub-plans + worktree waves. **Single mode (`--single`):** one issue → one sub-plan + baton. **Optional:** promote any issue to a Lavish plan (on request) |
| 7 | `execute-plan` | Executes one approved sub-plan — auto-detects **create / modify / fix / test**, leaves evidence, keeps the baton current |
| 8 | `pr-no-mistakes` | Runs the no-mistakes gate; PR description carries **screenshot (if UI) + scope + system impact** |

Plus companions (independent of the 8-step core — run any time):
- `run-batch` — hands one agent an ordered batch of issues and loops `plan-parallelize --single →
  execute-plan → pr-no-mistakes` per issue without stopping between them. Pair with step 6's waves to run
  1-5 agents (any harness — Claude Code, Cursor, Codex) each churning through their own track unattended.
- `install` — drops the whole library into whatever harness you're running.
- `handoff` — a cross-cutting rescue that verifies and writes a resumable **baton** so an in-flight task
  can move to a fresh session on a bad approach, lost context, or session switch.
- `pr-review-page` — turns an open PR into a single self-contained interactive HTML review (plain-language
  summary, **DB model changes as tables**, **endpoints as cards**, **before/after screenshots**) that
  reviewers read *instead of the diff*, leaving questions in-page that export as `@claude` PR comments.
- `improve-ui-ux` — audit + improve UI/UX (modern patterns, before/after examples, responsiveness, a11y first).
- `security-audit` — adversarial audit of APIs, DB, JWT/roles with try-to-break scenarios (local/staging only).
- `create-test-plan-demo` — step-by-step demo/QA test plan as Markdown under `docs/test-plans/`.
- `create-video` — Playwright demo video with a visible fake cursor + click ripple (`demoClick` / `demoFill`).
- `add-logger-watchdog` — structured logger (`info` / `security` / `error` / `warning`) + superadmin watchdog.

## Working as a team
- **Same version for everyone.** After `git pull`, re-run `./install.sh -g`. Teammates on stale skills
  produce inconsistent output against a shared project map.
- **Commit `.agentic/project.md`.** It's the shared baseline; if you find it wrong, fix it in your PR.
- **Parallel work is assigned, not improvised.** `plan-parallelize` computes file overlap and gives each
  agent/teammate a track with owned files. Two people editing the same file in two worktrees is the
  failure mode this library exists to prevent.
- **Agents open PRs; humans merge.** No exceptions (`constitution.md`).

## Install

👉 New here? See the **[easy install guide](INSTALL.md)** for copy-paste steps (Claude Code, Codex, Windows).

> **Contributing to this repo** (rather than installing it elsewhere)? Run `./setup.sh` once after
> cloning — it wires Claude Code, Cursor, and Codex to `skills/` and verifies the library. See
> [Developing this repo](#developing-this-repo).

### Option A — auto-install script (any harness)
The script detects your harness (`.claude`, `.github`, `.cursor`, `.codex`, `.gemini`) and copies the
skills into the right folder:
```bash
./install.sh           # auto-detect harness, this project only
./install.sh -g        # global — all projects (~/.claude/skills)
./install.sh -a        # every harness dir present in this project
./install.sh -t DIR    # explicit target directory
./install.sh -h        # help
```

### Option B — let the agent do it
Ask your agent: *"install the agentic dev workflow skills."* The `install` skill detects the harness,
copies all skills (core + companions), and verifies them. This is the portable path for harnesses without a shell.

After `git pull`, refresh a global Claude install with `./install.sh -g` (see [INSTALL.md](INSTALL.md)).

### Option C — copy by hand
```bash
cp -R skills/. .claude/skills/        # Claude Code (project)
cp -R skills/. .github/skills/        # Copilot / VS Code
cp -R skills/. ~/.claude/skills/      # global, all projects
```
**Codex / other harnesses:** point your agent at `skills/` and `AGENTS.md`.

## How to use
Run the steps in order, or jump to whichever one you need — nothing is coupled.

0. **`orient`** — **run this first on any repo you haven't mapped.** Reads the codebase, *verifies* the
   install/build/test commands actually work, and writes `.agentic/project.md` (stack, layout,
   conventions, exact role names, risk areas, and an explicit `UNVERIFIED` list). Read-only apart from
   that one file. On an existing project this is the entry point; on a new one, run it once the skeleton
   exists so later steps inherit the conventions.
1. **`problem`** — describe what you want. The skill interrogates scope until you *explicitly* agree,
   then writes `problem.md` + a Mermaid concept graph. No code happens here.
2. **`spec`** — turns the agreed problem into one source-of-truth `spec.md` (functional + technical).
3. **`phases`** — breaks the spec into ordered phases with a dependency graph and a parallel-wave table
   (`phases.md`).
4. **`issues`** — files each phase/task as a GitHub issue with labels, milestones, and `blockedBy` links
   (via `gh` CLI or the GitHub MCP).
5. **`design`** *(only if there's a UI)* — produces full screens + a design system and exports
   `design-tokens.json`.
6. **`plan-parallelize`** — writes one **master plan** (you review this) plus auto-governed per-issue
   sub-plans, and assigns parallel work across git worktrees (cap ~4). **Single mode (`--single`)** skips
   the waves: one issue → one sub-plan + a seeded **baton**. Optionally promote an issue to an interactive
   **Lavish** plan — only when you ask.
7. **`execute-plan`** — executes one approved sub-plan/baton. It **auto-detects the task-type** (create,
   modify, fix, or test) and runs the matching approach, leaving evidence and keeping the baton current.
   If the session goes sideways, it invokes `handoff`.
8. **`pr-no-mistakes`** — on a committed feature branch, runs the no-mistakes gate (review, test, lint,
   PR, CI) and writes a PR description carrying **screenshot (if UI) + scope + system impact**. Its test
   step doubles as the **pre-handoff checkpoint**.

**Cross-cutting — `handoff`:** when a session hits a **bad approach, lost context, or a deliberate session
switch**, `handoff` runs the test gate first (never hands off broken work), then writes a resumable
**baton** (`templates/baton.md`) the next session reads and continues from — no re-planning.

**Companion — `pr-review-page`:** after the PR is open, generate `pr-<n>-review.html` from
`templates/pr-review.html` — a **code-free, interactive review** that classifies the PR (frontend /
backend / change), renders **DB model changes as tables**, **new endpoints as cards**, and **real
before/after screenshots** (captured at base vs head). Reviewers ask questions in-page; **export** posts
them to the PR as `@claude` comments and an agent answers on the thread (`address-pr-comments`).

**Typical run:** `problem → spec → phases → issues → design → plan-parallelize → execute-plan`, closing
with `pr-no-mistakes` per PR. **Single task:** `plan-parallelize --single → execute-plan → pr-no-mistakes`.
**Quick patch:** skip straight to `pr-no-mistakes`. **Batch across agents:** `plan-parallelize` splits the
backlog into 1-5 tracks, then each agent runs `run-batch` on its own track to churn through every issue
in it unattended.
Every step inherits the rules in `constitution.md` — scope discipline, evidence before "done", small PRs.

## Developing this repo
Working **on** the library (not installing it into another project):

```bash
./setup.sh              # wire all three harnesses + verify
SETUP_MODE=copy ./setup.sh   # force copies (Windows without symlink support)
```

| Harness | Reads | Skills at |
|---------|-------|-----------|
| Claude Code CLI | `CLAUDE.md` | `.claude/skills` |
| Cursor | `.cursor/rules/agentic-dev-workflow.mdc` | `.cursor/skills` |
| Codex | `AGENTS.md` | `.codex/skills` |

Those three skills dirs are **symlinks to `skills/`** — one source of truth, edits are live with no
copy step. They're generated and gitignored, so run `./setup.sh` after cloning. On platforms without
symlinks the script copies instead and tells you to re-run it after editing `skills/`.

This repo is documentation — **no build, no test suite, no CI**. `./setup.sh` runs the only checks
there are: frontmatter `name:` matches each directory, and every referenced `templates/` file exists.

## External skills it leans on
Referenced by these skills but **not shipped here** — install separately, or skip that step.
- **lavish-axi** — interactive HTML plans you can annotate. `npx skills add kunchenguid/lavish-axi --skill lavish`
- **no-mistakes** — the PR validation gate used by `pr-no-mistakes`. `npx skills add kunchenguid/no-mistakes` *(confirm exact skill name on its page)*
- **address-pr-comments** — answers the `@claude` questions `pr-review-page` exports.
- **run** — launches the app so `pr-review-page` can capture before/after screenshots.

## Design choices
- **No merge queue.** Keep PRs small and scoped; the `no-mistakes` gate makes each one safe on its own.
- **Scope discipline.** Every skill enforces "touch only what you're asked."
- **Evidence is the exit step.** Nothing is done without proof.
- **One shared project map.** `orient` writes `.agentic/project.md` once; skills read it instead of
  re-deriving the stack per person, per run. Same repo → same picture, whoever is driving.
- **Never invent a command.** Project commands are verified or marked `UNVERIFIED` — a fabricated test
  command that "passes" is worse than no evidence.
- **Works on inherited code.** Every skill has an existing-project path, not just a greenfield one.

See `constitution.md` for the shared rules every skill inherits.
