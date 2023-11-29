import { ABILITY_TYPES } from "../../Enums/ABILITY_TYPES"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { DOTA_ABILITY_BEHAVIOR } from "../../Enums/DOTA_ABILITY_BEHAVIOR"
import { DOTA_ITEM_DISASSEMBLE } from "../../Enums/DOTA_ITEM_DISASSEMBLE"
import { DOTA_UNIT_TARGET_FLAGS } from "../../Enums/DOTA_UNIT_TARGET_FLAGS"
import { DOTA_UNIT_TARGET_TEAM } from "../../Enums/DOTA_UNIT_TARGET_TEAM"
import { DOTA_UNIT_TARGET_TYPE } from "../../Enums/DOTA_UNIT_TARGET_TYPE"
import { EDOTASpecialBonusOperation } from "../../Enums/EDOTASpecialBonusOperation"
import { GameActivity } from "../../Enums/GameActivity"
import { SPELL_IMMUNITY_TYPES } from "../../Enums/SPELL_IMMUNITY_TYPES"
import { createMapFromMergedIterators, parseEnumString } from "../../Utils/Utils"
import { Unit } from "../Base/Unit"
import { UnitData } from "./UnitData"

function LoadAbilityFile(path: string): RecursiveMap {
	const res = parseKV(path).get("DOTAAbilities")
	return res instanceof Map ? res : new Map()
}

export class AbilityData {
	public static globalStorage: Map<string, AbilityData> = new Map()
	public static empty = new AbilityData("", new Map())

	public static GetAbilityByName(name: string): Nullable<AbilityData> {
		return AbilityData.globalStorage.get(name)
	}

	public static GetAbilityNameByID(id: number): Nullable<string> {
		for (const [name, data] of AbilityData.globalStorage) {
			if (data.ID === id) {
				return name
			}
		}
		return undefined
	}

