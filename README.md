# Agentic Dev Workflow

An **agent-agnostic** library of independent skills for shipping software with an AI agent.
Each step is its own skill in the open [Agent Skills](https://agentskills.io) format, so you can
run **one, several, or all** of them — with Claude Code, Codex, Cursor, Gemini CLI, or any harness
that supports the standard. No step depends on another; pick what you need.

## The 7 skills
| Step | Skill | What it does |
|------|-------|--------------|
| 1 | `problem` | Grills you until the problem is agreed, emits a concept graph |
| 2 | `spec` | Consolidates requirements into one source-of-truth `spec.md` |
| 3 | `phases` | Breaks work into ordered phases + dependency graph |
| 4 | `issues` | Turns phases into GitHub issues (gh CLI or GitHub MCP) |
| 5 | `design` | Full screens + design system, exports tokens |
| 6 | `plan-parallelize` | Master plan + per-issue sub-plans + worktree waves. **Optional:** promote any issue to a Lavish plan (on request, not automatic) |
| 7 | `pr-no-mistakes` | Runs the no-mistakes gate; PR description carries **screenshot (if UI) + scope + system impact** |

Plus a meta-skill — `install` — that drops the whole library into whatever harness you're running.

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
copies the seven skills, and verifies them. This is the portable path for harnesses without a shell.

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
   sub-plans, and assigns parallel work across git worktrees (cap ~4). Optionally promote an issue to an
   interactive **Lavish** plan — only when you ask.
7. **`pr-no-mistakes`** — on a committed feature branch, runs the no-mistakes gate (review, test, lint,
   PR, CI) and writes a PR description carrying **screenshot (if UI) + scope + system impact**.

**Typical run:** `problem → spec → phases → issues → design → plan-parallelize`, then build each issue in
its worktree and close with `pr-no-mistakes` per PR. **Quick patch:** skip straight to `pr-no-mistakes`.
Every step inherits the rules in `constitution.md` — scope discipline, evidence before "done", small PRs.

## External skills it leans on
- **lavish-axi** — interactive HTML plans you can annotate. `npx skills add kunchenguid/lavish-axi --skill lavish`
- **no-mistakes** — the PR validation gate. `npx skills add kunchenguid/no-mistakes` *(confirm exact skill name on its page)*

## Design choices
- **No merge queue.** Keep PRs small and scoped; the `no-mistakes` gate makes each one safe on its own.
- **Scope discipline.** Every skill enforces "touch only what you're asked."
- **Evidence is the exit step.** Nothing is done without proof.

See `constitution.md` for the shared rules every skill inherits.
