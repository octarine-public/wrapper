# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**octarine-wrapper** is a TypeScript wrapper/SDK for Dota 2 (Octarine). It provides a typed API for abilities, items, modifiers, units, heroes, GUI, managers, and utilities. This is not a standalone runtime — it defines types and helpers consumed by in-game scripts running inside the Octarine engine.

## Commands

```bash
yarn install              # Install dependencies
yarn check-types          # Type-check (tsc strict mode, no emit)
yarn check-types-watch    # Type-check in watch mode
yarn lint                 # ESLint + Prettier with auto-fix
yarn check-circular       # Detect circular dependencies (madge)
```

CI runs `check-types` then `lint` on pushes/PRs to `master` and `dev`.

## Code Style

- **Tabs** (width 4), **double quotes**, **no semicolons**, **90-char line length**
- Trailing commas: none. Arrow parens: avoided when possible.
- Explicit accessibility modifiers on class members (except constructors).
- Import ordering enforced by `simple-import-sort`.
- Full config: `eslint.config.mjs` (flat config format).

## Architecture

### Entry Point

`index.ts` → imports `global.ts` (prototype extensions) and `translations.ts`, then re-exports everything from `wrapper/Imports.ts`.

### wrapper/Imports.ts

Master re-export file (~3400 lines). All public API surfaces are exported here. When adding new classes, register them in this file.

### Decorator System (wrapper/Decorators.ts)

Classes are registered to the engine via decorators:
- `@WrapperClass("game_class_name")` — registers an Entity subclass by its engine class name
- `@WrapperClassModifier("modifier_name")` — registers a Modifier subclass
- `@NetworkedBasicField("m_fieldName")` — maps an engine networked property to a class field, with optional type reencoding

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `wrapper/Objects/Base/` | Base classes: Entity, Ability, Item, Modifier, Unit, Building, Creep, Hero |
| `wrapper/Objects/Abilities/` | Ability implementations, organized by owner (PascalCase folders: `Axe/`, `Invoker/`, `Courier/`); shared logic in `Abilities/Base/` |
| `wrapper/Objects/Items/` | Item implementations, flat `item_*.ts` files |
| `wrapper/Objects/Modifiers/` | Modifier implementations in subfolders: `Abilities/`, `Items/`, `Buildings/`, `Runes/`, `Base/` |
| `wrapper/Managers/` | Core managers: EventsSDK, EntityManager, InputManager, ParticleManager, PathfinderSDK |
| `wrapper/Native/` | Engine API wrappers: CameraSDK, ExecuteOrder, RendererSDK, SoundSDK |
| `wrapper/Enums/` | Game enums (BigInt flags pattern for bitfields like `DOTA_ABILITY_BEHAVIOR`) |
| `wrapper/Base/` | Value types: Vector2, Vector3, Vector4, Color, AABB, QAngle, Rectangle, Matrix3x4, Quaternion |
| `wrapper/GUI/` | GUI components (CLowerHUD, CMinimap, CShop) |
| `prototypes/` | JS built-in extensions (Number, BigInt, Array, Math) for in-game runtime |
| `scripts_files/` | Static assets (images, materials, models, particles, translations) |

### Naming Conventions

- **Entity files** use game IDs: `item_aghanims_shard.ts`, `modifier_rune_haste.ts`, `abaddon_aphotic_shield.ts`
- **Classes** use PascalCase derived from the game ID: `item_aghanims_shard` → class `item_aghanims_shard extends Item`
- **Folders** for hero abilities use PascalCase: `Abilities/Axe/`, `Abilities/Invoker/`
- **Constants/enums**: UPPER_CASE. **Private members**: leading underscore `_member`.

### Adding New Game Objects

**New ability:** Create `wrapper/Objects/Abilities/<HeroName>/<ability_id>.ts`, extend `Ability` (or a shared base from `Abilities/Base/`), apply `@WrapperClass("ability_id")`, and add the export to `wrapper/Imports.ts`.

**New item:** Create `wrapper/Objects/Items/item_<name>.ts`, extend `Item`, apply `@WrapperClass("item_<name>")`, and add to `wrapper/Imports.ts`.

**New modifier:** Create in the appropriate `wrapper/Objects/Modifiers/<context>/` subfolder, extend `Modifier`, apply `@WrapperClassModifier("modifier_name")`, and add to `wrapper/Imports.ts`.

## Commits

Use Conventional Commits format: `feat(scope): message`, `fix(scope): message`, `refactor:`, `chore:`, etc.
