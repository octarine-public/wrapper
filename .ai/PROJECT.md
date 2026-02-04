# Project map — octarine-wrapper

Shared map for any AI-powered IDE or agent. Use it to know where to look and how things are structured.

## What this project is

**octarine-wrapper** — TypeScript wrapper/SDK for Dota 2 (Octarine). Typed API for abilities, items, modifiers, units, heroes, GUI, managers. Scripts use this API and load assets from `scripts_files/`; polyfills from `prototypes/`. No standalone runtime — types and helpers for in-game scripts. Build: `yarn check-types`, `yarn lint`; node >= 18.

## Root-level folders and files

| Path | Purpose |
|------|---------|
| **wrapper/** | All SDK logic: Base, Enums, Native, Objects (Abilities, Items, Modifiers, Heroes, …), GUI, Menu, Managers, Utils, Helpers, Resources, Tests. |
| **prototypes/** | JS built-in extensions (Number, BigInt, Array, Math) for in-game scripts. Import: `github.com/octarine-public/wrapper/prototypes/number` etc. Files: `array.ts`, `bigint.ts`, `index.ts`, `math.ts`, `number.ts`. |
| **scripts_files/** | Static assets for scripts. Read via `wrapper/Utils/readFile.ts` / `tryFindFile()` — path is resolved relative to script location under `scripts_files/`. |
| **index.ts** | Main entry: imports `global`, `translations`, re-exports all from `wrapper/Imports`. Scripts typically import the wrapper via this file. |
| **global.ts** | Global setup: imports `prototypes/index` (built-in extensions). Loaded by `index.ts`. |
| **octarine.d.ts**, **octarine-core.d.ts**, **standard.d.ts** | SDK/engine type declarations. |

## scripts_files/ — structure

- **images/** — PNG, SVG (icons, textures for scripts).
- **materials/** — Engine materials (`.vmat_c`, `.vtex_c`).
- **menu/** — Menu SVG and assets.
- **models/** — Models (`.vmdl_c`).
- **particles/** — Particles (`.vpcf_c`; subfolders: range_display, range_line, range_linear, target, vbe, etc.).
- **translations/** — Locale JSON: `cn.json`, `en.json`, `ru.json`.
- **network_particles.json**, **network_projectile.json** — Network effects/projectiles config.

Access: from script code pass a path relative to `scripts_files/` to `readFile()` / `tryFindFile()`; resolution walks up from the script folder to `scripts_files/<path>`.

## prototypes/ — usage

- **index.ts** — imports `./number`, `./bigint`, `./array` (add math if needed).
- In scripts: `import "github.com/octarine-public/wrapper/prototypes/bigint"` (etc.) — extensions for Number, BigInt, Array, Math in Octarine runtime.

## wrapper/ — where to look

| Goal | Where |
|------|--------|
| Base types (Vector, Color, AABB, Particle, …) | `wrapper/Base/` |
| Base classes for abilities/items/modifiers | `wrapper/Objects/Base/` (Ability.ts, Building.ts, Creep.ts, …) |
| Enums (ability behavior, targets, runes, damage, etc.) | `wrapper/Enums/` (PascalCase or UPPER_SNAKE file names) |
| Engine native calls | `wrapper/Native/` |
| Abilities | `wrapper/Objects/Abilities/` — subfolders by owner in PascalCase (hero/unit: Axe, Invoker, Courier, Roshan, …), ability files inside (file name = ability id); shared in `Abilities/Base/` |
| Items | `wrapper/Objects/Items/` — flat set of `item_*.ts` files |
| Modifiers | `wrapper/Objects/Modifiers/` — subfolders: **Abilities**, **Base**, **Buildings**, **Items**, **Runes**; files `modifier_*.ts` |
| Heroes, creeps, units, buildings | `wrapper/Objects/Heroes/`, `Creeps/`, `Units/`, `Buildings/` |
| Unit data, inventory, modifier state | `wrapper/Objects/DataBook/` |
| GUI, menu, managers | `wrapper/GUI/`, `wrapper/Menu/`, `wrapper/Managers/` |
| Utils and helpers | `wrapper/Utils/`, `wrapper/Helpers/` |
| Resource parsing (EntityLump, GNV, Material, TRMP) | `wrapper/Resources/` |
| Tests | `wrapper/Tests/` (Abilities.ts, Modifiers.ts, Units.ts) |

## Stack and conventions

- **Language:** TypeScript 5.x, strict, ESNext. ESLint + Prettier.
- **Package:** yarn; `check-types`, `lint`, `check-circular` (madge). Config: `tsconfig.json`, `eslint.config.mjs`, `package.json` at root.
- **Naming:** Entity files = game id: `item_aghanims_shard.ts`, `modifier_rune_haste.ts`; classes = PascalCase from id (ItemAghanimsShard, ModifierRuneHaste). New abilities go in `Objects/Abilities/<Owner>/` (PascalCase folder: Axe, Invoker, Courier, Base for shared); new modifiers in `Objects/Modifiers/Abilities|Items|Base|Runes` by meaning.
- **Commits:** Conventional Commits (`feat(scope): message`, `fix(scope): message`, …).
