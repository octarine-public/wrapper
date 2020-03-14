import { parseKVFile, parseEnumString } from "../../Utils/Utils"
import { RecursiveMap } from "../../Utils/ParseKV"

function LoadAbilityFile(path: string): RecursiveMap {
	let res = parseKVFile(path).get("DOTAAbilities")
	return res instanceof Map ? res : new Map()
}

export default class AbilityData {
	public static global_storage: Map<string, RecursiveMap>
	public static GetAbilityID(name: string): number {
		let storage = AbilityData.global_storage.get(name)
		if (storage === undefined)
			throw "Invalid storage type for ability name " + name
		return storage.has("ID") ? parseInt(storage.get("ID") as string) : 0
	}
	public static GetAbilityTexturePath(name: string): string {
		let storage = AbilityData.global_storage.get(name)
		if (!(storage instanceof Map))
			throw "Invalid storage type for ability name " + name

		let is_item = name.startsWith("item_")
		let tex_name = (storage.get("AbilityTextureName") as string)
		if (tex_name === undefined || tex_name === "")
			tex_name = is_item ? name.substring(5) : name
		return is_item
			? `panorama/images/items/${tex_name}_png.vtex_c`
			: `panorama/images/spellicons/${tex_name}_png.vtex_c`
	}
	public static GetAbilityNameByID(id: number): string {
		let id_str = id.toString()
		for (let [name, map] of AbilityData.global_storage) {
			if (!(map instanceof Map))
				continue
			if (id_str === (map.get("ID") as string))
				return name
		}
		return ""
	}

	public readonly m_Storage: RecursiveMap
	public readonly AbilityBehavior: number // DOTA_ABILITY_BEHAVIOR bitmask
	public readonly AbilityType: ABILITY_TYPES
	public readonly MaxLevel: number
	public readonly TextureName: string
	public readonly TargetFlags: number // DOTA_UNIT_TARGET_FLAGS bitmask
	public readonly TargetTeam: number // DOTA_UNIT_TARGET_TEAM bitmask
	public readonly TargetType: number // DOTA_UNIT_TARGET_TYPE bitmask
	public readonly SharedCooldownName: string
	public readonly ModelName: string
	public readonly AlternateModelName: string
	// public readonly ItemRecipeName: string
	public readonly IsItem: boolean
	public readonly IsGrantedByScepter: boolean
	public readonly ID: number
	public readonly EffectName: string
	public readonly Cost: number
	public readonly DamageType: DAMAGE_TYPES
	// public readonly DispellableType: SPELL_DISPELLABLE_TYPES
	public readonly LevelsBetweenUpgrades: number
	public readonly RequiredLevel: number
	public readonly AbilityImmunityType: SPELL_IMMUNITY_TYPES
	public readonly ItemDisplayCharges: boolean
	public readonly ItemHideCharges: boolean
	private readonly SpecialValueCache = new Map<string, [number[], string | undefined]>()
	private readonly CastRangeCache: number[]
	private readonly ChannelTimeCache: number[]
	private readonly AbilityDamageCache: number[]
	private readonly CastPointCache: number[]
	private readonly AbilityChargesCache: number[]

