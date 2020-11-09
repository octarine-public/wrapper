import { parseKVFile, parseEnumString } from "../../Utils/Utils"
import Unit from "../Base/Unit"

function LoadAbilityFile(path: string): RecursiveMap {
	const res = parseKVFile(path).get("DOTAAbilities")
	return res instanceof Map ? res : new Map()
}

export default class AbilityData {
	public static global_storage = new Map<string, AbilityData>()
	public static empty = new AbilityData("", new Map())
	public static GetAbilityByName(name: string): Nullable<AbilityData> {
		return AbilityData.global_storage.get(name)
	}
	public static GetAbilityNameByID(id: number): Nullable<string> {
		for (const [name, data] of AbilityData.global_storage)
			if (data.ID === id)
				return name
		return undefined
	}
	public static GetItemRecipeName(name: string): Nullable<string> {
		for (const [name_, data] of AbilityData.global_storage)
			if (data.ItemResult === name)
				return name_
		return undefined
	}

	public readonly AbilityBehavior: number // DOTA_ABILITY_BEHAVIOR bitmask
	public readonly AbilityType: ABILITY_TYPES
	public readonly MaxLevel: number
	public readonly TexturePath: string
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
	public readonly Purchasable: boolean
	public readonly DamageType: DAMAGE_TYPES
	// public readonly DispellableType: SPELL_DISPELLABLE_TYPES
	public readonly LevelsBetweenUpgrades: number
	public readonly RequiredLevel: number
	public readonly AbilityImmunityType: SPELL_IMMUNITY_TYPES
	public readonly ItemDisplayCharges: boolean
	public readonly ItemHideCharges: boolean
	public readonly Duration: number[]
	public readonly SecretShop: boolean
	public readonly ItemRequirements: string[][] = []
	public readonly ItemResult: Nullable<string>
	private readonly SpecialValueCache = new Map<string, [number[], Nullable<string>, EDOTASpecialBonusOperation]>()
	private readonly CastRangeCache: number[]
	private readonly ChannelTimeCache: number[]
	private readonly AbilityDamageCache: number[]
	private readonly CastPointCache: number[]
	private readonly ChargesCache: number[]
	private readonly ChargeRestoreTimeCache: number[]

