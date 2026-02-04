---
name: code-review
description: Review TypeScript/wrapper code. Use on PR or when user asks for code review.
---

**When to use:** PR review request, phrases like “review this”, “check code”, “look at this code”.

**Project context:** octarine-wrapper is a TS SDK for Dota 2 (Octarine). Code lives in `wrapper/`, app logic in `internal/`, assets in `scripts_files/`, polyfills in `prototypes/`. Important: file naming (`item_*.ts`, `modifier_*.ts`, hero folders in Abilities), types from `octarine.d.ts` / `octarine-core.d.ts`, using `readFile`/`tryFindFile` for `scripts_files/`, and `prototypes/` imports when needed.

**What to check**

- Correctness, edge cases, null/undefined, strict typing, error handling.
- Style and conventions: PascalCase for types/classes; entity file names = game id; new abilities in `wrapper/Objects/Abilities/<Owner>/` (PascalCase folder by hero/unit, or Base), items in `wrapper/Objects/Items/`, modifiers in `wrapper/Objects/Modifiers/` (Abilities|Items|Base|Runes|Buildings).
- Security — if there is IO, code execution, or path handling (especially with `scripts_files/` and paths from scripts).
- Duplication with existing wrapper/internal code; reuse of existing Utils/Helpers/Enums.

**Response format**

- Per finding: **Critical** (must fix) | **Suggestion** | **Nice to have**.
- Give file and line (or code pattern).
- Short, concrete fix (one line or small block).
- No long intro; list findings directly.
