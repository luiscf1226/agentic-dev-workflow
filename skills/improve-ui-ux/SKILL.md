---
name: improve-ui-ux
description: Audit and improve UI/UX with modern patterns, concrete before/after examples, responsiveness, and accessibility first. Use for "/improve-ui-ux", "improve UI", "improve UX", "make it responsive", "modernize the UI".
license: MIT
---

# Improve UI/UX

## When to use
When the user wants to polish UI, fix responsiveness, modernize the look, or
improve usability — for a page, component, route, or the highest-traffic surface
you can identify.

## Procedure
1. **Discover the surface.** Start from `.agentic/project.md` (from `orient`) for the stack, design
   tokens / theme location, and conventions — only investigate what the map
   doesn't cover, and update the map if you find it wrong. Otherwise identify the
   stack (React, Next.js, Vue, Svelte, plain HTML/CSS, etc.), design tokens /
   theme files, shared layouts, and global CSS. If the user named a page or component, start there; otherwise scan main
   user-facing routes and list the worst offenders. Match existing patterns —
   do not invent a parallel design system.
2. **Audit before editing.** Produce a short severity-ranked audit covering:

   | Area | What to check |
   |------|----------------|
   | Responsiveness | Breakpoints, overflow, touch targets, viewport meta, stacked vs side-by-side |
   | Hierarchy | Brand/product prominence, one job per section, first-viewport clutter |
   | Typography | Readable scale, line-height, contrast; avoid generic default stacks when redesigning |
   | Spacing | Consistent rhythm; cramped or uneven gaps |
   | Interaction | Hover/focus/active states, loading feedback, disabled clarity |
   | Accessibility | Contrast, labels, keyboard nav, reduced-motion |
   | Motion | Purposeful transitions only; no decorative noise |

   For each finding: file + location, what is wrong (1 sentence), suggested fix
   (1–2 sentences or a tiny code sketch).
3. **Implement improvements** in priority order:
   **accessibility → responsiveness → clarity → polish**.

   Responsiveness:
   - Mobile-first where the project already is; otherwise match existing breakpoints.
   - No horizontal scroll on common phone widths (375–430px).
   - Touch targets ≥ 44×44px for primary actions.
   - Images/media scale with the container; avoid fixed widths that break layouts.

   Prefer patterns already in the repo (CSS variables/tokens, existing breakpoint
   utilities, semantic HTML before ARIA). Every non-trivial change must show a
   **before → after** snippet or one-line visual delta. Do not add card chrome
   (borders, shadows, radii) unless interaction requires a container.
4. **Verify.** Run typecheck / lint if available. Summarize files changed, top
   UX wins (3–5 bullets), and remaining risks or follow-ups.

## Output
- A short audit with concrete examples, then the applied UI/UX changes with
  before/after evidence and a verification summary.

## Rules
- Preserve brand and existing visual language unless asked to rebrand.
- Do not swap the whole component library mid-task.
- Prefer editing shared primitives over one-off page hacks when reuse is clear.
- If no focus target was given, improve the highest-traffic surface and say what
  you skipped.
- Scope discipline per `constitution.md` — touch only the UI surface asked for.
