---
name: problem
description: Use at the very start of a feature, before any spec or code. Interrogates the request until scope is unambiguous and the user explicitly agrees, then emits a problem statement and a concept graph. Use for "define the problem", "scope this", "what are we building".
license: MIT
---

# Problem

## When to use
First, before `spec`. Never write code from here.

**Existing project:** read `.agentic/project.md` (from `orient`) before asking anything. The problem is a
*change to a system that already exists* — its current behaviour, constraints, and roles are context you
must not re-ask the human for. If that map is missing, run `orient` first.

## Procedure
1. Ask sharp questions, one cluster at a time, until audience, goal, constraints, and non-goals are clear.
   On an existing project, also pin down what must **not** change (current behaviour others depend on).
2. Reflect the problem back. **Do not proceed until the user explicitly says it's correct.**
3. Emit the outputs below.

## Output
- `problem.md` — statement, goals, non-goals, constraints.
- `problem.graph.mmd` — a Mermaid concept graph of the problem space.

## Rules
- No solutioning before agreement.
