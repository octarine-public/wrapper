# AI config (single source of truth)

**`.ai/`** is the only place for AI agent config. Any IDE (Cursor, Windsurf, Copilot, etc.) should use this folder.

| Path | Purpose |
|------|---------|
| **PROJECT.md** | Project map: what the repo is, where to look, stack, conventions. |
| **mcp.json** | MCP servers: **filesystem** (read/write workspace), **memory** (persistent key-value for the agent). |
| **skills/** | Skills: code-review, git-commit-helper, octarine-wrapper. |

**Cursor:** `.cursor/skills` is a junction to `.ai/skills` (Cursor reads from here). `.cursor/mcp.json` is a copy of `.ai/mcp.json` — when you change MCP config, edit `.ai/mcp.json` and copy to `.cursor/mcp.json`, or run `scripts/link-cursor-to-ai.ps1` to update the copy.

**Other IDEs:** Use `mcp.json` and `skills/` as reference; your IDE may use different paths (e.g. Windsurf: global MCP config, `.windsurfrules`).
