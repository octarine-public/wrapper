import { parseKVFile, parseEnumString } from "../../Utils/Utils"
import { ArmorType } from "../../Enums/ArmorType"
import { AttackDamageType } from "../../Enums/AttackDamageType"
import { DOTAHullSize } from "../../Enums/DOTAHullSize"

function LoadUnitFile(path: string): RecursiveMap {
	const kv = parseKVFile(path)
	return (kv.get("DOTAUnits") as RecursiveMap) ?? (kv.get("DOTAHeroes") as RecursiveMap) ?? new Map()
}

export default class UnitData {
	public static global_storage: Map<string, UnitData>
	public static empty = new UnitData("", new Map())
	public static GetHeroID(name: string): number {
		const data = UnitData.global_storage.get(name)
		if (data === undefined)
			throw `Unknown unit name: ${name}`
		return data.HeroID
	}
	public static GetHeroNameByID(id: number | string): string {
		for (let [name, data] of UnitData.global_storage)
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

	constructor(name: string, public readonly m_Storage: RecursiveMap) {
		this.HeroID = this.m_Storage.has("HeroID")
			? parseInt(this.m_Storage.get("HeroID") as string)
			: 0
		this.ModelName = (this.m_Storage.get("Model") as string) ?? "models/dev/error.vmdl"
		this.MovementTurnRate = this.m_Storage.has("MovementTurnRate")
			? parseFloat(this.m_Storage.get("MovementTurnRate") as string)
			: 0
		this.AttackAnimationPoint = this.m_Storage.has("AttackAnimationPoint")
			? parseFloat(this.m_Storage.get("AttackAnimationPoint") as string)
			: 0
		this.ProjectileSpeed = this.m_Storage.has("ProjectileSpeed")
			? parseInt(this.m_Storage.get("ProjectileSpeed") as string)
			: 0
		this.AttackDamageType = this.m_Storage.has("CombatClassAttack")
			? parseInt(this.m_Storage.get("CombatClassAttack") as string)
			: AttackDamageType.Basic
		this.ArmorType = this.m_Storage.has("CombatClassDefend")
			? parseInt(this.m_Storage.get("CombatClassDefend") as string)
			: ArmorType.Basic
		this.BoundsHull = this.m_Storage.has("BoundsHullName")
			? parseEnumString(DOTAHullSize, this.m_Storage.get("BoundsHullName") as string)
			: DOTAHullSize.DOTA_HULL_SIZE_HERO
		this.RingRadius = this.m_Storage.has("RingRadius")
			? parseInt(this.m_Storage.get("RingRadius") as string)
			: 70
		this.MinimapIcon = (this.m_Storage.get("MinimapIcon") as string) ?? name
		this.MinimapIconSize = this.m_Storage.has("MinimapIconSize")
			? parseInt(this.m_Storage.get("MinimapIconSize") as string)
			: -1
		this.HasInventory = this.m_Storage.has("HasInventory")
			? parseInt(this.m_Storage.get("HasInventory") as string) !== 0
			: true
		this.HealthBarOffset = this.m_Storage.has("HealthBarOffset")
			? parseInt(this.m_Storage.get("HealthBarOffset") as string)
			: 200
	}
}

export function ReloadGlobalUnitStorage() {
	UnitData.global_storage = new Map()
	const tmp = new Map([
		...LoadUnitFile("scripts/npc/npc_units.txt").entries(),
		...LoadUnitFile("scripts/npc/npc_units_custom.txt").entries(),
		...LoadUnitFile("scripts/npc/npc_heroes.txt").entries(),
		...LoadUnitFile("scripts/npc/npc_heroes_custom.txt").entries(),
	]) as RecursiveMap
	tmp.forEach((map, unit_name) => {
		if (!(map instanceof Map))
			return
		if (map.has("BaseClass")) {
			let base_name = map.get("BaseClass")
			if (typeof base_name === "string") {
				let base_map = tmp.get(base_name)
				if (base_map instanceof Map)
					base_map.forEach((v, k) => {
						if (!map.has(k))
							map.set(k, v)
					})
			}
		}
		UnitData.global_storage.set(unit_name, new UnitData(unit_name, map))
	})
}
ReloadGlobalUnitStorage()
