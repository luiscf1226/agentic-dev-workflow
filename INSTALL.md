# Install Guide (easy)

Pick your tool below and copy-paste. Takes about 1 minute.

First, get the files (everyone does this once):

```bash
git clone https://github.com/luiscf1226/agentic-dev-workflow
cd agentic-dev-workflow
```

---

## Claude Code

### Easiest — let Claude install it
Open Claude Code in this folder and type:

```
install the agentic dev workflow skills
```

That's it. Claude runs the `install` skill, copies everything, and confirms.

### Or run the script
```bash
./install.sh        # this project only
./install.sh -g     # all your projects (recommended)
```

Restart Claude Code, then type `/problem` to check it worked.

---

## Codex

```bash
./install.sh -t .codex/skills
```

Then point Codex at the repo's `AGENTS.md` (it lists the skills and the run order).
No script? Just copy the folder:

```bash
mkdir -p .codex/skills && cp -R skills/. .codex/skills/
```

---

## Windows

`install.sh` needs a bash shell. Two easy options:

### Option A — PowerShell (no extra tools)
Run from inside the `agentic-dev-workflow` folder:

```powershell
# global — all projects
New-Item -ItemType Directory -Force "$HOME\.claude\skills" | Out-Null
Copy-Item -Recurse -Force skills\* "$HOME\.claude\skills\"

# OR this project only
New-Item -ItemType Directory -Force ".claude\skills" | Out-Null
Copy-Item -Recurse -Force skills\* ".claude\skills\"
```

For Codex on Windows, swap the path for `.codex\skills`.

### Option B — Git Bash or WSL
If you have Git Bash or WSL, the normal script just works:

```bash
./install.sh -g
```

---

## Did it work?
You should see the skills here:

- **Claude Code (global):** `~/.claude/skills/` (Windows: `%USERPROFILE%\.claude\skills\`)
- **Project:** `.claude/skills/` (or `.codex/skills/`)

There should be 8 folders: `problem`, `spec`, `phases`, `issues`, `design`,
`plan-parallelize`, `pr-no-mistakes`, `install`.

In Claude Code, type `/problem` — if it's recognized, you're done. 🎉

Next: see [How to use](README.md#how-to-use) in the README.
