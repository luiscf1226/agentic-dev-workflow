# CLAUDE.md

Project instructions for Claude Code working **on this repo**.

## What this repo is
The **Agentic Dev Workflow** — a library of agent skills in the open
[Agent Skills](https://agentskills.io) format. It is documentation, not an application:
every skill is a `SKILL.md` of instructions an agent follows. **There is no build, no test
suite, and no CI.** Do not invent one, and do not claim a green test gate that doesn't exist.

## Layout
| Path | What |
|------|------|
| `skills/<name>/SKILL.md` | One skill each. The source of truth. |
| `templates/` | Files skills write from (`project.md`, `phases.md`, `sub-plan.md`, `baton.md`, `batch-ledger.md`, `pr-description.md`, `pr-review.html`). |
| `AGENTS.md` | Router for any harness — which skill to load for a task. |
| `constitution.md` | Rules every skill inherits. Read it before changing a skill. |
| `install.sh` | Copies `skills/` into a consuming project's harness dir. |
| `.claude/skills`, `.cursor/skills`, `.codex/skills` | **Symlinks to `skills/`** so all three harnesses see one source. Never edit through a symlink path; edit `skills/` directly. |

## Working on skills
- **Edit `skills/<name>/SKILL.md` directly.** The harness dirs are symlinks — changes are live
  immediately in all three, with no copy step.
- Frontmatter `name:` **must** equal the directory name. A mismatch makes the skill unloadable.
- A skill's `description:` is what routes work to it — it must carry the trigger phrases a user
  would actually type, not just a summary.
- Adding a skill: create the folder, then add it to `AGENTS.md`, `README.md`, and the verification
  table in `skills/install/SKILL.md`. Missing any of those makes it invisible to some harness —
  `AGENTS.md` in particular is how Cursor and Codex find it.
- Referencing `templates/<file>` from a skill means that file must exist. Check before shipping.

## Gotchas
- **`.gitignore` patterns must be root-anchored** (`/phases.md`, not `phases.md`). A bare filename
  matches at any depth and will silently swallow `templates/phases.md` on `git add -A`.
- External skills referenced but not shipped here: `no-mistakes`, `address-pr-comments`, `run`,
  `lavish-axi`. Don't treat them as available.

## Verifying a change
No test suite, so check these by hand:
```bash
for f in skills/*/SKILL.md; do d=$(basename $(dirname $f)); n=$(sed -n '2s/^name: //p' $f); \
  [ "$n" = "$d" ] || echo "MISMATCH $d"; done          # frontmatter matches dir
grep -rho "templates/[a-z0-9._-]*\.[a-z]*" skills/ *.md | sort -u | \
  while read t; do [ -f "$t" ] || echo "MISSING $t"; done   # template refs resolve
git check-ignore -v templates/*.md                      # nothing silently ignored
```

## Conventions
- Branches: `feat/<slug>` (see git log).
- PR descriptions follow `templates/pr-description.md`: plain-language purpose and behavior, a reviewer
  walkthrough, scope, system impact, and evidence.
- Agents open PRs; **humans merge** (`constitution.md`).
