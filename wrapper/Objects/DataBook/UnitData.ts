import { ArmorType } from "../../Enums/ArmorType"
import { AttackDamageType } from "../../Enums/AttackDamageType"
import { Attributes } from "../../Enums/Attributes"
import { DOTAHullSize } from "../../Enums/DOTAHullSize"
import { DOTAUnitMoveCapability } from "../../Enums/DOTAUnitMoveCapability"
import { createMapFromMergedIterators, parseEnumString } from "../../Utils/Utils"

function LoadUnitFile(path: string): RecursiveMap {
	const kv = parseKV(path)
	const ret =
		(kv.get("DOTAUnits") as RecursiveMap) ??
		(kv.get("DOTAHeroes") as RecursiveMap) ??
		new Map()
	if (ret.has("Version")) {
		const version = ret.get("Version")
		if (typeof version === "string" || typeof version === "number") {
			if (version !== "1" && version !== 1) {
				// unknown version, skip it
				return new Map()
			}
		}
		ret.delete("Version")
	}
	return ret
}

enum DOTA_COMBAT_CLASS_ATTACK {
	DOTA_COMBAT_CLASS_ATTACK_BASIC,
	DOTA_COMBAT_CLASS_ATTACK_HERO,
	DOTA_COMBAT_CLASS_ATTACK_PIERCE,
	DOTA_COMBAT_CLASS_ATTACK_SIEGE
}
enum DOTA_COMBAT_CLASS_DEFEND {
	DOTA_COMBAT_CLASS_DEFEND_BASIC,
	DOTA_COMBAT_CLASS_DEFEND_HERO,
	DOTA_COMBAT_CLASS_DEFEND_STRUCTURE
}

function FixCombatClassAttack(type: DOTA_COMBAT_CLASS_ATTACK): AttackDamageType {
	switch (type) {
		default:
		case DOTA_COMBAT_CLASS_ATTACK.DOTA_COMBAT_CLASS_ATTACK_BASIC:
			return AttackDamageType.Basic
		case DOTA_COMBAT_CLASS_ATTACK.DOTA_COMBAT_CLASS_ATTACK_HERO:
			return AttackDamageType.Hero
		case DOTA_COMBAT_CLASS_ATTACK.DOTA_COMBAT_CLASS_ATTACK_PIERCE:
			return AttackDamageType.Pierce
		case DOTA_COMBAT_CLASS_ATTACK.DOTA_COMBAT_CLASS_ATTACK_SIEGE:
			return AttackDamageType.Siege
	}
}
function FixCombatClassDefend(type: DOTA_COMBAT_CLASS_DEFEND): ArmorType {
	switch (type) {
		default:
		case DOTA_COMBAT_CLASS_DEFEND.DOTA_COMBAT_CLASS_DEFEND_BASIC:
			return ArmorType.Basic
		case DOTA_COMBAT_CLASS_DEFEND.DOTA_COMBAT_CLASS_DEFEND_HERO:
			return ArmorType.Hero
		case DOTA_COMBAT_CLASS_DEFEND.DOTA_COMBAT_CLASS_DEFEND_STRUCTURE:
			return ArmorType.Structure
	}
}

export class UnitData {
	public static globalStorage: Map<string, UnitData> = new Map()
	public static empty = new UnitData("", new Map())
	public static unitNamesSorted: string[] = []
	public static GetUnitNameByNameIndex(index: number): Nullable<string> {
		const unitNamesSorted = UnitData.unitNamesSorted
		// it should be much better for V8 to not try to make hits outside of array
		if (index < 0 || unitNamesSorted.length <= index) {
			return undefined
		}
		return unitNamesSorted[index]
	}
	public static GetHeroID(name: string): number {
		const data = UnitData.globalStorage.get(name)
		if (data === undefined) {
			throw `Unknown unit name: ${name}`
		}
		return data.HeroID
	}
	public static GetHeroNameByID(id: number): string {
		for (const [name, data] of UnitData.globalStorage) {
			if (data.HeroID === id) {
				return name
			}
		}
		return ""
	}
	public static GetHeroAttributePrimary(name: string): Attributes {
		const data = UnitData.globalStorage.get(name)
		if (data === undefined) {
			throw `Unknown unit name: ${name}`
		}
		return data.AttributePrimary
	}

