import { ArmorType } from "../../Enums/ArmorType"
import { AttackDamageType } from "../../Enums/AttackDamageType"
import { Attributes } from "../../Enums/Attributes"
import { DOTAHullSize } from "../../Enums/DOTAHullSize"
import { DOTAUnitMoveCapability } from "../../Enums/DOTAUnitMoveCapability"
import {
	MapValueToBoolean,
	MapValueToNumber,
	MapValueToString
} from "../../Resources/ParseUtils"
import { createMapFromMergedIterators, parseEnumString } from "../../Utils/Utils"

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

export interface IFacetAbilityData {
	AbilityName: string
	AbilityIndex: number
	ReplaceAbility: string
	AutoLevelAbility: boolean
}

export interface IFacetData {
	Name: string
	Abilities: IFacetAbilityData[]
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
	public static GetUnitDataByName(name: string): Nullable<UnitData> {
		return UnitData.globalStorage.get(name)
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
	public readonly BaseMovementSpeed: number
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
	public readonly Facets: IFacetData[] = []
	public readonly AttackSpeedActivityModifiers: [number, string][] = []
	public readonly MovementSpeedActivityModifiers: [number, string][] = []
	public readonly AttackRangeActivityModifiers: [number, string][] = []

	constructor(name: string, kv: RecursiveMap) {
		this.HeroID = kv.has("HeroID") ? this.parseInt(kv.get("HeroID") as string) : 0
		this.ModelName = (kv.get("Model") as string) ?? "models/dev/error.vmdl"

		this.MovementTurnRate = kv.has("MovementTurnRate")
			? this.parseFloat(kv.get("MovementTurnRate") as string)
			: 0
		this.AttackAnimationPoint = kv.has("AttackAnimationPoint")
			? this.parseFloat(kv.get("AttackAnimationPoint") as string)
			: 0
		this.AttackAcquisitionRange = kv.has("AttackAcquisitionRange")
			? this.parseInt(kv.get("AttackAcquisitionRange") as string)
			: 0
		this.BaseAttackRange = kv.has("AttackRange")
			? this.parseInt(kv.get("AttackRange") as string)
			: 0
		this.ProjectileSpeed = kv.has("ProjectileSpeed")
			? this.parseInt(kv.get("ProjectileSpeed") as string)
			: 0
		this.BaseAttackTime = kv.has("AttackRate")
			? this.parseFloat(kv.get("AttackRate") as string)
			: 0
		this.BaseMovementSpeed = kv.has("MovementSpeed")
			? this.parseFloat(kv.get("MovementSpeed") as string)
			: 0
		this.BaseAttackSpeed = kv.has("BaseAttackSpeed")
			? this.parseFloat(kv.get("BaseAttackSpeed") as string)
			: 0
		this.MovementCapabilities = kv.has("MovementCapabilities")
			? parseEnumString(
					DOTAUnitMoveCapability,
					kv.get("MovementCapabilities") as string,
					0
				)
			: DOTAUnitMoveCapability.DOTA_UNIT_CAP_MOVE_GROUND
		this.AttackDamageType = kv.has("CombatClassAttack")
			? FixCombatClassAttack(
					parseEnumString(
						DOTA_COMBAT_CLASS_ATTACK,
						kv.get("CombatClassAttack") as string,
						0
					)
				)
			: AttackDamageType.Basic
		this.ArmorType = kv.has("CombatClassDefend")
			? FixCombatClassDefend(
					parseEnumString(
						DOTA_COMBAT_CLASS_DEFEND,
						kv.get("CombatClassDefend") as string,
						0
					)
				)
			: ArmorType.Basic
		const boundsHull = kv.has("BoundsHullName")
			? parseEnumString(
					DOTAHullSize,
					kv.get("BoundsHullName") as string,
					DOTAHullSize.DOTA_HULL_SIZE_NONE
				)
			: DOTAHullSize.DOTA_HULL_SIZE_HERO
		switch (boundsHull) {
			case DOTAHullSize.DOTA_HULL_SIZE_SMALLEST:
				this.HullRadius = 2
				this.CollisionPadding = 2
				break
			case DOTAHullSize.DOTA_HULL_SIZE_SMALL:
				this.HullRadius = 8
				this.CollisionPadding = 10
				break
			case DOTAHullSize.DOTA_HULL_SIZE_REGULAR:
				this.HullRadius = 16
				this.CollisionPadding = 20
				break
			case DOTAHullSize.DOTA_HULL_SIZE_HERO:
				this.HullRadius = 24
				this.CollisionPadding = 3
				break
			case DOTAHullSize.DOTA_HULL_SIZE_BIG_HERO:
				this.HullRadius = 40
				this.CollisionPadding = 3
				break
			case DOTAHullSize.DOTA_HULL_SIZE_SIEGE:
				this.HullRadius = 16
				this.CollisionPadding = 24
				break
			case DOTAHullSize.DOTA_HULL_SIZE_TOWER:
				this.HullRadius = 144
				this.CollisionPadding = 0
				break
			case DOTAHullSize.DOTA_HULL_SIZE_LARGE:
				this.HullRadius = 40
				this.CollisionPadding = 1
				break
			case DOTAHullSize.DOTA_HULL_SIZE_HUGE:
				this.HullRadius = 80
				this.CollisionPadding = 0
				break
			case DOTAHullSize.DOTA_HULL_SIZE_BUILDING:
				this.HullRadius = 0
				this.CollisionPadding = 16
				break
			case DOTAHullSize.DOTA_HULL_SIZE_BARRACKS:
				this.HullRadius = 144
				this.CollisionPadding = 16
				break
			case DOTAHullSize.DOTA_HULL_SIZE_FILLER:
				this.HullRadius = 96
				this.CollisionPadding = 16
				break
			default: {
				this.HullRadius = 0
				this.CollisionPadding = 0
				console.log("Unknown bounds hull size:", boundsHull, "Name:", name)
				break
			}
		}
		this.ProjectileCollisionSize = kv.has("ProjectileCollisionSize")
			? this.parseInt(kv.get("ProjectileCollisionSize") as string)
			: 0
		this.RingRadius = kv.has("RingRadius")
			? this.parseInt(kv.get("RingRadius") as string)
			: 70
		this.MinimapIcon = (kv.get("MinimapIcon") as string) ?? name
		this.MinimapIconSize = kv.has("MinimapIconSize")
			? this.parseInt(kv.get("MinimapIconSize") as string)
			: -1
		this.HasInventory = kv.has("HasInventory")
			? this.parseInt(kv.get("HasInventory") as string) !== 0
			: true
		this.HealthBarOffset = kv.has("HealthBarOffset")
			? this.parseInt(kv.get("HealthBarOffset") as string)
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
			? parseEnumString(Attributes, kv.get("AttributePrimary") as string, 0)
			: Attributes.DOTA_ATTRIBUTE_STRENGTH
		this.ArmorPhysical = kv.has("ArmorPhysical")
			? this.parseFloat(kv.get("ArmorPhysical") as string)
			: 0
		this.MagicalResistance = kv.has("MagicalResistance")
			? this.parseFloat(kv.get("MagicalResistance") as string)
			: 0
		if (kv.has("AttackSpeedActivityModifiers")) {
			const m = kv.get("AttackSpeedActivityModifiers")
			if (m instanceof Map) {
				m.forEach((v, k) => {
					if (typeof v === "string") {
						this.AttackSpeedActivityModifiers.push([this.parseFloat(v), k])
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

		if (kv.has("Facets")) {
			const m = kv.get("Facets")
			if (m instanceof Map) {
				m.forEach((v, k) => {
					const facetData: IFacetData = {
						Name: k,
						Abilities: []
					}
					if (v instanceof Map) {
						const abilitiesMap = v.get("Abilities")
						if (abilitiesMap instanceof Map) {
							abilitiesMap.forEach((v2, k2) => {
								if (k2.startsWith("Ability") && v2 instanceof Map) {
									const abilityData: IFacetAbilityData = {
										AbilityName: MapValueToString(
											v2.get("AbilityName")
										),
										AbilityIndex: MapValueToNumber(
											v2.get("AbilityIndex"),
											-1
										),
										ReplaceAbility: MapValueToString(
											v2.get("ReplaceAbility")
										),
										AutoLevelAbility: MapValueToBoolean(
											v2.get("AutoLevelAbility")
										)
									}
									facetData.Abilities.push(abilityData)
								}
							})
						}
					}
					this.Facets.push(facetData)
				})
			}
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

	private parseFloat(str: string): number {
		return str !== "" ? parseFloat(str) : 0
	}

	private parseInt(str: string): number {
		return str !== "" ? parseInt(str) : 0
	}
}

const uniqueBaseClassName = new Set([
	"npc_dota_creep",
	"npc_dota_creep_lane",
	"npc_dota_creep_siege",
	"npc_dota_creep_neutral",
	"npc_dota_brewmaster_void",
	"npc_dota_brewmaster_fire",
	"npc_dota_brewmaster_earth",
	"npc_dota_brewmaster_storm",
	"npc_dota_lone_druid_bear",
	"npc_dota_visage_familiar",
	"npc_dota_unit_warlock_imp",
	"npc_dota_venomancer_plagueward",
	"npc_dota_broodmother_spiderling",
	"npc_dota_shadowshaman_serpentward"
])

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

const debugUniqueBaseClass = false
function HasUniqueBaseClass(map: RecursiveMap, unitName: string): boolean {
	if (!map.has("BaseClass")) {
		return false
	}
	const className = map.get("BaseClass")
	if (typeof className !== "string" || className === "") {
		return false
	}
	if (unitName === className) {
		return true
	}
	if (debugUniqueBaseClass) {
		if (!uniqueBaseClassName.has(className) && className !== unitName) {
			console.error(`Unit ${unitName} has unknown base class ${className}`)
		}
	}
	return uniqueBaseClassName.has(className)
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

function FixUnitInheritance(
	unitsMap: RecursiveMap,
	fixedCache: RecursiveMap,
	map: RecursiveMap,
	unitName: string
): RecursiveMap {
	if (fixedCache.has(unitName)) {
		return fixedCache.get(unitName) as RecursiveMap
	}
	if (unitName === "npc_dota_hero_base" || unitName === "npc_dota_warlock_golem") {
		map.set("BaseClass", "npc_dota_units_base")
	} else if (unitName.startsWith("npc_dota_hero_") && !map.has("BaseClass")) {
		map.set("BaseClass", "npc_dota_hero_base")
	} else if (HasUniqueBaseClass(map, unitName)) {
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
			if (elem instanceof Map) {
				parsedHeroes.delete("npc_dota_hero_base")
				parsedHeroes.forEach(hero => {
					if (hero instanceof Map) {
						// TODO: copy sub-maps?
						elem.forEach((v, k) => {
							if (!hero.has(k)) {
								hero.set(k, v)
							}
						})
					}
				})
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
