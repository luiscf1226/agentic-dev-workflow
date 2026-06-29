---
name: phases
description: Use after the spec to break work into ordered phases with explicit dependencies, as a markdown file other steps read from. Emits a phase list plus a dependency graph and a parallel-wave table. Use for "phases", "break down the work", "dependencies".
license: MIT
---

# Phases

## When to use
After `spec`, before `issues` and `plan-parallelize`.

## Procedure
1. Derive phases from the spec. For each: goal, deliverables, depends-on, blocks, parallel-safe-with, exit criteria.
2. Render the dependency graph (Mermaid) and a wave table (what runs concurrently).
3. Write it to `phases.md` (template in `templates/phases.md`).

## Output
- `phases.md` — list + dependency graph + wave table. The durable plan other steps consume.