	public readonly HeroID: number
	public readonly ModelName: string
	public readonly MovementTurnRate: number
	public readonly AttackAcquisitionRange: number
	public readonly BaseAttackRange: number
	public readonly BaseAttackTime: number
	public readonly BaseAttackSpeed: number
	public readonly AttackAnimationPoint: number
	public readonly ProjectileSpeed: number
	public readonly AttackDamageType: AttackDamageType
	public readonly ArmorType: ArmorType
	public readonly HullRadius: number
	public readonly CollisionPadding: number
	public readonly ProjectileCollisionSize: number
	public readonly RingRadius: number
	public readonly MinimapIcon: string
	public readonly MinimapIconSize: number
	public readonly HasInventory: boolean
	public readonly HealthBarOffset: number
	public readonly WorkshopName: string
	public readonly AttributePrimary: Attributes
	public readonly MovementCapabilities: DOTAUnitMoveCapability
	public readonly ArmorPhysical: number
	public readonly MagicalResistance: number
	public readonly Abilities = new Map<string, boolean>()
	public readonly AttackSpeedActivityModifiers: [number, string][] = []
	public readonly MovementSpeedActivityModifiers: [number, string][] = []
	public readonly AttackRangeActivityModifiers: [number, string][] = []

	constructor(name: string, kv: RecursiveMap) {
		this.HeroID = kv.has("HeroID") ? parseInt(kv.get("HeroID") as string) : 0
		this.ModelName = (kv.get("Model") as string) ?? "models/dev/error.vmdl"
		this.MovementTurnRate = kv.has("MovementTurnRate")
			? parseFloat(kv.get("MovementTurnRate") as string)
			: 0
		this.AttackAnimationPoint = kv.has("AttackAnimationPoint")
			? parseFloat(kv.get("AttackAnimationPoint") as string)
			: 0
		this.AttackAcquisitionRange = kv.has("AttackAcquisitionRange")
			? parseInt(kv.get("AttackAcquisitionRange") as string)
			: 0
		this.BaseAttackRange = kv.has("AttackRange")
			? parseInt(kv.get("AttackRange") as string)
			: 0
		this.ProjectileSpeed = kv.has("ProjectileSpeed")
			? parseInt(kv.get("ProjectileSpeed") as string)
			: 0
		this.BaseAttackTime = kv.has("AttackRate")
			? parseFloat(kv.get("AttackRate") as string)
			: 0
		this.BaseAttackSpeed = kv.has("BaseAttackSpeed")
			? parseFloat(kv.get("BaseAttackSpeed") as string)
			: 0
		this.MovementCapabilities = kv.has("MovementCapabilities")
			? parseEnumString(
					DOTAUnitMoveCapability,
					kv.get("MovementCapabilities") as string
			  )
			: DOTAUnitMoveCapability.DOTA_UNIT_CAP_MOVE_GROUND
		this.AttackDamageType = kv.has("CombatClassAttack")
			? FixCombatClassAttack(
					parseEnumString(
						DOTA_COMBAT_CLASS_ATTACK,
						kv.get("CombatClassAttack") as string
					)
			  )
			: AttackDamageType.Basic
		this.ArmorType = kv.has("CombatClassDefend")
			? FixCombatClassDefend(
					parseEnumString(
						DOTA_COMBAT_CLASS_DEFEND,
						kv.get("CombatClassDefend") as string
					)
			  )
			: ArmorType.Basic
		const boundsHull = kv.has("BoundsHullName")
			? parseEnumString(DOTAHullSize, kv.get("BoundsHullName") as string)
			: DOTAHullSize.DOTA_HULL_SIZE_HERO
		switch (boundsHull) {
			case DOTAHullSize.DOTA_HULL_SIZE_SMALL:
				this.HullRadius = 8
				this.CollisionPadding = 10
				break
			case DOTAHullSize.DOTA_HULL_SIZE_REGULAR:
				this.HullRadius = 16
				this.CollisionPadding = 20
				break
			case DOTAHullSize.DOTA_HULL_SIZE_SIEGE:
				this.HullRadius = 16
				this.CollisionPadding = 24
				break
			default:
			case DOTAHullSize.DOTA_HULL_SIZE_HERO:
				this.HullRadius = 24
				this.CollisionPadding = 3
				break
			case DOTAHullSize.DOTA_HULL_SIZE_HUGE:
				this.HullRadius = 80
				this.CollisionPadding = 0
				break
			case DOTAHullSize.DOTA_HULL_SIZE_BUILDING:
				this.HullRadius = 0
				this.CollisionPadding = 16
				break
			case DOTAHullSize.DOTA_HULL_SIZE_FILLER:
				this.HullRadius = 96
				this.CollisionPadding = 16
				break
			case DOTAHullSize.DOTA_HULL_SIZE_BARRACKS:
				this.HullRadius = 144
				this.CollisionPadding = 16
				break
			case DOTAHullSize.DOTA_HULL_SIZE_TOWER:
				this.HullRadius = 144
				this.CollisionPadding = 0
				break
		}
		this.ProjectileCollisionSize = kv.has("ProjectileCollisionSize")
			? parseInt(kv.get("ProjectileCollisionSize") as string)
			: 0
		this.RingRadius = kv.has("RingRadius")
			? parseInt(kv.get("RingRadius") as string)
			: 70
		this.MinimapIcon = (kv.get("MinimapIcon") as string) ?? name
		this.MinimapIconSize = kv.has("MinimapIconSize")
			? parseInt(kv.get("MinimapIconSize") as string)
			: -1
		this.HasInventory = kv.has("HasInventory")
			? parseInt(kv.get("HasInventory") as string) !== 0
			: true
		this.HealthBarOffset = kv.has("HealthBarOffset")
			? parseInt(kv.get("HealthBarOffset") as string)
			: 200
		if (!kv.has("workshop_guide_name")) {
			if (name.startsWith("npc_")) {
				name = name.substring(4)
			}
			if (name.startsWith("dota_")) {
				name = name.substring(5)
			}
			if (name.startsWith("hero_")) {
				name = name.substring(5)
			}
			this.WorkshopName = name
				.split("_")
				.map(str => (str ? str[0].toUpperCase() + str.substring(1) : ""))
				.join(" ")
		} else {
			this.WorkshopName = kv.get("workshop_guide_name") as string
		}
		this.AttributePrimary = kv.has("AttributePrimary")
			? parseEnumString(Attributes, kv.get("AttributePrimary") as string)
			: Attributes.DOTA_ATTRIBUTE_STRENGTH
		this.ArmorPhysical = kv.has("ArmorPhysical")
			? parseFloat(kv.get("ArmorPhysical") as string)
			: 0
		this.MagicalResistance = kv.has("MagicalResistance")
			? parseFloat(kv.get("MagicalResistance") as string)
			: 0

		if (kv.has("AttackSpeedActivityModifiers")) {
			const m = kv.get("AttackSpeedActivityModifiers")
			if (m instanceof Map) {
				m.forEach((v, k) => {
					if (typeof v === "string") {
						this.AttackSpeedActivityModifiers.push([parseFloat(v), k])
					}
				})
			}
			this.AttackSpeedActivityModifiers.sort((a, b) => b[0] - a[0])
		}
		if (kv.has("MovementSpeedActivityModifiers")) {
			const m = kv.get("MovementSpeedActivityModifiers")
			if (m instanceof Map) {
				m.forEach((v, k) => {
					if (typeof v === "string") {
						this.MovementSpeedActivityModifiers.push([parseFloat(v), k])
					}
				})
			}
			this.MovementSpeedActivityModifiers.sort((a, b) => b[0] - a[0])
		}
		if (kv.has("AttackRangeActivityModifiers")) {
			const m = kv.get("AttackRangeActivityModifiers")
			if (m instanceof Map) {
				m.forEach((v, k) => {
					if (typeof v === "string") {
						this.AttackRangeActivityModifiers.push([parseFloat(v), k])
					}
				})
			}
			this.AttackRangeActivityModifiers.sort((a, b) => b[0] - a[0])
		}

		for (let index = 1; index < 17; index++) {
			const kvName = kv.get(`Ability${index}`) as Nullable<string>
			if (
				kvName === undefined ||
				kvName.length <= 0 ||
				kvName.startsWith("special_") ||
				kvName.includes("hidden")
			) {
				continue
			}
			this.Abilities.set(kvName, true)
		}
	}
}

