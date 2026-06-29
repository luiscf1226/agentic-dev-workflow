---
name: spec
description: Use after the problem is agreed to write one source-of-truth specification. Consolidates functional and technical requirements into a single markdown file. Optionally builds on GitHub spec-kit. Use for "write the spec", "requirements".
license: MIT
---

# Spec

## When to use
After `problem`, before `phases`.

## Procedure
1. Draft functional requirements (what it does) and technical requirements (how) into ONE file.
2. If GitHub spec-kit is present, run `/speckit.specify` and let it own the spec body.
3. Record non-negotiables (evidence rules, design system, "prefer established libraries") in `constitution.md`.

## Output
- `spec.md` (single source of truth). Optionally `.specify/memory/constitution.md`.