	constructor(name: string, m_Storage: RecursiveMap) {
		this.AbilityBehavior = m_Storage.has("AbilityBehavior")
			? parseEnumString(DOTA_ABILITY_BEHAVIOR, m_Storage.get("AbilityBehavior") as string)
			: DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NONE
		this.AbilityType = m_Storage.has("AbilityType")
			? (ABILITY_TYPES as any)[(m_Storage.get("AbilityType") as string).substring(5)]
			: ABILITY_TYPES.ABILITY_TYPE_BASIC
		this.MaxLevel = m_Storage.has("MaxLevel")
			? parseInt(m_Storage.get("MaxLevel") as string)
			: this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ULTIMATE
				? 3
				: 4
		this.TexturePath = m_Storage.get("AbilityTexturePath") as string
		this.TargetFlags = m_Storage.has("AbilityUnitTargetFlags")
			? parseEnumString(DOTA_UNIT_TARGET_FLAGS, m_Storage.get("AbilityUnitTargetFlags") as string)
			: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
		this.TargetTeam = m_Storage.has("AbilityUnitTargetTeam")
			? parseEnumString(DOTA_UNIT_TARGET_TEAM, m_Storage.get("AbilityUnitTargetTeam") as string)
			: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE
		this.TargetType = m_Storage.has("AbilityUnitTargetType")
			? parseEnumString(DOTA_UNIT_TARGET_TYPE, m_Storage.get("AbilityUnitTargetType") as string)
			: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE
		this.SharedCooldownName = (m_Storage.get("AbilitySharedCooldown") as string) ?? name
		this.ModelName = (m_Storage.get("Model") as string) ?? ""
		this.AlternateModelName = (m_Storage.get("ModelAlternate") as string) ?? ""
		// this.ItemRecipeName = m_pAbilityData.m_pszItemRecipeName
		this.IsItem = name.startsWith("item_")
		this.IsGrantedByScepter = m_Storage.has("IsGrantedByScepter")
			? parseInt(m_Storage.get("IsGrantedByScepter") as string) !== 0
			: false
		this.ID = m_Storage.has("ID")
			? parseInt(m_Storage.get("ID") as string)
			: 0
		this.EffectName = (m_Storage.get("Effect") as string) ?? ""
		this.Cost = m_Storage.has("ItemCost")
			? parseInt(m_Storage.get("ItemCost") as string)
			: 0
		this.Purchasable = m_Storage.has("ItemPurchasable")
			? parseInt(m_Storage.get("ItemPurchasable") as string) !== 0
			: false
		this.DamageType = m_Storage.has("AbilityUnitDamageType")
			? parseEnumString(DAMAGE_TYPES, m_Storage.get("AbilityUnitDamageType") as string)
			: DAMAGE_TYPES.DAMAGE_TYPE_NONE
		// this.DispellableType = this.m_pAbilityData.m_iAbilityDispellableType
		this.LevelsBetweenUpgrades = m_Storage.has("LevelsBetweenUpgrades")
			? parseInt(m_Storage.get("LevelsBetweenUpgrades") as string)
			: -1
		this.RequiredLevel = m_Storage.has("RequiredLevel")
			? parseInt(m_Storage.get("RequiredLevel") as string)
			: this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ULTIMATE
				? 6
				: 1
		this.AbilityImmunityType = m_Storage.has("SpellImmunityType")
			? parseEnumString(SPELL_IMMUNITY_TYPES, m_Storage.get("SpellImmunityType") as string)
			: SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_NONE
		this.ItemDisplayCharges = m_Storage.has("ItemDisplayCharges")
			? parseInt(m_Storage.get("ItemDisplayCharges") as string) !== 0
			: false
		this.ItemHideCharges = m_Storage.has("ItemHideCharges")
			? parseInt(m_Storage.get("ItemHideCharges") as string) !== 0
			: true
		this.Duration = this.GetLevelArray(m_Storage.get("AbilityDuration") as Nullable<string>)
		this.CastRangeCache = this.GetLevelArray(m_Storage.get("AbilityCastRange") as Nullable<string>)
		this.ChannelTimeCache = this.GetLevelArray(m_Storage.get("AbilityChannelTime") as Nullable<string>)
		this.AbilityDamageCache = this.GetLevelArray(m_Storage.get("AbilityDamage") as Nullable<string>)
		this.CastPointCache = this.GetLevelArray(m_Storage.get("AbilityCastPoint") as Nullable<string>)
		this.ChargesCache = this.GetLevelArray(m_Storage.get("AbilityCharges") as Nullable<string>)
		this.ChargeRestoreTimeCache = this.GetLevelArray(m_Storage.get("AbilityChargeRestoreTime") as Nullable<string>)
		this.SecretShop = m_Storage.has("SecretShop")
			? parseInt(m_Storage.get("SecretShop") as string) !== 0
			: false
		if (m_Storage.has("ItemRequirements")) {
			const map = m_Storage.get("ItemRequirements") as Map<string, string>
			map.forEach(str => this.ItemRequirements.push(str.split(";")))
		}
		this.ItemResult = m_Storage.get("ItemResult") as Nullable<string>
		this.CacheSpecialValues(m_Storage)
	}

	public GetSpecialValue(name: string, level = this.MaxLevel): number {
		if (level <= 0)
			return 0
		level = Math.min(level, this.MaxLevel) - 1
		const ar = this.GetCachedSpecialValue(name)
		if (ar === undefined)
			return 0
		return ar[0][level]
	}