function FixUnitInheritance(
	unitsMap: RecursiveMap,
	fixedCache: RecursiveMap,
	map: RecursiveMap,
	unitName: string
): RecursiveMap {
	if (fixedCache.has(unitName)) {
		return fixedCache.get(unitName) as RecursiveMap
	}
	if (unitName === "npc_dota_hero_base") {
		map.set("BaseClass", "npc_dota_units_base")
	} else if (unitName.startsWith("npc_dota_hero_") && !map.has("BaseClass")) {
		map.set("BaseClass", "npc_dota_hero_base")
	} else if (map.get("BaseClass") === "npc_dota_creep_lane") {
		map.set("BaseClass", "npc_dota_units_base")
	}
	if (map.has("BaseClass") || map.has("include_keys_from")) {
		const baseName = map.get("BaseClass") ?? map.get("include_keys_from")
		if (typeof baseName === "string" && baseName !== unitName) {
			const baseMap = unitsMap.get(baseName)
			if (baseMap instanceof Map) {
				const fixedBaseMap = FixUnitInheritance(
					unitsMap,
					fixedCache,
					baseMap,
					baseName
				)
				fixedBaseMap.forEach((v, k) => {
					if (!map.has(k)) {
						map.set(k, v)
					}
				})
			}
		}
	}
	fixedCache.set(unitName, map)
	UnitData.globalStorage.set(unitName, new UnitData(unitName, map))
	return map
}

