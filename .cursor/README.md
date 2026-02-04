# Cursor config — points to .ai/

Cursor reads from this folder, but **the source of truth is `.ai/`**.

- **Skills:** `.cursor/skills` is a **junction** to `.ai/skills` — no copy; Cursor uses `.ai` directly. Create it by running `scripts/link-cursor-to-ai.ps1`.
- **MCP:** `.cursor/mcp.json` is a **copy** of `.ai/mcp.json` (file symlinks need Admin on Windows). When you change MCP, edit `.ai/mcp.json` then run `scripts/link-cursor-to-ai.ps1` to update the copy.

**Project map:** `.ai/PROJECT.md`  
**Full AI docs:** `.ai/README.md`

After changing `mcp.json`, restart Cursor or reload MCP.