	public GetLinkedSpecialBonus(name: string): Nullable<string> {
		const ar = this.GetCachedSpecialValue(name)
		if (ar === undefined)
			return undefined
		return ar[1]
	}
	public GetSpecialValueWithTalent(owner: Unit, name: string, level: number): number {
		if (level <= 0)
			return 0
		level = Math.min(level, this.MaxLevel) - 1
		const ar = this.GetCachedSpecialValue(name)
		if (ar === undefined)
			return 0
		let base_val = ar[0][level]
		if (ar[1] !== undefined) {
			const talent = owner.GetAbilityByName(ar[1])
			if (talent !== undefined && talent.Level !== 0) {
				const talent_val = talent.GetSpecialValue("value")
				switch (ar[2]) {
					default:
					case EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD:
						base_val += talent_val
						break
					case EDOTASpecialBonusOperation.SPECIAL_BONUS_MULTIPLY:
						base_val *= talent_val
						break
					case EDOTASpecialBonusOperation.SPECIAL_BONUS_PERCENTAGE_ADD:
						base_val *= 1 + (talent_val / 100)
						break
					case EDOTASpecialBonusOperation.SPECIAL_BONUS_PERCENTAGE_SUBTRACT:
						base_val *= 1 - (talent_val / 100)
						break
				}
			}
		}
		return base_val
	}

	public GetCastRange(level: number): number {
		if (level <= 0)
			level = this.MaxLevel
		if (level < 0)
			return 0
		level = (level - 1)
		return this.CastRangeCache[level]
	}

	public GetDuration(level: number): number {
		if (level <= 0)
			level = this.MaxLevel
		if (level < 0)
			return 0
		level = (level - 1)
		return this.Duration[level]
	}

	public GetChannelTime(level: number): number {
		if (level <= 0)
			level = this.MaxLevel
		if (level < 0)
			return 0
		level = (level - 1)
		return this.ChannelTimeCache[level]
	}

	public GetAbilityDamage(level: number): number {
		if (level <= 0)
			level = this.MaxLevel
		if (level < 0)
			return 0
		level = (level - 1)
		return this.AbilityDamageCache[level]
	}

	public GetCastPoint(level: number): number {
		if (level <= 0)
			level = this.MaxLevel
		if (level < 0)
			return 0
		level = (level - 1)
		return this.CastPointCache[level]
	}

	public GetMaxCharges(level: number): number {
		if (level <= 0)
			level = this.MaxLevel
		if (level < 0)
			return 0
		level = (level - 1)
		return this.ChargesCache[level]
	}
	public GetChargeRestoreTime(level: number): number {
		if (level <= 0)
			level = this.MaxLevel
		if (level < 0)
			return 0
		level = (level - 1)
		return this.ChargeRestoreTimeCache[level]
	}

	private CacheSpecialValues(m_Storage: RecursiveMap) {
		const AbilitySpecial = m_Storage.get("AbilitySpecial") as RecursiveMap
		if (AbilitySpecial === undefined)
			return
		for (const special of AbilitySpecial.values()) {
			if (!(special instanceof Map))
				continue
			for (const [name, value] of special) {
				if (name === "var_type" || name === "LinkedSpecialBonus" || typeof value !== "string")
					continue
				const ar = value.split(" ").map(str => parseFloat(str.endsWith("f") ? str.substring(0, str.length - 1) : str))
				this.ExtendLevelArray(ar)
				let LinkedSpecialBonus = special.get("LinkedSpecialBonus")
				if (typeof LinkedSpecialBonus !== "string")
					LinkedSpecialBonus = undefined
				const LinkedSpecialBonusOperation_str = special.get("LinkedSpecialBonusOperation")
				let LinkedSpecialBonusOperation = EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
				if (typeof LinkedSpecialBonusOperation_str === "string")
					LinkedSpecialBonusOperation = (EDOTASpecialBonusOperation as any)[LinkedSpecialBonusOperation_str] ?? EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
				this.SpecialValueCache.set(name, [ar, LinkedSpecialBonus, LinkedSpecialBonusOperation] as [number[], Nullable<string>, EDOTASpecialBonusOperation])
			}
		}
	}
	private GetCachedSpecialValue(name: string) {
		const ar = this.SpecialValueCache.get(name)
		if (ar !== undefined)
			return ar

		return [
			new Array<number>(this.MaxLevel).fill(0),
			undefined,
			EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
		] as [number[], Nullable<string>, EDOTASpecialBonusOperation]
	}