export function ReloadGlobalUnitStorage() {
	UnitData.unitNamesSorted = []
	UnitData.globalStorage.clear()
	try {
		const parsedHeroes = createMapFromMergedIterators<string, RecursiveMapValue>(
			LoadUnitFile("scripts/npc/npc_heroes.txt").entries(),
			LoadUnitFile("scripts/npc/npc_heroes_staging.txt").entries(),
			LoadUnitFile("scripts/npc/npc_heroes_custom.txt").entries()
		)
		{
			// Ask Valve about this, not me. It's used for building unit names indexes
			const elem = parsedHeroes.get("npc_dota_hero_base")
			if (elem !== undefined) {
				parsedHeroes.delete("npc_dota_hero_base")
				parsedHeroes.set("npc_dota_hero_base", elem)
				parsedHeroes.set("UnitSchemaFixedUp", 1)
			}
		}
		const unitsMap = createMapFromMergedIterators<string, RecursiveMapValue>(
			parsedHeroes.entries(),
			LoadUnitFile("scripts/npc/npc_units.txt").entries(),
			LoadUnitFile("scripts/npc/npc_units_staging.txt").entries(),
			LoadUnitFile("scripts/npc/npc_units_custom.txt").entries()
		)
		const fixedCache: RecursiveMap = new Map()
		unitsMap.forEach((map, unitName) => {
			if (map instanceof Map) {
				FixUnitInheritance(unitsMap, fixedCache, map, unitName)
			}
		})
		UnitData.unitNamesSorted = [...unitsMap.keys()]
	} catch (e) {
		console.error("Error in ReloadGlobalUnitStorage", e)
	}
}
