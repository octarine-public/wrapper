import { ArmorType } from "../../Enums/ArmorType"
import { AttackDamageType } from "../../Enums/AttackDamageType"
import { Attributes } from "../../Enums/Attributes"
import { DOTAHullSize } from "../../Enums/DOTAHullSize"
import { DOTAUnitMoveCapability_t } from "../../Enums/DOTAUnitMoveCapability_t"
import { Workers } from "../../Native/Workers"
import { parseKVFile } from "../../Resources/ParseKV"
import { createMapFromMergedIterators, parseEnumString } from "../../Utils/Utils"

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

enum DOTA_COMBAT_CLASS_ATTACK {
	DOTA_COMBAT_CLASS_ATTACK_BASIC,
	DOTA_COMBAT_CLASS_ATTACK_HERO,
	DOTA_COMBAT_CLASS_ATTACK_PIERCE,
	DOTA_COMBAT_CLASS_ATTACK_SIEGE,
}
enum DOTA_COMBAT_CLASS_DEFEND {
	DOTA_COMBAT_CLASS_DEFEND_BASIC,
	DOTA_COMBAT_CLASS_DEFEND_HERO,
	DOTA_COMBAT_CLASS_DEFEND_STRUCTURE,
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
	public static global_storage: Promise<Map<string, UnitData>> = Promise.resolve(new Map())
	public static empty = new UnitData("", new Map())
	public static unit_names_sorted: Promise<string[]> = Promise.resolve([])
	public static async GetUnitNameByNameIndex(index: number): Promise<Nullable<string>> {
		const unit_names_sorted = await UnitData.unit_names_sorted
		// it should be much better for V8 to not try to make hits outside of array
		if (index < 0 || unit_names_sorted.length <= index)
			return undefined
		return unit_names_sorted[index]
	}
	public static async GetHeroID(name: string): Promise<number> {
		const data = (await UnitData.global_storage).get(name)
		if (data === undefined)
			throw `Unknown unit name: ${name}`
		return data.HeroID
	}
	public static async GetHeroNameByID(id: number): Promise<string> {
		for (const [name, data] of await UnitData.global_storage)
			if (data.HeroID === id)
				return name
		return ""
	}
	public static async GetHeroAttributePrimary(name: string): Promise<Attributes> {
		const data = (await UnitData.global_storage).get(name)
		if (data === undefined)
			throw `Unknown unit name: ${name}`
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
	public readonly MovementCapabilities: DOTAUnitMoveCapability_t
	public readonly ArmorPhysical: number
	public readonly MagicalResistance: number

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
		this.AttackAcquisitionRange = m_Storage.has("AttackAcquisitionRange")
			? parseInt(m_Storage.get("AttackAcquisitionRange") as string)
			: 0
		this.BaseAttackRange = m_Storage.has("AttackRange")
			? parseInt(m_Storage.get("AttackRange") as string)
			: 0
		this.ProjectileSpeed = m_Storage.has("ProjectileSpeed")
			? parseInt(m_Storage.get("ProjectileSpeed") as string)
			: 0
		this.BaseAttackTime = m_Storage.has("AttackRate")
			? parseFloat(m_Storage.get("AttackRate") as string)
			: 0
		this.BaseAttackSpeed = m_Storage.has("BaseAttackSpeed")
			? parseFloat(m_Storage.get("BaseAttackSpeed") as string)
			: 0
		this.MovementCapabilities = m_Storage.has("MovementCapabilities")
			? parseEnumString(DOTAUnitMoveCapability_t, m_Storage.get("MovementCapabilities") as string)
			: DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND
		this.AttackDamageType = m_Storage.has("CombatClassAttack")
			? FixCombatClassAttack(parseEnumString(DOTA_COMBAT_CLASS_ATTACK, m_Storage.get("CombatClassAttack") as string))
			: AttackDamageType.Basic
		this.ArmorType = m_Storage.has("CombatClassDefend")
			? FixCombatClassDefend(parseEnumString(DOTA_COMBAT_CLASS_DEFEND, m_Storage.get("CombatClassDefend") as string))
			: ArmorType.Basic
		const BoundsHull = m_Storage.has("BoundsHullName")
			? parseEnumString(DOTAHullSize, m_Storage.get("BoundsHullName") as string)
			: DOTAHullSize.DOTA_HULL_SIZE_HERO
		switch (BoundsHull) {
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
		this.ProjectileCollisionSize = m_Storage.has("ProjectileCollisionSize")
			? parseInt(m_Storage.get("ProjectileCollisionSize") as string)
			: 0
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
		if (!m_Storage.has("workshop_guide_name")) {
			if (name.startsWith("npc_"))
				name = name.substring(4)
			if (name.startsWith("dota_"))
				name = name.substring(5)
			if (name.startsWith("hero_"))
				name = name.substring(5)
			this.WorkshopName = name.split("_").map(str => str ? str[0].toUpperCase() + str.substring(1) : "").join(" ")
		} else
			this.WorkshopName = m_Storage.get("workshop_guide_name") as string
		this.AttributePrimary = m_Storage.has("AttributePrimary")
			? parseEnumString(Attributes, m_Storage.get("AttributePrimary") as string)
			: Attributes.DOTA_ATTRIBUTE_STRENGTH
		this.ArmorPhysical = m_Storage.has("ArmorPhysical")
			? parseFloat(m_Storage.get("ArmorPhysical") as string)
			: 0
		this.MagicalResistance = m_Storage.has("MagicalResistance")
			? parseFloat(m_Storage.get("MagicalResistance") as string)
			: 0
	}
}

function FixUnitInheritance(
	target_map: Map<string, UnitData>,
	units_map: RecursiveMap,
	fixed_cache: RecursiveMap,
	map: RecursiveMap,
	unit_name: string,
): RecursiveMap {
	if (fixed_cache.has(unit_name))
		return fixed_cache.get(unit_name) as RecursiveMap
	if (unit_name === "npc_dota_hero_base")
		map.set("BaseClass", "npc_dota_units_base")
	else if (unit_name.startsWith("npc_dota_hero_") && !map.has("BaseClass"))
		map.set("BaseClass", "npc_dota_hero_base")
	if (map.has("BaseClass") || map.has("include_keys_from")) {
		const base_name = map.get("BaseClass") ?? map.get("include_keys_from")
		if (typeof base_name === "string" && base_name !== unit_name) {
			const base_map = units_map.get(base_name)
			if (base_map instanceof Map) {
				const fixed_base_map = FixUnitInheritance(target_map, units_map, fixed_cache, base_map, base_name)
				fixed_base_map.forEach((v, k) => {
					if (!map.has(k))
						map.set(k, v)
				})
			}
		}
	}
	fixed_cache.set(unit_name, map)
	target_map.set(unit_name, new UnitData(unit_name, map))
	return map
}

export async function ReloadGlobalUnitStorage() {
	await UnitData.unit_names_sorted
	await UnitData.global_storage
	UnitData.global_storage = new Promise(resolve_global_storage => {
		UnitData.unit_names_sorted = new Promise(resolve_unit_names_sorted => {
			const target_map = new Map<string, UnitData>()
			Workers.CallRPCEndPoint("LoadGlobalUnitStorage", undefined)
				.then(data => {
					if (!Array.isArray(data))
						return
					const [global_storage_ipc, unit_names_sorted] = data
					if (!(global_storage_ipc instanceof Map && Array.isArray(unit_names_sorted)))
						return
					resolve_unit_names_sorted(unit_names_sorted as string[])
					const empty_map = new Map()
					global_storage_ipc.forEach((val, key) => target_map.set(
						key as string,
						Object.assign(new UnitData(key as string, empty_map), val),
					))
					resolve_global_storage(target_map)
				}, err => {
					console.error(err)
					resolve_unit_names_sorted([])
					resolve_global_storage(target_map)
				})
		})
	})
}

Workers.RegisterRPCEndPoint("LoadGlobalUnitStorage", async () => {
	const target_map = new Map()
	const parsed_heroes = createMapFromMergedIterators<string, RecursiveMapValue>(
		LoadUnitFile("scripts/npc/npc_heroes.txt").entries(),
		LoadUnitFile("scripts/npc/npc_heroes_staging.txt").entries(),
		LoadUnitFile("scripts/npc/npc_heroes_custom.txt").entries(),
	)
	{ // Ask Valve about this, not me. It's used for building unit names indexes
		const elem = parsed_heroes.get("npc_dota_hero_base")
		if (elem !== undefined) {
			parsed_heroes.delete("npc_dota_hero_base")
			parsed_heroes.set("npc_dota_hero_base", elem)
			parsed_heroes.set("UnitSchemaFixedUp", 1)
		}
	}
	const units_map = createMapFromMergedIterators<string, RecursiveMapValue>(
		parsed_heroes.entries(),
		LoadUnitFile("scripts/npc/npc_units.txt").entries(),
		LoadUnitFile("scripts/npc/npc_units_staging.txt").entries(),
		LoadUnitFile("scripts/npc/npc_units_custom.txt").entries(),
	)
	const fixed_cache: RecursiveMap = new Map()
	units_map.forEach((map, unit_name) => {
		if (map instanceof Map)
			FixUnitInheritance(target_map, units_map, fixed_cache, map, unit_name)
	})
	const ret = new Map<string, WorkerIPCType>()
	target_map.forEach((v, k) => ret.set(k, { ...v }))
	return [ret, [...units_map.keys()]]
})
