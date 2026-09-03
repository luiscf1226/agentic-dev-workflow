---
name: evidence-driven-testing
description: Prove a change with verifiable evidence instead of prose — UI via live browser or Playwright captures, non-UI via measured numbers or output pairs. Capture the before state while reproducing a bug, then the after once the change works. Use for "leave evidence", "prove it works", "record a test session", "before and after proof", "don't just claim it passed".
license: MIT
---

# Evidence-Driven Testing

A task is not done without proof. Capture **before** (especially for fixes — while the bug still
reproduces) and **after**, then attach both to the PR.

Adapted from [michaelshimeles/skills](https://github.com/michaelshimeles/skills)
`evidence-driven-testing`. This library's version prefers the harness browser tools and Playwright
already used by `create-video` / `pr-review-page`. An annotated FFmpeg recorder is optional (see
upstream `scripts/evidence.py` if you need burned-in assertion overlays).

## When to use
Whenever `execute-plan` or `pr-no-mistakes` needs proof the change works — UI, API, or agent behavior.
Evidence **complements** the repo's verified checks; it never replaces them.

## Procedure
0. **Read `.agentic/project.md`.** Use its verified run/test commands and its evidence norm. Never
   invent a command. Confirm the process on the app port is **yours** (`lsof -i :<port>` or
   `ss -ltnp "sport = :<port>"`) before trusting the screen.
1. **Write testable targets** — behaviors as statements you can pass/fail (not "it looks fine").
2. **Capture before** when verifying a fix or a visible change: reproduce the old state *before*
   writing the patch. That capture is the before half of the pair.
3. **Run the repo checks** from the map (test / lint / typecheck as applicable).
4. **Capture after** with the matching method below. Save under `.artifacts/<task-name>/` (gitignored
   — upload, do not commit).
5. **Record results** in `assertions.md` next to the captures: each target, `passed` / `failed` /
   `untested` + reason. Never skip a target silently.
6. **Hand pairs to `before-and-after`** (UI) and to `pr-no-mistakes` (PR body). Post video or large
   files with `gh` or the PR comment box — `gh pr comment` cannot attach a local video.

### UI — prefer live browser, then Playwright
- Drive the app the way a user would (click, type, submit, navigate). A single static screenshot of
  the happy path is not enough when the change is behavioral.
- **Harness browser tools** when available: exercise the flow, then save before/after screenshots at
  the same viewport and state.
- **Headless / no GUI:** a one-off Playwright script, without adding Playwright to the project's
  dependencies:

  ```bash
  npx --yes --package=playwright node record.mjs
  ```

  Minimal `record.mjs`:

  ```js
  import { chromium } from "playwright";
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: { dir: ".artifacts/<task-name>/" },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:<port>/path-under-test");
  // drive the flow, one meaningful state change per step
  await context.close();
  await browser.close();
  ```

  Name still frames in order: `01-precondition-signed-in.png`, `02-it-saves-on-blur-passed.png`.
- In containers where Chrome fails with "No usable sandbox", set `AGENT_BROWSER_ARGS="--no-sandbox"`.
- Never record secrets, tokens, customer data, or payment details; mark that flow `untested` and say why.

### Non-UI still needs evidence
- **API / performance:** a scripted probe with measured numbers (status, latency, counts) saved to
  `probe-output.txt`.
- **Rendering / canvas:** frames plus a pixel/diff value, reviewed by eye.
- **Agent behavior:** the transcript excerpt showing the tool call and response.
- **Docs/skills-only repos:** the verification commands from that repo's map (this library: frontmatter
  match + template refs) — still write what you ran and the output.

## Guardrails
- State the exact commit/branch (or deployment URL) tested: `git rev-parse HEAD` and
  `git branch --show-current`.
- Do not present scripted playback, stitched clips, or a synthetic test pattern as live UI evidence.
- Maximize the window; do not record a tiled or half-covered UI.
- Fill caveats. Placeholder "looks good" is not evidence.

## Output
- `.artifacts/<task-name>/` with before/after media or measured output, plus `assertions.md`.
- Those artifacts referenced in the PR description (`templates/pr-description.md`).

## Rules
- A result without the required evidence is still in progress (`orchestrate-team`).
- Use this repo's verified commands; a fabricated passing command is worse than no evidence.
