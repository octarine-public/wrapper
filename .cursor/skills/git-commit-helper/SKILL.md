---
name: git-commit-helper
description: Compose commit message from diff using Conventional Commits. Use when user asks for commit message or staged changes.
---

**When to use:** User asks for a commit message, description of staged changes, or “write a commit from this diff”.

**Format:** Single line `type(scope): subject`.

- **type:** feat | fix | docs | style | refactor | test | chore | perf | ci | build.
- **scope (this repo):** Area of change. Options: `wrapper` (SDK code in wrapper/), `internal` (internal/), `prototypes` (prototypes/), `scripts_files` (assets in scripts_files/), `scripts` (root or scripts/), `.ai` (AI/skills config), `.cursor` (Cursor config), `deps` (package.json, tsconfig, eslint, etc.), `abilities` / `items` / `modifiers` (if commit is narrowly about those).
- **subject:** Imperative, ~50 chars max, no trailing period. Describe the change, not generic “fix” without context.

**Rules**

- Base only on the actual diff (staged or provided by user). Do not invent changes.
- One commit — one line. Do not add a commit body unless the user asks.
- For many unrelated changes — either one general type(scope): subject (e.g. chore(wrapper): sync types and lint), or suggest splitting into several commits with different scopes.
