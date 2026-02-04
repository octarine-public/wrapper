---
name: octarine-wrapper
description: Conventions and layout for octarine-wrapper (TS SDK for Dota 2). Use when editing code, adding abilities/items/modifiers, or working with prototypes/scripts_files.
---

**Stack:** TypeScript 5.x strict, ESLint + Prettier, node ≥ 18. Commands: `yarn check-types`, `yarn lint`, `yarn check-circular`.

---

**Repo root**

- **wrapper/** — All SDK code (Base, Enums, Native, Objects, GUI, Menu, Managers, Utils, Helpers, Resources, Tests).
- **prototypes/** — JS built-in extensions (Number, BigInt, Array, Math). Files: `array.ts`, `bigint.ts`, `index.ts`, `math.ts`, `number.ts`. In scripts: `import "github.com/octarine-public/wrapper/prototypes/bigint"` etc.
- **scripts_files/** — Script assets. Read via `wrapper/Utils/readFile.ts` and `tryFindFile(path)` — path is resolved relative to the script folder inside `scripts_files/`. Contents: `images/`, `materials/`, `menu/`, `models/`, `particles/` (subfolders range_display, range_line, range_linear, target, vbe, etc.), `translations/` (cn.json, en.json, ru.json), `network_particles.json`, `network_projectile.json`.
- **index.ts** (root) — Main entry: imports `global`, `translations`, re-exports from `wrapper/Imports`. Scripts import the wrapper via this file. **global.ts** — imports `prototypes/index` (loaded by index).
- Types at root: `octarine.d.ts`, `octarine-core.d.ts`, `standard.d.ts`.

---

**wrapper/ — folders and files**

- **Base/** — Base types: AABB, Color, Vector2/3/4, Matrix3x4, QAngle, Quaternion, Particle, Rectangle, PlayerData, EntityProperties, etc.
- **Objects/Base/** — Base entity classes: Ability.ts, Building.ts, Creep.ts, Courier, CustomPickRules, AdditionalWearable, CameraBounds, CreepPathCorner, etc.
- **Enums/** — All enums (ABILITY_TYPES, DOTA_ABILITY_BEHAVIOR, DOTA_UNIT_TARGET_*, DOTA_RUNES, DAMAGE_TYPES, EventPriority, modifierstate, Team, etc.). File names PascalCase or UPPER_SNAKE.
- **Native/** — Engine native calls.
- **Objects/Abilities/** — Abilities. Subfolders by owner in PascalCase (hero or unit: Axe, AntiMage, Invoker, Courier, Roshan, BeastmasterBoar, …) and **Base/** for shared; inside each folder — files named by ability id (e.g. `axe_battle_hunger.ts`).
- **Objects/Items/** — Items. Flat list of `item_*.ts` files (item_branches.ts, item_ultimate_scepter.ts, etc.).
- **Objects/Modifiers/** — Modifiers. Subfolders: **Abilities/** (many files), **Base/** (modifier_bashed, modifier_rooted, modifier_stunned, etc.), **Buildings/**, **Items/**, **Runes/** (modifier_rune_arcane, modifier_rune_haste, etc.). File names: `modifier_*.ts`.
- **Objects/Heroes/**, **Creeps/**, **Units/**, **Buildings/** — Heroes, creeps, units, buildings (files/subfolders by id or type).
- **Objects/DataBook/** — AbilityData, Inventory, UnitData, UnitModifierManager, PlayerCustomData.
- **GUI/**, **Menu/**, **Managers/** — UI and managers (CLowerHUD, CMinimap, CShop, EventsSDK, etc.).
- **Utils/**, **Helpers/** — readFile, tryFindFile, ArrayExtensions, GameState, Math, Protobuf, DotaMap, Sleeper, etc.
- **Resources/** — ParseEntityLump, ParseGNV, ParseMaterial, ParseTRMP, ParseUtils.
- **Tests/** — Abilities.ts, Modifiers.ts, Units.ts.

---

**Naming**

- Entity file = game id: `item_aghanims_shard.ts`, `modifier_rune_haste.ts`, `npc_dota_hero_axe.ts`.
- Class = PascalCase from id: ItemAghanimsShard, ModifierRuneHaste, NpcDotaHeroAxe. Extend from the right base in `wrapper/Base/` or `wrapper/Objects/Base/`.
- New enum — in `wrapper/Enums/`, file name by meaning (PascalCase).

---

**Adding a new entity**

- **Ability:** In `wrapper/Objects/Abilities/<Owner>/` — subfolder is PascalCase by owner (hero or unit, e.g. Axe, Invoker, Courier, Roshan, BeastmasterBoar); use **Base/** for shared abilities. File name = ability id (e.g. `axe_battle_hunger.ts`); class extends the appropriate base Ability.
- **Item:** New file `item_<id>.ts` in `wrapper/Objects/Items/`; class Item*.
- **Modifier:** In the right Modifiers subfolder (Abilities / Items / Base / Runes / Buildings); file `modifier_<id>.ts`; class Modifier*.
- **New enum:** File in `wrapper/Enums/`.

When adding assets (textures, particles, translations) — put them in the right **scripts_files/** subfolders and access via `readFile`/`tryFindFile` with a path relative to `scripts_files/`.

---

**Response style**

- Minimal edits; do not refactor unrelated code.
- When suggesting multiple new files — one full example + “same pattern for …” with path and name.
