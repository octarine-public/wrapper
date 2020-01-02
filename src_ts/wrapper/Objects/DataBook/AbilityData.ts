import { parseKVFile, parseEnumString } from "../../Utils/Utils"
import { RecursiveMap } from "../../Utils/ParseKV"

function LoadAbilityFile(path: string): RecursiveMap {
	return (parseKVFile(path).get("DOTAAbilities") as RecursiveMap) ?? new Map()
}

export default class AbilityData {
	public static global_storage: RecursiveMap
	public static GetAbilityID(name: string): number {
		let storage = AbilityData.global_storage.get(name)
		if (!(storage instanceof Map))
			throw "Invalid storage type for ability name " + name
		return storage.has("ID") ? parseInt(storage.get("ID") as string) : 0
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
	private readonly SpecialValueCache = new Map<string, number[]>()
	private readonly CastRangeCache: number[]
	private readonly AbilityDamageCache: number[]
	private readonly CastPointCache: number[]

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
		this.CastRangeCache = this.GetLevelArray("AbilityCastRange")
		this.AbilityDamageCache = this.GetLevelArray("AbilityDamage")
		this.CastPointCache = this.GetLevelArray("AbilityCastPoint")
	}

	public GetSpecialValue(name: string, level = 0): number {
		level = Math.min(this.MaxLevel, level) - 1
		if (level < 0)
			return 0
		let ar = this.SpecialValueCache.get(name)
		if (ar !== undefined)
			return ar[level]
		let AbilitySpecial = this.m_Storage.get("AbilitySpecial") as RecursiveMap
		if (AbilitySpecial === undefined)
			return 0
		for (let special of AbilitySpecial.values()) {
			if (!(special instanceof Map) || !special.has(name))
				continue
			let str = special.get(name) as string
			// loop-optimizer: FORWARD
			ar = str.split(" ").map(parseFloat)
			this.ExtendLevelArray(ar)
			this.SpecialValueCache.set(name, ar)
			return ar[level]
		}

		// there's no such special - prevent further tries to find it since cache is static
		this.SpecialValueCache.set(name, new Array<number>(this.MaxLevel).fill(0))
		return 0
	}

	public GetCastRange(level: number): number {
		level = Math.min(this.MaxLevel, level) - 1
		if (level < 0)
			return 0
		return this.CastRangeCache[level]
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

export function ReloadGlobalAbilityStorage() {
	AbilityData.global_storage = new Map([
		...LoadAbilityFile("scripts/npc/npc_abilities.txt").entries(),
		...LoadAbilityFile("scripts/npc/npc_abilities_custom.txt").entries(),
		...LoadAbilityFile("scripts/npc/items.txt").entries(),
		...LoadAbilityFile("scripts/npc/npc_items_custom.txt").entries(),
	]) as RecursiveMap
}
ReloadGlobalAbilityStorage()