	public static GetItemRecipeName(name: string): Nullable<string> {
		for (const [recipeName, data] of AbilityData.globalStorage) {
			if (data.ItemResult === name) {
				return recipeName
			}
		}
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
	public readonly MaxCooldownCache: number[]
	public readonly MaxDurationCache: number[]
	public readonly SecretShop: boolean
	public readonly ItemRequirements: string[][] = []
	public readonly ItemQuality: Nullable<string>
	public readonly ItemResult: Nullable<string>
	public readonly ItemStockTime: number
	public readonly HasShardUpgrade: boolean
	public readonly HasScepterUpgrade: boolean
	public readonly ItemIsNeutralDrop: boolean
	public readonly ShouldBeSuggested: number
	public readonly CastAnimation: Nullable<GameActivity>
	public readonly LinkedAbility: string
	public readonly ShouldBeInitiallySuggested: boolean
	public readonly ItemStockInitial: Nullable<number>
	public readonly ItemDisassembleRule: DOTA_ITEM_DISASSEMBLE

	private readonly SpecialValueCache = new Map<
		string,
		[number[], string, string | number | number[], EDOTASpecialBonusOperation]
	>()

	private readonly CastRangeCache: number[]
	private readonly ManaCostCache: number[]
	private readonly ChannelTimeCache: number[]
	private readonly AbilityDamageCache: number[]
	private readonly CastPointCache: number[]
	private readonly ChargesCache: number[]
	private readonly ChargeRestoreTimeCache: number[]
	private readonly HealthCostCache: number[]

	constructor(name: string, kv: RecursiveMap) {
		this.AbilityType = kv.has("AbilityType")
			? (ABILITY_TYPES as any)[(kv.get("AbilityType") as string).substring(5)]
			: ABILITY_TYPES.ABILITY_TYPE_BASIC
		if (kv.has("MaxLevel")) {
			this.MaxLevel = parseInt(kv.get("MaxLevel") as string)
		} else if (kv.has("MaxUpgradeLevel")) {
			this.MaxLevel = parseInt(kv.get("MaxUpgradeLevel") as string)
		} else {
			this.MaxLevel =
				this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ULTIMATE ? 3 : 4
		}
		this.CacheSpecialValuesNew(kv)
		this.CacheSpecialValuesOld(kv)

		this.AbilityBehavior = kv.has("AbilityBehavior")
			? parseEnumString(DOTA_ABILITY_BEHAVIOR, kv.get("AbilityBehavior") as string)
			: DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NONE

		this.HealthCostCache = this.GetLevelArray(
			kv.get("AbilityHealthCost") as Nullable<string>
		)

		this.LinkedAbility = (kv.get("LinkedAbility") as string) ?? ""

		this.HasShardUpgrade = kv.has("HasShardUpgrade")
			? parseInt(kv.get("HasShardUpgrade") as string) === 1
			: false

		this.HasScepterUpgrade = kv.has("HasScepterUpgrade")
			? parseInt(kv.get("HasScepterUpgrade") as string) === 1
			: false

		this.ShouldBeSuggested = kv.has("ShouldBeSuggested")
			? parseInt(kv.get("ShouldBeSuggested") as string)
			: -1

		this.ItemIsNeutralDrop = kv.has("ItemIsNeutralDrop")
			? parseInt(kv.get("ItemIsNeutralDrop") as string) === 1
			: false

		this.TexturePath = (kv.get("AbilityTexturePath") as string) ?? ""
		this.TargetFlags = kv.has("AbilityUnitTargetFlags")
			? parseEnumString(
					DOTA_UNIT_TARGET_FLAGS,
					kv.get("AbilityUnitTargetFlags") as string
			  )
			: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
		this.TargetTeam = kv.has("AbilityUnitTargetTeam")
			? parseEnumString(
					DOTA_UNIT_TARGET_TEAM,
					kv.get("AbilityUnitTargetTeam") as string
			  )
			: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE
		this.TargetType = kv.has("AbilityUnitTargetType")
			? parseEnumString(
					DOTA_UNIT_TARGET_TYPE,
					kv.get("AbilityUnitTargetType") as string
			  )
			: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE
		this.CastAnimation = kv.has("AbilityCastAnimation")
			? parseEnumString(GameActivity, kv.get("AbilityCastAnimation") as string)
			: undefined
		this.SharedCooldownName = (kv.get("AbilitySharedCooldown") as string) ?? name
		this.ModelName = (kv.get("Model") as string) ?? ""
		this.AlternateModelName = (kv.get("ModelAlternate") as string) ?? ""
		// this.ItemRecipeName = m_pAbilityData.m_pszItemRecipeName
		this.IsItem = name.startsWith("item_")
		this.IsGrantedByScepter = kv.has("IsGrantedByScepter")
			? parseInt(kv.get("IsGrantedByScepter") as string) !== 0
			: false
		this.ID = kv.has("ID") ? parseInt(kv.get("ID") as string) : 0

		this.EffectName = (kv.get("Effect") as string) ?? ""
		this.Cost = kv.has("ItemCost") ? parseInt(kv.get("ItemCost") as string) : 0
		this.Purchasable = kv.has("ItemPurchasable")
			? parseInt(kv.get("ItemPurchasable") as string) !== 0
			: false
		this.DamageType = kv.has("AbilityUnitDamageType")
			? parseEnumString(DAMAGE_TYPES, kv.get("AbilityUnitDamageType") as string)
			: DAMAGE_TYPES.DAMAGE_TYPE_NONE
		// this.DispellableType = this.m_pAbilityData.m_iAbilityDispellableType
		this.LevelsBetweenUpgrades = kv.has("LevelsBetweenUpgrades")
			? parseInt(kv.get("LevelsBetweenUpgrades") as string)
			: -1
		this.RequiredLevel = kv.has("RequiredLevel")
			? parseInt(kv.get("RequiredLevel") as string)
			: this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ULTIMATE
			  ? 6
			  : 1
		this.AbilityImmunityType = kv.has("SpellImmunityType")
			? parseEnumString(SPELL_IMMUNITY_TYPES, kv.get("SpellImmunityType") as string)
			: SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_NONE
		this.ItemDisplayCharges = kv.has("ItemDisplayCharges")
			? parseInt(kv.get("ItemDisplayCharges") as string) !== 0
			: false
		this.ItemHideCharges = kv.has("ItemHideCharges")
			? parseInt(kv.get("ItemHideCharges") as string) !== 0
			: true

		this.ManaCostCache = this.GetLevelArray(
			kv.get("AbilityManaCost") as Nullable<string>
		)
		this.CastRangeCache = this.GetLevelArray(
			kv.get("AbilityCastRange") as Nullable<string>
		)
		this.ChannelTimeCache = this.GetLevelArray(
			kv.get("AbilityChannelTime") as Nullable<string>
		)
		this.AbilityDamageCache = this.GetLevelArray(
			kv.get("AbilityDamage") as Nullable<string>
		)
		this.CastPointCache = this.GetLevelArray(
			kv.get("AbilityCastPoint") as Nullable<string>
		)
		this.ChargesCache = this.GetLevelArray(
			kv.get("AbilityCharges") as Nullable<string>
		)

		this.ChargeRestoreTimeCache = this.GetLevelArray(
			kv.get("AbilityChargeRestoreTime") as Nullable<string>
		)
		this.MaxCooldownCache = this.GetLevelArray(
			kv.get("AbilityCooldown") as Nullable<string>
		)
		this.MaxDurationCache = this.GetLevelArray(
			kv.get("AbilityDuration") as Nullable<string>
		)

		this.SecretShop = kv.has("SecretShop")
			? parseInt(kv.get("SecretShop") as string) !== 0
			: false
		if (kv.has("ItemRequirements")) {
			const map = kv.get("ItemRequirements") as Map<string, string>
			map.forEach(str => this.ItemRequirements.push(str.split(";")))
		}
		this.ItemResult = kv.get("ItemResult") as Nullable<string>
		this.ItemQuality = kv.get("ItemQuality") as Nullable<string>

		this.ItemStockInitial = kv.has("ItemStockInitial")
			? parseInt(kv.get("ItemStockInitial") as string)
			: undefined

		this.ShouldBeInitiallySuggested = kv.has("ShouldBeInitiallySuggested")
			? parseInt(kv.get("ShouldBeInitiallySuggested") as string) !== 0
			: false

		this.ItemStockTime = kv.has("ItemStockTime")
			? parseInt(kv.get("ItemStockTime") as string)
			: 0

		this.ItemDisassembleRule = kv.has("ItemDisassembleRule")
			? parseEnumString(
					DOTA_ITEM_DISASSEMBLE,
					kv.get("ItemDisassembleRule") as string
			  )
			: DOTA_ITEM_DISASSEMBLE.DOTA_ITEM_DISASSEMBLE_NONE
	}

	public GetSpecialValue(name: string, level: number): number {
		if (level <= 0) {
			return 0
		}
		const ar = this.GetCachedSpecialValue(name)
		if (ar === undefined) {
			return 0
		}
		return ar[0][Math.min(level, ar[0].length) - 1]
	}

	public GetSpecialValueWithTalent(owner: Unit, name: string, level: number): number {
		if (level <= 0) {
			return 0
		}

		const ar = this.GetCachedSpecialValue(name)
		if (ar === undefined || !ar[0].length) {
			return 0
		}

		let baseVal = ar[0][Math.min(level, ar[0].length) - 1]
		if (
			!baseVal &&
			!(ar[1] === "special_bonus_shard" || ar[1] === "special_bonus_scepter")
		) {
			return baseVal
		}

		if (name.startsWith("special_bonus_unique_")) {
			return this.GetSpecialTalent(name, owner)
		}

		if (
			!(ar[1] === "special_bonus_shard" && owner.HasShard) &&
			!(ar[1] === "special_bonus_scepter" && owner.HasScepter)
		) {
			return baseVal
		}

		const val = ar[2]
		const talentVal =
			typeof val === "string"
				? this.GetSpecialValue(val, level)
				: Array.isArray(val)
				  ? val[Math.min(level, val.length) - 1]
				  : val

		switch (ar[3]) {
			default:
			case EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD:
				baseVal += talentVal
				break
			case EDOTASpecialBonusOperation.SPECIAL_BONUS_MULTIPLY:
				baseVal *= talentVal
				break
			case EDOTASpecialBonusOperation.SPECIAL_BONUS_PERCENTAGE_ADD:
				baseVal *= 1 + talentVal / 100
				break
			case EDOTASpecialBonusOperation.SPECIAL_BONUS_PERCENTAGE_SUBTRACT:
				baseVal *= 1 - talentVal / 100
				break
		}

		return baseVal
	}

	public GetCastRange(level: number): number {
		if (level <= 0) {
			return 0
		}
		return this.CastRangeCache[Math.min(level, this.CastRangeCache.length) - 1]
	}

	public GetHealthCost(level: number): number {
		if (level <= 0) {
			return 0
		}
		return this.HealthCostCache[Math.min(level, this.HealthCostCache.length) - 1]
	}

	public GetManaCost(level: number): number {
		if (level <= 0) {
			return 0
		}
		return this.ManaCostCache[Math.min(level, this.ManaCostCache.length) - 1]
	}

	public GetMaxDurationForLevel(level: number): number {
		if (level <= 0) {
			return 0
		}
		return this.MaxDurationCache[Math.min(level, this.MaxDurationCache.length) - 1]
	}

	public GetMaxCooldownForLevel(level: number): number {
		if (level <= 0) {
			return 0
		}
		return this.MaxCooldownCache[Math.min(level, this.MaxCooldownCache.length) - 1]
	}

	public GetChannelTime(level: number): number {
		if (level <= 0) {
			return 0
		}
		return this.ChannelTimeCache[Math.min(level, this.ChannelTimeCache.length) - 1]
	}

	public GetAbilityDamage(level: number): number {
		if (level <= 0) {
			return 0
		}
		return this.AbilityDamageCache[
			Math.min(level, this.AbilityDamageCache.length) - 1
		]
	}

	public GetCastPoint(level: number): number {
		if (level <= 0) {
			return 0
		}
		return this.CastPointCache[Math.min(level, this.CastPointCache.length) - 1]
	}

	public GetMaxCharges(level: number): number {
		if (level <= 0) {
			return 0
		}
		return this.ChargesCache[Math.min(level, this.ChargesCache.length) - 1]
	}

	public GetChargeRestoreTime(level: number): number {
		if (level <= 0) {
			return 0
		}
		return this.ChargeRestoreTimeCache[
			Math.min(level, this.ChargeRestoreTimeCache.length) - 1
		]
	}

	private GetSpecialTalent(name: string, owner: Unit) {
		const talent = owner.GetAbilityByName(name)
		if (talent === undefined || talent.Level === 0) {
			return 0
		}
		return this.GetSpecialValue(name, talent.Level)
	}

	private parseFloat(str: string): number {
		if (!str.length) {
			return 0
		}
		return parseFloat(str.endsWith("f") ? str.substring(0, str.length - 1) : str)
	}

	private CacheSpecialValuesOld(kv: RecursiveMap) {
		const abilitySpecial = kv.get("AbilitySpecial") as RecursiveMap
		if (abilitySpecial === undefined) {
			return
		}
		abilitySpecial.forEach(special => {
			if (!(special instanceof Map)) {
				return
			}
			special.forEach((value, name) => {
				if (
					name === "var_type" ||
					name === "LinkedSpecialBonus" ||
					name === "levelkey" ||
					name === "RequiresScepter" ||
					name === "RequiresShard" ||
					typeof value !== "string"
				) {
					return
				}
				const ar = this.ExtendLevelArray(
					value.split(" ").map(str => this.parseFloat(str))
				)
				let linkedSpecialBonus = special.get("LinkedSpecialBonus")
				if (typeof linkedSpecialBonus !== "string") {
					linkedSpecialBonus = ""
				}
				const linkedSpecialBonusOperationStr = special.get(
					"LinkedSpecialBonusOperation"
				)
				let linkedSpecialBonusOperation =
					EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
				if (typeof linkedSpecialBonusOperationStr === "string") {
					linkedSpecialBonusOperation =
						(EDOTASpecialBonusOperation as any)[
							linkedSpecialBonusOperationStr
						] ?? EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
				}
				let linkedSpecialBonusFieldStr = special.get("LinkedSpecialBonusField")
				if (typeof linkedSpecialBonusFieldStr !== "string") {
					linkedSpecialBonusFieldStr = "value"
				}
				this.SpecialValueCache.set(name, [
					ar,
					linkedSpecialBonus,
					linkedSpecialBonusFieldStr,
					linkedSpecialBonusOperation
				] as [number[], string, string, EDOTASpecialBonusOperation])
			})
		})
	}

	private CacheSpecialValuesNew(kv: RecursiveMap) {
		const abilityValues = kv.get("AbilityValues") as RecursiveMap
		if (abilityValues === undefined) {
			return
		}
		abilityValues.forEach((special, name) => {
			if (!(special instanceof Map)) {
				if (typeof special === "string") {
					this.SpecialValueCache.set(name, [
						this.ExtendLevelArray(
							special.split(" ").map(str => this.parseFloat(str))
						),
						"",
						0,
						EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
					] as [number[], string, number, EDOTASpecialBonusOperation])
				}
				return
			}
			let linkedSpecialBonus = "",
				talentChangeStr = "+0"
			special.forEach((specialValue, specialName) => {
				if (
					specialName === "value" ||
					specialName === "LinkedSpecialBonus" ||
					specialName === "levelkey" ||
					specialName === "RequiresScepter" ||
					specialName === "RequiresShard" ||
					typeof specialValue !== "string"
				) {
					return
				}
				linkedSpecialBonus = specialName
				talentChangeStr = specialValue
			})
			let value = special.get("value") ?? ""
			if (typeof value !== "string") {
				value = ""
			}
			const ar = this.ExtendLevelArray(
				value.split(" ").map(str => this.parseFloat(str))
			)
			let linkedSpecialBonusOperation = EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
			let talentChange: number | number[]
			if (talentChangeStr.startsWith("x")) {
				linkedSpecialBonusOperation =
					EDOTASpecialBonusOperation.SPECIAL_BONUS_MULTIPLY
				talentChange = this.parseFloat(talentChangeStr.substring(1))
			} else if (
				talentChangeStr.startsWith("+") ||
				talentChangeStr.startsWith("-")
			) {
				const isArray = talentChangeStr.indexOf(" ") !== -1
				const isPercent =
					talentChangeStr[talentChangeStr.length - 1].indexOf("%") !== -1
				linkedSpecialBonusOperation = !isPercent
					? EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
					: talentChangeStr.startsWith("+")
					  ? EDOTASpecialBonusOperation.SPECIAL_BONUS_PERCENTAGE_ADD
					  : EDOTASpecialBonusOperation.SPECIAL_BONUS_PERCENTAGE_SUBTRACT
				talentChange = isArray
					? talentChangeStr
							.split(" ")
							.map(str => Math.abs(this.parseFloat(str)))
					: Math.abs(this.parseFloat(talentChangeStr))
			} else {
				linkedSpecialBonusOperation = EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
				talentChange = this.parseFloat(talentChangeStr)
			}
			this.SpecialValueCache.set(name, [
				ar,
				linkedSpecialBonus,
				talentChange,
				linkedSpecialBonusOperation
			] as [number[], string, number | number[], EDOTASpecialBonusOperation])
		})
	}

	private GetCachedSpecialValue(name: string) {
		const ar = this.SpecialValueCache.get(name)
		if (ar !== undefined) {
			return ar
		}
		return [[0], "", "value", EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD] as [
			number[],
			string,
			string,
			EDOTASpecialBonusOperation
		]
	}

	private ExtendLevelArray(ar: number[]): number[] {
		if (ar.length === 0) {
			ar.push(0)
		}
		return ar
	}

	private GetLevelArray(str: Nullable<string>): number[] {
		return this.ExtendLevelArray(str?.split(" ")?.map(val => parseFloat(val)) ?? [])
	}
}

function AbilityNameToPath(name: string, strip = false): string {
	const isItem = name.startsWith("item_")
	let texName = isItem && strip ? name.substring(5) : name
	if (texName.startsWith("frostivus")) {
		texName = texName.split("_").slice(1).join("_")
	}
	if (isItem && name.startsWith("item_recipe_")) {
		texName = "recipe"
	}
	return isItem
		? `panorama/images/items/${texName}_png.vtex_c`
		: `panorama/images/spellicons/${texName}_png.vtex_c`
}

function FixAbilityInheritance(
	abilsMap: RecursiveMap,
	fixedCache: RecursiveMap,
	map: RecursiveMap,
	abilName: string
): RecursiveMap {
	if (fixedCache.has(abilName)) {
		return fixedCache.get(abilName) as RecursiveMap
	}
	if (abilName !== "ability_base" && !map.has("BaseClass")) {
		map.set("BaseClass", "ability_base")
	}
	if (map.has("BaseClass")) {
		const baseName = map.get("BaseClass")
		if (typeof baseName === "string" && baseName !== abilName) {
			const baseMap = abilsMap.get(baseName)
			if (baseMap instanceof Map) {
				const fixedBaseMap = FixAbilityInheritance(
					abilsMap,
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
	{
		let texName = (map.get("AbilityTextureName") as string) ?? abilName
		let path = AbilityNameToPath(texName)
		if (!fexists(path)) {
			path = AbilityNameToPath(texName, true)
			if (!fexists(path)) {
				if (texName.startsWith("frostivus")) {
					texName = texName.split("_").slice(1).join("_")
				} else if (texName.startsWith("special_")) {
					texName = "attribute_bonus"
				} else {
					texName = texName
				}
				path = AbilityNameToPath(texName)
			}
		}
		map.set("AbilityTexturePath", path)
	}
	fixedCache.set(abilName, map)
	AbilityData.globalStorage.set(abilName, new AbilityData(abilName, map))
	return map
}

export function ReloadGlobalAbilityStorage() {
	AbilityData.globalStorage.clear()
	try {
		const abilsMap = createMapFromMergedIterators<string, RecursiveMapValue>(
			...Array.from(UnitData.globalStorage.keys())
				.filter(name => name.includes("npc_dota_hero_"))
				.map(name => LoadAbilityFile(`scripts/npc/heroes/${name}.txt`).entries()),
			LoadAbilityFile("scripts/npc/npc_abilities.txt").entries(),
			LoadAbilityFile("scripts/npc/npc_abilities_custom.txt").entries(),
			LoadAbilityFile("scripts/npc/items.txt").entries(),
			LoadAbilityFile("scripts/npc/npc_items_custom.txt").entries()
		)
		const fixedCache: RecursiveMap = new Map()
		abilsMap.forEach((map, abilName) => {
			if (map instanceof Map) {
				FixAbilityInheritance(abilsMap, fixedCache, map, abilName)
			}
		})
	} catch (e) {
		console.error("Error in ReloadGlobalAbilityStorage", e)
	}
}
