---
name: spec
description: Use after the problem is agreed to write one source-of-truth specification. Consolidates functional and technical requirements into a single markdown file. Optionally builds on GitHub spec-kit. Use for "write the spec", "requirements".
license: MIT
---

# Spec

## When to use
After `problem`, before `phases`.

## Procedure
0. **Existing project:** read `.agentic/project.md` and the code the change touches. Spec the **delta** —
   what changes, what stays — not the whole system. Match the stack and conventions already in the map;
   do not spec a parallel way of doing something the repo already does.
1. Draft functional requirements (what it does) and technical requirements (how) into ONE file.
2. If GitHub spec-kit is present, run `/speckit.specify` and let it own the spec body.
3. Record non-negotiables (evidence rules, design system, "prefer established libraries") in `constitution.md`.

## Output
- `spec.md` (single source of truth). Optionally `.specify/memory/constitution.md`.
