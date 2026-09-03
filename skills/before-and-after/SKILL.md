---
name: before-and-after
description: Captures before/after screenshots of web pages or elements and produces a PR-ready markdown comparison table. Use when the user says "take before and after", "screenshot comparison", "visual diff", "PR screenshots", "compare old and new", or needs to document UI changes. Accepts two URLs (file://, http://, https://) or two existing image paths.
license: MIT
---

# Before and After

Drive the official `@vercel/before-and-after` CLI to produce a `| Before | After |` table for the PR.
This skill does **not** vendor that CLI or its upload adapters.

Inspired by [michaelshimeles/skills](https://github.com/michaelshimeles/skills) `before-and-after`
(upstream: [vercel-labs/before-and-after](https://github.com/vercel-labs/before-and-after)).

## When to use
- A PR needs visual proof a UI change does what it claims
- You already have two PNGs from `evidence-driven-testing` and need a markdown table
- Comparing two URLs, two images, or a mix of both

For an interactive review page with DB tables and endpoint cards, use `pr-review-page` instead (or
after). This skill is the screenshot pair.

## Agent behavior
**Do not:** switch git branches, stash changes, start a server, or guess what "before" is.
**Do:** assume the current running app is **After**. If the user gives only one URL or says "PR
screenshots" without a before URL, **ask**: production URL, preview deployment, or another local port?

## Procedure
1. **Pre-flight:** `which before-and-after || npx --yes @vercel/before-and-after --help`
   The package name is `@vercel/before-and-after`. Never call the wrong npm package `before-and-after`.
2. **If a URL is `.vercel.app`:** `curl -s -o /dev/null -w "%{http_code}" "<url>"`. 401/403 means
   deployment protection — get a bypass token (`vercel inspect`) or take screenshots another way.
3. **Capture:**

   ```bash
   npx --yes @vercel/before-and-after "<before-url>" "<after-url>"
   npx --yes @vercel/before-and-after url1 url2 ".hero-section"
   npx --yes @vercel/before-and-after before.png after.png --markdown
   ```

   Flags: `--mobile` (375x812), `--tablet` (768x1024), `--size WxH`, `--full` (only if the user asked
   for full-page scroll), `-o <dir>` (prefer `.artifacts/<task>/`).
4. **PR:** append the markdown table to the description (`gh pr edit`) under **Screenshot**, keeping
   the rest of `templates/pr-description.md`. If `--markdown` would upload images to a **public** host
   (default 0x0.st), **do not** use it for anything sensitive — keep files local, attach via GitHub,
   or pass `--upload-url` to a host the team controls.
5. Sandbox note: if Chrome fails with "No usable sandbox", set `AGENT_BROWSER_ARGS="--no-sandbox"`.

## Output
- Before/after PNGs and a markdown table in the PR body.

## Rules
- Current checkout is After; Before is an explicit other URL, commit, or image.
- Never upload secrets, customer data, or auth-gated screens to a public paste host.