	constructor(name: string) {
		{
			let storage = AbilityData.global_storage.get(name)
			this.m_Storage = storage instanceof Map ? storage : new Map()
		}
		this.AbilityBehavior = this.m_Storage.has("AbilityBehavior")
			? parseEnumString(DOTA_ABILITY_BEHAVIOR, this.m_Storage.get("AbilityBehavior") as string)
			: DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NONE
		this.AbilityType = this.m_Storage.has("AbilityType")
			? (ABILITY_TYPES as any)[(this.m_Storage.get("AbilityType") as string).substring(5)]
			: ABILITY_TYPES.ABILITY_TYPE_BASIC
		this.MaxLevel = this.m_Storage.has("MaxLevel")
			? parseInt(this.m_Storage.get("MaxLevel") as string)
			: this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ULTIMATE
				? 3
				: 4
		this.TextureName = this.m_Storage.has("AbilityTextureName")
			? this.m_Storage.get("AbilityTextureName") as string
			: name
		this.TargetFlags = this.m_Storage.has("AbilityUnitTargetFlags")
			? parseEnumString(DOTA_UNIT_TARGET_FLAGS, this.m_Storage.get("AbilityUnitTargetFlags") as string)
			: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
		this.TargetTeam = this.m_Storage.has("AbilityUnitTargetTeam")
			? parseEnumString(DOTA_UNIT_TARGET_TEAM, this.m_Storage.get("AbilityUnitTargetTeam") as string)
			: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE
		this.TargetType = this.m_Storage.has("AbilityUnitTargetType")
			? parseEnumString(DOTA_UNIT_TARGET_TYPE, this.m_Storage.get("AbilityUnitTargetType") as string)
			: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE
		this.SharedCooldownName = (this.m_Storage.get("AbilitySharedCooldown") as string) ?? name
		this.ModelName = (this.m_Storage.get("Model") as string) ?? ""
		this.AlternateModelName = (this.m_Storage.get("ModelAlternate") as string) ?? ""
		// this.ItemRecipeName = m_pAbilityData.m_pszItemRecipeName
		this.IsItem = name.startsWith("item_")
		this.IsGrantedByScepter = this.m_Storage.has("IsGrantedByScepter")
			? parseInt(this.m_Storage.get("IsGrantedByScepter") as string) !== 0
			: false
		this.ID = this.m_Storage.has("ID")
			? parseInt(this.m_Storage.get("ID") as string)
			: 0
		this.EffectName = (this.m_Storage.get("Effect") as string) ?? ""
		this.Cost = this.m_Storage.has("ItemCost")
			? parseInt(this.m_Storage.get("ItemCost") as string)
			: 0
		this.DamageType = this.m_Storage.has("AbilityUnitDamageType")
			? parseEnumString(DAMAGE_TYPES, this.m_Storage.get("AbilityUnitDamageType") as string)
			: DAMAGE_TYPES.DAMAGE_TYPE_NONE
		// this.DispellableType = this.m_pAbilityData.m_iAbilityDispellableType
		this.LevelsBetweenUpgrades = this.m_Storage.has("LevelsBetweenUpgrades")
			? parseInt(this.m_Storage.get("LevelsBetweenUpgrades") as string)
			: -1
		this.RequiredLevel = this.m_Storage.has("RequiredLevel")
			? parseInt(this.m_Storage.get("RequiredLevel") as string)
			: this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ULTIMATE
				? 6
				: 1
		this.AbilityImmunityType = this.m_Storage.has("SpellImmunityType")
			? parseEnumString(SPELL_IMMUNITY_TYPES, this.m_Storage.get("SpellImmunityType") as string)
			: SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_NONE
		this.ItemDisplayCharges = this.m_Storage.has("ItemDisplayCharges")
			? parseInt(this.m_Storage.get("ItemDisplayCharges") as string) !== 0
			: false
		this.ItemHideCharges = this.m_Storage.has("ItemHideCharges")
			? parseInt(this.m_Storage.get("ItemHideCharges") as string) !== 0
			: true
		this.CastRangeCache = this.GetLevelArray("AbilityCastRange")
		this.ChannelTimeCache = this.GetLevelArray("AbilityChannelTime")
		this.AbilityDamageCache = this.GetLevelArray("AbilityDamage")
		this.CastPointCache = this.GetLevelArray("AbilityCastPoint")
		this.AbilityChargesCache = this.GetLevelArray("AbilityCharges")
	}

	private CacheSpecialValue(name: string): Nullable<[number[], string | undefined]> {
		{
			let ar = this.SpecialValueCache.get(name)
			if (ar !== undefined)
				return ar
		}
		let AbilitySpecial = this.m_Storage.get("AbilitySpecial") as RecursiveMap
		if (AbilitySpecial === undefined)
			return undefined
		for (let special of AbilitySpecial.values()) {
			if (!(special instanceof Map) || !special.has(name))
				continue
			let str = special.get(name) as string
			// loop-optimizer: FORWARD
			let ar = str.split(" ").map(str => parseFloat(str.endsWith("f") ? str.substring(0, str.length - 1) : str))
			this.ExtendLevelArray(ar)
			let LinkedSpecialBonus = special.get("LinkedSpecialBonus")
			if (LinkedSpecialBonus instanceof Map)
				LinkedSpecialBonus = undefined
			let ar2 = [ar, LinkedSpecialBonus] as [number[], string | undefined]
			this.SpecialValueCache.set(name, ar2)
			return ar2
		}

		// there's no such special - prevent further tries to find it since cache is static
		let ar = [new Array<number>(this.MaxLevel).fill(0), undefined] as [number[], string | undefined]
		this.SpecialValueCache.set(name, ar)
		return ar
	}

