import { parseKVFile, parseEnumString } from "../../Utils/Utils"
import { ArmorType } from "../../Enums/ArmorType"
import { AttackDamageType } from "../../Enums/AttackDamageType"
import { DOTAHullSize } from "../../Enums/DOTAHullSize"

function LoadUnitFile(path: string): RecursiveMap {
	const kv = parseKVFile(path)
	const ret = (kv.get("DOTAUnits") as RecursiveMap) ?? (kv.get("DOTAHeroes") as RecursiveMap) ?? new Map()
	if (ret.has("Version")) {
		const Version = ret.get("Version")
		if (typeof Version === "string" || typeof Version === "number")
			if (Version.toString() !== "1") // unknown version, skip it
				return new Map()
		ret.delete("Version")
	}
	return ret
}

export default class UnitData {
	public static global_storage = new Map<string, UnitData>()
	public static empty = new UnitData("", new Map())
	public static unit_names_sorted: string[] = []
	public static GetUnitNameByNameIndex(index: number): Nullable<string> {
		// it should be much better for V8 to not try to make hits outside of array
		if (index < 0 || UnitData.unit_names_sorted.length <= index)
			return undefined
		return UnitData.unit_names_sorted[index]
	}
	public static GetHeroID(name: string): number {
		const data = UnitData.global_storage.get(name)
		if (data === undefined)
			throw `Unknown unit name: ${name}`
		return data.HeroID
	}
	public static GetHeroNameByID(id: number): string {
		for (const [name, data] of UnitData.global_storage)
			if (data.HeroID === id)
				return name
		return ""
	}

	public readonly HeroID: number
	public readonly ModelName: string
	public readonly MovementTurnRate: number
	public readonly AttackAnimationPoint: number
	public readonly ProjectileSpeed: number
	public readonly AttackDamageType: AttackDamageType
	public readonly ArmorType: ArmorType
	public readonly BoundsHull: DOTAHullSize
	public readonly RingRadius: number
	public readonly MinimapIcon: string
	public readonly MinimapIconSize: number
	public readonly HasInventory: boolean
	public readonly HealthBarOffset: number

	constructor(name: string, m_Storage: RecursiveMap) {
		this.HeroID = m_Storage.has("HeroID")
			? parseInt(m_Storage.get("HeroID") as string)
			: 0
		this.ModelName = (m_Storage.get("Model") as string) ?? "models/dev/error.vmdl"
		this.MovementTurnRate = m_Storage.has("MovementTurnRate")
			? parseFloat(m_Storage.get("MovementTurnRate") as string)
			: 0
		this.AttackAnimationPoint = m_Storage.has("AttackAnimationPoint")
			? parseFloat(m_Storage.get("AttackAnimationPoint") as string)
			: 0
		this.ProjectileSpeed = m_Storage.has("ProjectileSpeed")
			? parseInt(m_Storage.get("ProjectileSpeed") as string)
			: 0
		this.AttackDamageType = m_Storage.has("CombatClassAttack")
			? parseInt(m_Storage.get("CombatClassAttack") as string)
			: AttackDamageType.Basic
		this.ArmorType = m_Storage.has("CombatClassDefend")
			? parseInt(m_Storage.get("CombatClassDefend") as string)
			: ArmorType.Basic
		this.BoundsHull = m_Storage.has("BoundsHullName")
			? parseEnumString(DOTAHullSize, m_Storage.get("BoundsHullName") as string)
			: DOTAHullSize.DOTA_HULL_SIZE_HERO
		this.RingRadius = m_Storage.has("RingRadius")
			? parseInt(m_Storage.get("RingRadius") as string)
			: 70
		this.MinimapIcon = (m_Storage.get("MinimapIcon") as string) ?? name
		this.MinimapIconSize = m_Storage.has("MinimapIconSize")
			? parseInt(m_Storage.get("MinimapIconSize") as string)
			: -1
		this.HasInventory = m_Storage.has("HasInventory")
			? parseInt(m_Storage.get("HasInventory") as string) !== 0
			: true
		this.HealthBarOffset = m_Storage.has("HealthBarOffset")
			? parseInt(m_Storage.get("HealthBarOffset") as string)
			: 200
	}
}

function FixUnitInheritance(units_map: RecursiveMap, fixed_cache: RecursiveMap, map: RecursiveMap, unit_name: string): RecursiveMap {
	if (fixed_cache.has(unit_name))
		return fixed_cache.get(unit_name) as RecursiveMap
	if (unit_name === "npc_dota_hero_base")
		map.set("BaseClass", "npc_dota_units_base")
	if (map.has("BaseClass")) {
		const base_name = map.get("BaseClass")
		if (typeof base_name === "string" && base_name !== unit_name) {
			const base_map = units_map.get(base_name)
			if (base_map instanceof Map) {
				const fixed_base_map = FixUnitInheritance(units_map, fixed_cache, base_map, base_name)
				fixed_base_map.forEach((v, k) => {
					if (!map.has(k))
						map.set(k, v)
				})
			}
		}
	}
	fixed_cache.set(unit_name, map)
	UnitData.global_storage.set(unit_name, new UnitData(unit_name, map))
	return map
}

export function ReloadGlobalUnitStorage() {
	UnitData.global_storage.clear()
	const parsed_heroes = new Map([
		...LoadUnitFile("scripts/npc/npc_heroes.txt"),
		...LoadUnitFile("scripts/npc/npc_heroes_staging.txt"),
		...LoadUnitFile("scripts/npc/npc_heroes_custom.txt"),
	])
	{ // Ask Valve about this, not me. It's used for building unit names indexes
		const elem = parsed_heroes.get("npc_dota_hero_base")
		if (elem !== undefined) {
			parsed_heroes.delete("npc_dota_hero_base")
			parsed_heroes.set("npc_dota_hero_base", elem)
			parsed_heroes.set("UnitSchemaFixedUp", 1)
		}
	}
	const units_map = new Map([
		...parsed_heroes.entries(),
		...LoadUnitFile("scripts/npc/npc_units.txt"),
		...LoadUnitFile("scripts/npc/npc_units_staging.txt"),
		...LoadUnitFile("scripts/npc/npc_units_custom.txt"),
	]) as RecursiveMap
	const fixed_cache: RecursiveMap = new Map()
	units_map.forEach((map, unit_name) => {
		if (map instanceof Map)
			FixUnitInheritance(units_map, fixed_cache, map, unit_name)
	})

	UnitData.unit_names_sorted = [...units_map.keys()]
}
ReloadGlobalUnitStorage()
