---
name: design
description: Use when a feature needs UI. Produces full screens and a design system (not throwaway wireframes) and exports design tokens. Works with the Figma MCP or any design tool. Use for "design", "screens", "UI", "mockups", "design system".
license: MIT
---

# Design

## When to use
For any feature with a user interface.

## Procedure
0. **Existing project:** read `.agentic/project.md` for the design tokens / theme location and use the
   system that's already there. Extending an existing design system beats inventing a second one.
1. From the spec, produce FULL screens for each state (not wireframes).
2. Derive or reuse a design system: palette, type, spacing, components.
3. Export `design-tokens.json`. If a brand/design system already exists, match it.
4. If using the Figma MCP, pace calls to respect rate limits.

## Output
- Full screens + `design-tokens.json`.