	public GetSpecialValue(name: string, level = 0): number {
		level = Math.min(this.MaxLevel, level) - 1
		if (level < 0)
			return 0

		let ar = this.CacheSpecialValue(name)
		if (ar === undefined)
			return 0
		return ar[0][level]
	}

	public GetLinkedSpecialBonus(name: string): string | undefined {
		let ar = this.CacheSpecialValue(name)
		if (ar === undefined)
			return undefined
		return ar[1]
	}

	public GetCastRange(level: number): number {
		level = Math.min(this.MaxLevel, level) - 1
		if (level < 0)
			return 0
		return this.CastRangeCache[level]
	}

	public GetChannelTime(level: number): number {
		level = Math.min(this.MaxLevel, level) - 1
		if (level < 0)
			return 0
		return this.ChannelTimeCache[level]
	}

	public GetAbilityDamage(level: number): number {
		level = Math.min(this.MaxLevel, level) - 1
		if (level < 0)
			return 0
		return this.AbilityDamageCache[level]
	}

	public GetCastPoint(level: number): number {
		level = Math.min(this.MaxLevel, level) - 1
		if (level < 0)
			return 0
		return this.CastPointCache[level]
	}

	public AbilityCharges(level: number): number {
		level = Math.min(this.MaxLevel, level) - 1
		if (level < 0)
			return 0
		return this.AbilityChargesCache[level]
	}

	private ExtendLevelArray(ar: number[]): number[] {
		if (ar.length === 0)
			ar.push(0)
		while (ar.length < this.MaxLevel)
			ar.push(ar[ar.length - 1])
		return ar
	}
	private GetLevelArray(name: string): number[] {
		// loop-optimizer: KEEP
		return this.ExtendLevelArray((this.m_Storage.get(name) as string | undefined)?.split(" ")?.map(parseFloat) ?? [])
	}
}

function AbilityNameToPath(name: string, strip = false): string {
	let is_item = name.startsWith("item_")
	let tex_name = is_item && strip ? name.substring(5) : name
	if (tex_name.startsWith("frostivus"))
		tex_name = tex_name.split("_").slice(1).join("_")
	return is_item
		? `panorama/images/items/${tex_name}_png.vtex_c`
		: `panorama/images/spellicons/${tex_name}_png.vtex_c`
}

export function ReloadGlobalAbilityStorage() {
	AbilityData.global_storage = new Map()
	let tmp = new Map([
		...LoadAbilityFile("scripts/npc/npc_abilities.txt").entries(),
		...LoadAbilityFile("scripts/npc/npc_abilities_custom.txt").entries(),
		...LoadAbilityFile("scripts/npc/items.txt").entries(),
		...LoadAbilityFile("scripts/npc/npc_items_custom.txt").entries(),
	]) as RecursiveMap
	// loop-optimizer: KEEP
	tmp.forEach((map, abil_name) => {
		if (!(map instanceof Map))
			return
		if (map.has("BaseClass")) {
			let base_name = map.get("BaseClass")
			if (typeof base_name === "string") {
				let base_map = tmp.get(base_name)
				if (base_map instanceof Map) {
					let map_ = map
					map = base_map
					// loop-optimizer: KEEP
					map_.forEach((val, key) => (map as RecursiveMap).set(key, val))

					{
						let tex_name = map.get("AbilityTextureName")
						if (typeof tex_name !== "string" || readFile(AbilityNameToPath(tex_name, false)) === undefined)
							tex_name = abil_name
						if (readFile(AbilityNameToPath(base_name)) !== undefined)
							tex_name = base_name
						map.set("AbilityTextureName", tex_name)
					}
				}
			}
		}
		{
			let tex_name = (map.get("AbilityTextureName") as string) ?? abil_name
			if (readFile(AbilityNameToPath(tex_name)) === undefined) {
				if (tex_name.startsWith("frostivus"))
					tex_name = tex_name.split("_").slice(1).join("_")
				else if (tex_name.startsWith("special_"))
					tex_name = "attribute_bonus"
				else
					tex_name = tex_name
			}
			map.set("AbilityTextureName", tex_name)
		}
		AbilityData.global_storage.set(abil_name, map)
	})
}
ReloadGlobalAbilityStorage()