	private ExtendLevelArray(ar: number[]): number[] {
		if (ar.length === 0)
			ar.push(0)
		while (ar.length < this.MaxLevel)
			ar.push(ar[ar.length - 1])
		return ar
	}
	private GetLevelArray(str: Nullable<string>): number[] {
		return this.ExtendLevelArray(str?.split(" ")?.map(val => parseFloat(val)) ?? [])
	}
}

function AbilityNameToPath(name: string, strip = false): string {
	const is_item = name.startsWith("item_")
	let tex_name = is_item && strip ? name.substring(5) : name
	if (tex_name.startsWith("frostivus"))
		tex_name = tex_name.split("_").slice(1).join("_")
	return is_item
		? `panorama/images/items/${tex_name}_png.vtex_c`
		: `panorama/images/spellicons/${tex_name}_png.vtex_c`
}

function FixAbilityInheritance(abils_map: RecursiveMap, fixed_cache: RecursiveMap, map: RecursiveMap, abil_name: string): RecursiveMap {
	if (fixed_cache.has(abil_name))
		return fixed_cache.get(abil_name) as RecursiveMap
	if (abil_name !== "ability_base" && !map.has("BaseClass"))
		map.set("BaseClass", "ability_base")
	if (map.has("BaseClass")) {
		const base_name = map.get("BaseClass")
		if (typeof base_name === "string" && base_name !== abil_name) {
			const base_map = abils_map.get(base_name)
			if (base_map instanceof Map) {
				const fixed_base_map = FixAbilityInheritance(abils_map, fixed_cache, base_map, base_name)
				fixed_base_map.forEach((v, k) => {
					if (!map.has(k))
						map.set(k, v)
				})
			}
		}
	}
	if (!map.has("AbilityTexturePath") || !fexists(map.get("AbilityTexturePath") as string)) {
		let tex_name = (map.get("AbilityTextureName") as string) ?? abil_name
		let path = AbilityNameToPath(tex_name)
		if (!fexists(path)) {
			path = AbilityNameToPath(tex_name, true)
			if (!fexists(path)) {
				if (tex_name.startsWith("frostivus"))
					tex_name = tex_name.split("_").slice(1).join("_")
				else if (tex_name.startsWith("special_"))
					tex_name = "attribute_bonus"
				else
					tex_name = tex_name
				path = AbilityNameToPath(tex_name)
			}
		}
		map.set("AbilityTexturePath", path)
	}
	fixed_cache.set(abil_name, map)
	AbilityData.global_storage.set(abil_name, new AbilityData(abil_name, map))
	return map
}

export function ReloadGlobalAbilityStorage() {
	AbilityData.global_storage.clear()
	const abils_map = new Map([
		...LoadAbilityFile("scripts/npc/npc_abilities.txt").entries(),
		...LoadAbilityFile("scripts/npc/npc_abilities_custom.txt").entries(),
		...LoadAbilityFile("scripts/npc/items.txt").entries(),
		...LoadAbilityFile("scripts/npc/npc_items_custom.txt").entries(),
	]) as RecursiveMap
	const fixed_cache: RecursiveMap = new Map()
	abils_map.forEach((map, abil_name) => {
		if (map instanceof Map)
			FixAbilityInheritance(abils_map, fixed_cache, map, abil_name)
	})
}
ReloadGlobalAbilityStorage()
