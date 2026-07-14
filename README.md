# Agentic Dev Workflow

An **agent-agnostic** library of independent skills for shipping software with an AI agent.
Each step is its own skill in the open [Agent Skills](https://agentskills.io) format, so you can
run **one, several, or all** of them — with Claude Code, Codex, Cursor, Gemini CLI, or any harness
that supports the standard. No step depends on another; pick what you need.

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

## Install

👉 New here? See the **[easy install guide](INSTALL.md)** for copy-paste steps (Claude Code, Codex, Windows).

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
**Quick patch:** skip straight to `pr-no-mistakes`.
Every step inherits the rules in `constitution.md` — scope discipline, evidence before "done", small PRs.

## External skills it leans on
- **lavish-axi** — interactive HTML plans you can annotate. `npx skills add kunchenguid/lavish-axi --skill lavish`
- **no-mistakes** — the PR validation gate. `npx skills add kunchenguid/no-mistakes` *(confirm exact skill name on its page)*

## Design choices
- **No merge queue.** Keep PRs small and scoped; the `no-mistakes` gate makes each one safe on its own.
- **Scope discipline.** Every skill enforces "touch only what you're asked."
- **Evidence is the exit step.** Nothing is done without proof.

See `constitution.md` for the shared rules every skill inherits.
