import "../../../prototypes/array"

import { AbilityImagePath, ItemImagePath } from "../../Data/PathData"
import { ABILITY_TYPES } from "../../Enums/ABILITY_TYPES"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { DOTA_ABILITY_BEHAVIOR } from "../../Enums/DOTA_ABILITY_BEHAVIOR"
import { DOTA_ITEM_DISASSEMBLE } from "../../Enums/DOTA_ITEM_DISASSEMBLE"
import { DOTA_UNIT_TARGET_FLAGS } from "../../Enums/DOTA_UNIT_TARGET_FLAGS"
import { DOTA_UNIT_TARGET_TEAM } from "../../Enums/DOTA_UNIT_TARGET_TEAM"
import { DOTA_UNIT_TARGET_TYPE } from "../../Enums/DOTA_UNIT_TARGET_TYPE"
import { EDOTASpecialBonusOperation } from "../../Enums/EDOTASpecialBonusOperation"
import { EDOTASpecialBonusStats } from "../../Enums/EDOTASpecialBonusStats"
import { EModifierfunction } from "../../Enums/EModifierfunction"
import { GameActivity } from "../../Enums/GameActivity"
import { SPELL_DISPELLABLE_TYPES } from "../../Enums/SPELL_DISPELLABLE_TYPES"
import { SPELL_IMMUNITY_TYPES } from "../../Enums/SPELL_IMMUNITY_TYPES"
import { MapValueToBoolean, MapValueToString } from "../../Resources/ParseUtils"
import { createMapFromMergedIterators, parseEnumString } from "../../Utils/Utils"
import { Unit } from "../Base/Unit"
import { UnitData } from "./UnitData"

export interface ISpecialValueOptions {
	useFacet?: boolean
	lvlup?: {
		subtract?: number
		operation: EDOTASpecialBonusOperation
	}
}

interface ILinkedSpecialBonus {
	Name: string
	IsOld: boolean
	OldData?: [EDOTASpecialBonusOperation, string]
	// bool flag need for unquie talents and exludes NaN where used "+-value"
	// example: pudge_rot->rot_slow, tiny_grow->attack_speed_reduction
	NewData?: [EDOTASpecialBonusOperation, number, boolean][]
}

interface ISpecialValue {
	BaseValues: number[]
	RequiresFacet: string
	RequiresScepter: boolean
	RequiresShard: boolean
	AffectedByCurio: boolean
	AffectedByAOEIncrease: boolean
	LinkedSpecialBonuses: ILinkedSpecialBonus[]
}

const storageIds: Map<number, string> = new Map()
const allStats = ["bonus_all_stats", "bonus_stats"]
const hpStats = ["bonus_strength", "bonus_str", "bonus_health"]
const manaStats = [
	"bonus_intellect",
	"bonus_intelligence",
	"bonus_int",
	"bonus_mana",
	"intelligence_pct"
]

function LoadFile(path: string, name: string = "DOTAAbilities"): RecursiveMap {
	const res = parseKV(path).get(name)
	return res instanceof Map ? res : new Map()
}

export class AbilityData {
	public static readonly empty = new AbilityData("", new Map())
	public static readonly globalStorage: Map<string, AbilityData> = new Map()
	public static readonly ShouldBeDrawable = new Set<string>()
	private static readonly cacheWithoutSpecialData = new Set<string>()

	public static DisposeAllData() {
		storageIds.clear()
		this.globalStorage.clear()
		this.ShouldBeDrawable.clear()
		this.cacheWithoutSpecialData.clear()
	}
	public static GetAbilityByName(name: string): Nullable<AbilityData> {
		return AbilityData.globalStorage.get(name)
	}
	public static GetAbilityNameByID(id: number): Nullable<string> {
		return storageIds.get(id)
	}
	public static GetItemRecipeName(name: string): Nullable<string> {
		for (const [recipeName, data] of AbilityData.globalStorage) {
			if (data.ItemResult === name) {
				return recipeName
			}
		}
		return undefined
	}
	protected static GetAbilityIDByName(name: string): Nullable<number> {
		for (const [abilID, abilName] of storageIds) {
			if (abilName === name) {
				return abilID
			}
		}
		return undefined
	}
	protected static get HasDebug(): boolean {
		return (globalThis as any)?.DEBUGGER_INSTALLED ?? false
	}
	public readonly AbilityBehavior: DOTA_ABILITY_BEHAVIOR // bitmask
	public readonly AbilityType: ABILITY_TYPES
	public readonly BonusStats: EDOTASpecialBonusStats
	public readonly MaxLevel: number
	public readonly TexturePath: string
	public readonly TargetFlags: DOTA_UNIT_TARGET_FLAGS // bitmask
	public readonly TargetTeam: DOTA_UNIT_TARGET_TEAM // bitmask
	public readonly TargetType: DOTA_UNIT_TARGET_TYPE // bitmask
	public readonly SpellDispellableType: SPELL_DISPELLABLE_TYPES
	public readonly SharedCooldownName: string
	public readonly ModelName: string
	public readonly AlternateModelName: string
	public readonly DependentOnAbility: string
	// public readonly ItemRecipeName: string
	public readonly IsItem: boolean
	public readonly IsGrantedByScepter: boolean
	public readonly ID: number
	public readonly EffectName: string
	public readonly Cost: number
	public readonly IsInnate: boolean
	public readonly Purchasable: boolean
	public readonly DamageType: DAMAGE_TYPES
	public readonly LevelsBetweenUpgrades: number
	public readonly RequiredLevel: number
	public readonly AbilityImmunityType: SPELL_IMMUNITY_TYPES
	public readonly ItemDisplayCharges: boolean
	public readonly ItemHideCharges: boolean
	public readonly SecretShop: boolean
	public readonly ItemRequirements: string[][] = []
	public readonly ItemQuality: Nullable<string>
	public readonly ItemResult: Nullable<string>
	public readonly ItemStockTime: number
	public readonly HasShardUpgrade: boolean
	public readonly HasScepterUpgrade: boolean
	public readonly ItemIsNeutralDrop: boolean
	public readonly ItemIsNeutralActiveDrop: boolean
	public readonly ShouldBeSuggested: number
	public readonly IsTempestDoubleClonable: boolean
	public readonly SuggestPregame: boolean
	public readonly ItemSupport: boolean
	public readonly SpeciallyBannedFromNeutralSlot: boolean
	public readonly CastAnimation: Nullable<GameActivity>
	public readonly LinkedAbility: string
	public readonly ShouldBeInitiallySuggested: boolean
	public readonly ItemStockInitial: Nullable<number>
	public readonly ItemDisassembleRule: DOTA_ITEM_DISASSEMBLE
	public readonly ItemAliases: string[] = []
	public readonly HasCastRangeSpecial: boolean
	public readonly HasManaCostSpecial: boolean
	public readonly HasChannelTimeSpecial: boolean
	public readonly HasAbilityDamageSpecial: boolean
	public readonly HasCastPointSpecial: boolean
	public readonly HasMaxChargesSpecial: boolean
	public readonly HasChargeRestoreTimeSpecial: boolean
	public readonly HasMaxCooldownSpecial: boolean
	public readonly HasMaxDurationSpecial: boolean
	public readonly HasHealthCostSpecial: boolean
	public readonly IsBreakable: boolean
	public readonly AllowedInBackpack: boolean

	private readonly SpecialValueCache = new Map<string, ISpecialValue>()
	private readonly CastRangeCache: number[]
	private readonly ManaCostCache: number[]
	private readonly ChannelTimeCache: number[]
	private readonly AbilityDamageCache: number[]
	private readonly CastPointCache: number[]
	private readonly MaxChargesCache: number[]
	private readonly ChargeRestoreTimeCache: number[]
	private readonly MaxCooldownCache: number[]
	private readonly MaxDurationCache: number[]
	private readonly HealthCostCache: number[]

	constructor(
		private readonly name: string,
		kv: RecursiveMap
	) {
		this.clearAllData()
		this.cacheSpecialValuesNew(kv)
		this.cacheSpecialValuesOld(kv)

		this.AbilityType = kv.has("AbilityType")
			? parseEnumString(
					ABILITY_TYPES,
					kv.get("AbilityType") as string,
					ABILITY_TYPES.ABILITY_TYPE_BASIC
				)
			: ABILITY_TYPES.ABILITY_TYPE_BASIC

		if (kv.has("MaxLevel")) {
			this.MaxLevel = parseInt(kv.get("MaxLevel") as string)
		} else if (kv.has("MaxUpgradeLevel")) {
			this.MaxLevel = parseInt(kv.get("MaxUpgradeLevel") as string)
		} else {
			this.MaxLevel =
				this.AbilityType === ABILITY_TYPES.ABILITY_TYPE_ULTIMATE ? 3 : 4
		}

		this.AbilityBehavior = kv.has("AbilityBehavior")
			? parseEnumString(
					DOTA_ABILITY_BEHAVIOR,
					kv.get("AbilityBehavior") as string,
					DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NONE
				)
			: DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NONE

		this.LinkedAbility = (kv.get("LinkedAbility") as string) ?? ""

		this.HasShardUpgrade = kv.has("HasShardUpgrade")
			? parseInt(kv.get("HasShardUpgrade") as string) === 1
			: false

		this.HasScepterUpgrade = kv.has("HasScepterUpgrade")
			? parseInt(kv.get("HasScepterUpgrade") as string) === 1
			: false

		this.AllowedInBackpack = kv.has("AllowedInBackpack")
			? parseInt(kv.get("AllowedInBackpack") as string) === 1
			: true

		this.IsInnate = kv.has("Innate")
			? parseInt(kv.get("Innate") as string) === 1
			: false

		this.ItemIsNeutralDrop = kv.has("ItemIsNeutralDrop")
			? parseInt(kv.get("ItemIsNeutralDrop") as string) === 1
			: false

		this.ItemIsNeutralActiveDrop = kv.has("ItemIsNeutralActiveDrop")
			? parseInt(kv.get("ItemIsNeutralActiveDrop") as string) === 1
			: false

		this.ShouldBeSuggested = kv.has("ShouldBeSuggested")
			? parseInt(kv.get("ShouldBeSuggested") as string)
			: -1

		this.TexturePath = (kv.get("AbilityTexturePath") as string) ?? ""
		this.TargetFlags = kv.has("AbilityUnitTargetFlags")
			? parseEnumString(
					DOTA_UNIT_TARGET_FLAGS,
					kv.get("AbilityUnitTargetFlags") as string,
					DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
				)
			: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
		this.TargetTeam = kv.has("AbilityUnitTargetTeam")
			? parseEnumString(
					DOTA_UNIT_TARGET_TEAM,
					kv.get("AbilityUnitTargetTeam") as string,
					DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE
				)
			: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE
		this.TargetType = kv.has("AbilityUnitTargetType")
			? parseEnumString(
					DOTA_UNIT_TARGET_TYPE,
					kv.get("AbilityUnitTargetType") as string,
					DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE
				)
			: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE
		this.SpellDispellableType = kv.has("SpellDispellableType")
			? parseEnumString(
					SPELL_DISPELLABLE_TYPES,
					kv.get("SpellDispellableType") as string,
					SPELL_DISPELLABLE_TYPES.SPELL_DISPELLABLE_NONE
				)
			: SPELL_DISPELLABLE_TYPES.SPELL_DISPELLABLE_NONE
		this.CastAnimation = kv.has("AbilityCastAnimation")
			? parseEnumString(GameActivity, kv.get("AbilityCastAnimation") as string, 0)
			: undefined
		this.SharedCooldownName = (kv.get("AbilitySharedCooldown") as string) ?? name
		this.ModelName = (kv.get("Model") as string) ?? ""
		this.AlternateModelName = (kv.get("ModelAlternate") as string) ?? ""
		this.DependentOnAbility = (kv.get("DependentOnAbility") as string) ?? ""
		// this.ItemRecipeName = m_pAbilityData.m_pszItemRecipeName
		this.IsItem = name.startsWith("item_")
		this.IsGrantedByScepter = kv.has("IsGrantedByScepter")
			? parseInt(kv.get("IsGrantedByScepter") as string) !== 0
			: false
		this.ID = kv.has("ID")
			? parseInt(kv.get("ID") as string)
			: (AbilityData.GetAbilityIDByName(name) ?? -1)
		this.EffectName = (kv.get("Effect") as string) ?? ""
		this.Cost = kv.has("ItemCost") ? parseInt(kv.get("ItemCost") as string) : 0
		this.Purchasable = kv.has("ItemPurchasable")
			? parseInt(kv.get("ItemPurchasable") as string) !== 0
			: false
		this.DamageType = kv.has("AbilityUnitDamageType")
			? parseEnumString(
					DAMAGE_TYPES,
					kv.get("AbilityUnitDamageType") as string,
					DAMAGE_TYPES.DAMAGE_TYPE_NONE
				)
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
			? parseEnumString(
					SPELL_IMMUNITY_TYPES,
					kv.get("SpellImmunityType") as string,
					0
				)
			: SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_NONE
		this.ItemDisplayCharges = kv.has("ItemDisplayCharges")
			? parseInt(kv.get("ItemDisplayCharges") as string) !== 0
			: false
		this.ItemHideCharges = kv.has("ItemHideCharges")
			? parseInt(kv.get("ItemHideCharges") as string) !== 0
			: true

		this.ManaCostCache = this.getLevelArray(
			kv.get("AbilityManaCost") as Nullable<string>
		)
		this.HasManaCostSpecial = this.SpecialValueCache.has("AbilityManaCost")
		this.CastRangeCache = this.getLevelArray(
			kv.get("AbilityCastRange") as Nullable<string>
		)
		this.HasCastRangeSpecial = this.SpecialValueCache.has("AbilityCastRange")
		this.ChannelTimeCache = this.getLevelArray(
			kv.get("AbilityChannelTime") as Nullable<string>
		)
		this.HasChannelTimeSpecial = this.SpecialValueCache.has("AbilityChannelTime")
		this.AbilityDamageCache = this.getLevelArray(
			kv.get("AbilityDamage") as Nullable<string>
		)
		this.HasAbilityDamageSpecial = this.SpecialValueCache.has("AbilityDamage")
		this.CastPointCache = this.getLevelArray(
			kv.get("AbilityCastPoint") as Nullable<string>
		)
		this.HasCastPointSpecial = this.SpecialValueCache.has("AbilityCastPoint")
		this.MaxChargesCache = this.getLevelArray(
			kv.get("AbilityCharges") as Nullable<string>
		)
		this.HasMaxChargesSpecial = this.SpecialValueCache.has("AbilityCharges")
		this.ChargeRestoreTimeCache = this.getLevelArray(
			kv.get("AbilityChargeRestoreTime") as Nullable<string>
		)
		this.HasChargeRestoreTimeSpecial = this.SpecialValueCache.has(
			"AbilityChargeRestoreTime"
		)
		this.MaxCooldownCache = this.getLevelArray(
			kv.get("AbilityCooldown") as Nullable<string>
		)
		this.HasMaxCooldownSpecial = this.SpecialValueCache.has("AbilityCooldown")
		this.MaxDurationCache = this.getLevelArray(
			kv.get("AbilityDuration") as Nullable<string>
		)
		this.HasMaxDurationSpecial = this.SpecialValueCache.has("AbilityDuration")
		this.HealthCostCache = this.getLevelArray(
			kv.get("AbilityHealthCost") as Nullable<string>
		)
		this.HasHealthCostSpecial = this.SpecialValueCache.has("AbilityHealthCost")
		this.SecretShop = kv.has("SecretShop")
			? parseInt(kv.get("SecretShop") as string) !== 0
			: false
		this.ItemSupport = kv.has("ItemSupport")
			? parseInt(kv.get("ItemSupport") as string) !== 0
			: false
		if (kv.has("ItemRequirements")) {
			const map = kv.get("ItemRequirements") as Map<string, string>
			map.forEach(str => this.ItemRequirements.push(str.split(";")))
		}
		if (kv.has("ItemAliases")) {
			this.ItemAliases = (kv.get("ItemAliases") as string).split(";")
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
					kv.get("ItemDisassembleRule") as string,
					DOTA_ITEM_DISASSEMBLE.DOTA_ITEM_DISASSEMBLE_NONE
				)
			: DOTA_ITEM_DISASSEMBLE.DOTA_ITEM_DISASSEMBLE_NONE

		this.IsTempestDoubleClonable = kv.has("IsTempestDoubleClonable")
			? parseInt(kv.get("IsTempestDoubleClonable") as string) !== 0
			: false

		this.SuggestPregame = kv.has("SuggestPregame")
			? parseInt(kv.get("SuggestPregame") as string) !== 0
			: false

		this.SpeciallyBannedFromNeutralSlot = kv.has("SpeciallyBannedFromNeutralSlot")
			? parseInt(kv.get("SpeciallyBannedFromNeutralSlot") as string) !== 0
			: false

		const hasSpecialValue = (values: string[]) =>
			values.some(valueName => this.SpecialValueCache.has(valueName))

		this.BonusStats = hasSpecialValue(allStats)
			? EDOTASpecialBonusStats.All
			: (hasSpecialValue(hpStats)
					? EDOTASpecialBonusStats.HP
					: EDOTASpecialBonusStats.None) |
				(hasSpecialValue(manaStats)
					? EDOTASpecialBonusStats.Mana
					: EDOTASpecialBonusStats.None)

		this.IsBreakable = kv.has("IsBreakable")
			? parseInt(kv.get("IsBreakable") as string) !== 0
			: false
	}
	public get ShouldBeDrawable(): boolean {
		return AbilityData.ShouldBeDrawable.has(this.name)
	}
	public get CanHitSpellImmuneEnemy(): boolean {
		switch (this.AbilityImmunityType) {
			case SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES:
			case SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES:
				return true
			default:
				return false
		}
	}
	public get CanHitSpellImmuneAlly(): boolean {
		switch (this.AbilityImmunityType) {
			case SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_NONE:
			case SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES_ENEMIES_NO:
				return true
			default:
				return this.CanHitSpellImmuneEnemy
		}
	}
	public get IsDispellable(): boolean {
		switch (this.SpellDispellableType) {
			case SPELL_DISPELLABLE_TYPES.SPELL_DISPELLABLE_NONE:
			case SPELL_DISPELLABLE_TYPES.SPELL_DISPELLABLE_YES_STRONG:
			case SPELL_DISPELLABLE_TYPES.SPELL_DISPELLABLE_YES:
				return true
			case SPELL_DISPELLABLE_TYPES.SPELL_DISPELLABLE_NO:
			default:
				return false
		}
	}
	public HasBehavior(flag: DOTA_ABILITY_BEHAVIOR): boolean {
		return this.AbilityBehavior.hasMask(flag)
	}
	public HasTargetTeam(flag: DOTA_UNIT_TARGET_TEAM): boolean {
		return this.TargetTeam.hasMask(flag)
	}
	public HasBonusStats(flag: EDOTASpecialBonusStats): boolean {
		return this.BonusStats.hasMask(flag)
	}
	public HasTargetFlags(flag: DOTA_UNIT_TARGET_FLAGS): boolean {
		return this.TargetFlags.hasMask(flag)
	}
	public HasTargetType(flag: DOTA_UNIT_TARGET_TYPE): boolean {
		return this.TargetType.hasMask(flag)
	}
	public GetTexturePath(altCastState: boolean, abilName?: string): string {
		if (!altCastState || abilName === undefined) {
			return this.TexturePath
		}
		const imagePath = "/" + abilName + "_secondary_png.vtex_c"
		return this.IsItem ? ItemImagePath + imagePath : AbilityImagePath + imagePath
	}
	public GetSpecialValue(
		specialName: string,
		level: number,
		abilityName?: string
	): number {
		if (level <= 0) {
			return 0
		}
		const ar = this.getCachedSpecialValue(specialName, abilityName)
		if (ar === undefined || ar.BaseValues.length === 0 || ar.RequiresFacet !== "") {
			return 0
		}
		return ar.BaseValues[Math.min(level, ar.BaseValues.length) - 1]
	}

	public GetSpecialValueWithTalent(
		owner: Unit,
		specialName: string,
		level: number,
		abilityName: string,
		{ useFacet, lvlup }: ISpecialValueOptions
	): number {
		if (level <= 0) {
			return 0
		}
		const specialValue = this.getCachedSpecialValue(specialName, abilityName)
		if (specialValue === undefined) {
			return 0
		}
		let baseVal =
			specialValue.BaseValues.length !== 0
				? specialValue.BaseValues[
						Math.min(level, specialValue.BaseValues.length) - 1
					]
				: 0
		if (
			(specialValue.RequiresShard && !owner.HasShard) ||
			(specialValue.RequiresScepter && !owner.HasScepter) ||
			(specialValue.RequiresFacet !== "" &&
				specialValue.RequiresFacet !== owner.HeroFacet)
		) {
			baseVal = 0
		}

		const arr = specialValue.LinkedSpecialBonuses,
			allSpecialBonuses: [EDOTASpecialBonusOperation, number, boolean][] = []
		for (let i = arr.length - 1; i > -1; i--) {
			const linkedSpecialBonus = arr[i]
			if (!linkedSpecialBonus.IsOld) {
				if (linkedSpecialBonus.Name === "hero_levelup") {
					if (lvlup) {
						switch (lvlup.operation) {
							case EDOTASpecialBonusOperation.SPECIAL_BONUS_MULTIPLY:
								baseVal *= owner.Level - (lvlup.subtract ?? 0)
								break
							case EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD:
								baseVal +=
									linkedSpecialBonus.NewData![0][1] *
									(owner.Level - (lvlup.subtract ?? 0))
								break
						}
					}
					continue
				}
				if (
					useFacet &&
					linkedSpecialBonus.Name.startsWith("special_bonus_facet_")
				) {
					if (owner.HeroFacet !== linkedSpecialBonus.Name.substring(20)) {
						continue
					}
				} else if (linkedSpecialBonus.Name === "special_bonus_shard") {
					if (!owner.HasShard) {
						continue
					}
				} else if (linkedSpecialBonus.Name === "special_bonus_scepter") {
					if (!owner.HasScepter) {
						continue
					}
				} else {
					const linkedSpecialBonusAbil = owner.GetAbilityByName(
						linkedSpecialBonus.Name
					)
					if (
						linkedSpecialBonusAbil === undefined ||
						linkedSpecialBonusAbil.Level <= 0
					) {
						continue
					}
				}
				allSpecialBonuses.push(
					linkedSpecialBonus.NewData![
						Math.min(level, linkedSpecialBonus.NewData!.length) - 1
					]
				)
			} else {
				const linkedSpecialBonusAbil = owner.GetAbilityByName(
					linkedSpecialBonus.Name
				)
				if (
					linkedSpecialBonusAbil === undefined ||
					linkedSpecialBonusAbil.Level <= 0
				) {
					continue
				}
				allSpecialBonuses.push([
					linkedSpecialBonus.OldData![0],
					linkedSpecialBonusAbil.GetSpecialValue(
						linkedSpecialBonus.OldData![1]
					),
					false
				])
			}
		}
		// calculate all special bonuses after validation
		allSpecialBonuses.orderByDescending(
			cb =>
				cb[0] === EDOTASpecialBonusOperation.SPECIAL_BONUS_SET ||
				cb[0] === EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
		)
		for (let i = allSpecialBonuses.length - 1; i > -1; i--) {
			const [operationType, value, flag] = allSpecialBonuses[i]
			switch (operationType) {
				default:
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD:
					baseVal += baseVal < 0 && flag ? -value : value
					break
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_SUBTRACT:
					baseVal -= value
					break
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_MULTIPLY:
					baseVal *= value
					break
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_PERCENTAGE_ADD:
					baseVal *= 1 + value / 100
					break
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_PERCENTAGE_SUBTRACT:
					baseVal *= 1 - value / 100
					break
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_SET:
					baseVal = value
					break
			}
		}
		if (specialValue.AffectedByCurio) {
			baseVal *= owner.ModifierManager.GetConditionalPercentageInternal(
				EModifierfunction.MODIFIER_PROPERTY_CURIO_MULTIPLIER_BONUS_CONSTANT
			)
		}
		if (specialValue.AffectedByAOEIncrease) {
			return this.increaseAOERadius(owner, baseVal)
		}
		return baseVal
	}

	public GetCastRange(level: number): number {
		if (level <= 0 || this.CastRangeCache.length === 0) {
			return 0
		}
		return this.CastRangeCache[Math.min(level, this.CastRangeCache.length) - 1]
	}

	public GetHealthCost(level: number): number {
		if (level <= 0 || this.HealthCostCache.length === 0) {
			return 0
		}
		return this.HealthCostCache[Math.min(level, this.HealthCostCache.length) - 1]
	}

	public GetManaCost(level: number): number {
		if (level <= 0 || this.ManaCostCache.length === 0) {
			return 0
		}
		return this.ManaCostCache[Math.min(level, this.ManaCostCache.length) - 1]
	}

	public GetMaxDurationForLevel(level: number): number {
		if (level <= 0 || this.MaxDurationCache.length === 0) {
			return 0
		}
		return this.MaxDurationCache[Math.min(level, this.MaxDurationCache.length) - 1]
	}

	public GetMaxCooldownForLevel(level: number): number {
		if (level <= 0 || this.MaxCooldownCache.length === 0) {
			return 0
		}
		return this.MaxCooldownCache[Math.min(level, this.MaxCooldownCache.length) - 1]
	}

	public GetChannelTime(level: number): number {
		if (level <= 0 || this.ChannelTimeCache.length === 0) {
			return 0
		}
		return this.ChannelTimeCache[Math.min(level, this.ChannelTimeCache.length) - 1]
	}

	public GetAbilityDamage(level: number): number {
		if (level <= 0 || this.AbilityDamageCache.length === 0) {
			return 0
		}
		return this.AbilityDamageCache[
			Math.min(level, this.AbilityDamageCache.length) - 1
		]
	}

	public GetCastPoint(level: number): number {
		if (level <= 0 || this.CastPointCache.length === 0) {
			return 0
		}
		return this.CastPointCache[Math.min(level, this.CastPointCache.length) - 1]
	}

	public GetMaxCharges(level: number): number {
		if (level <= 0 || this.MaxChargesCache.length === 0) {
			return 0
		}
		return this.MaxChargesCache[Math.min(level, this.MaxChargesCache.length) - 1]
	}

	public GetChargeRestoreTime(level: number): number {
		if (level <= 0 || this.ChargeRestoreTimeCache.length === 0) {
			return 0
		}
		return this.ChargeRestoreTimeCache[
			Math.min(level, this.ChargeRestoreTimeCache.length) - 1
		]
	}
	private increaseAOERadius(owner: Unit, baseRadius: number): number {
		const bonusConstant = owner.ModifierManager.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT
		)
		const bonusStacking = owner.ModifierManager.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT_STACKING,
			false,
			1,
			1
		)
		const percentage = owner.ModifierManager.GetPercentageHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_PERCENTAGE
		)
		return (baseRadius + (bonusConstant + bonusStacking)) * percentage
	}

	private getCachedSpecialValue(specialName: string, abilityName?: string) {
		const arData = this.SpecialValueCache.get(specialName)
		if (arData === undefined) {
			this.exceptionMessage(specialName, abilityName)
			return undefined
		}
		return arData
	}

	private parseFloat(str: string): number {
		return str !== "" ? parseFloat(str) : 0
	}

	private extractOldTalent(special: RecursiveMap): Nullable<ILinkedSpecialBonus> {
		const name = MapValueToString(special.get("LinkedSpecialBonus"))
		if (name === "") {
			return undefined
		}
		let linkedSpecialBonusOperation = EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
		const linkedSpecialBonusOperationStr = special.get("LinkedSpecialBonusOperation")
		if (typeof linkedSpecialBonusOperationStr === "string") {
			linkedSpecialBonusOperation =
				(EDOTASpecialBonusOperation as any)[linkedSpecialBonusOperationStr] ??
				linkedSpecialBonusOperation
		}
		return {
			Name: name,
			IsOld: true,
			OldData: [
				linkedSpecialBonusOperation,
				MapValueToString(special.get("LinkedSpecialBonusField"), "value")
			]
		}
	}

	private cacheSpecialValuesOld(kv: RecursiveMap) {
		const abilitySpecial = kv.get("AbilitySpecial") as RecursiveMap
		if (abilitySpecial === undefined) {
			return
		}
		abilitySpecial.forEach(special => {
			if (!(special instanceof Map)) {
				return
			}
			let finalName = "",
				finalValue = ""
			special.forEach((value, name) => {
				if (
					name === "var_type" ||
					name === "LinkedSpecialBonus" ||
					name === "levelkey" ||
					name === "ad_linked_abilities" ||
					name === "LinkedSpecialBonusOperation" ||
					name === "RequiresFacet" ||
					name === "RequiresShard" ||
					name === "RequiresScepter" ||
					name === "affected_by_aoe_increase" ||
					name === "" ||
					typeof value !== "string"
				) {
					return
				}
				finalName = name
				finalValue = value
			})
			const linkedSpecialBonusData = this.extractOldTalent(special)
			this.SpecialValueCache.set(finalName, {
				BaseValues: this.extendLevelArray(
					finalValue.split(" ").map(str => this.parseFloat(str))
				),
				LinkedSpecialBonuses:
					linkedSpecialBonusData !== undefined ? [linkedSpecialBonusData] : [],
				RequiresFacet: MapValueToString(special.get("RequiresFacet")),
				RequiresScepter: MapValueToBoolean(special.get("RequiresScepter")),
				RequiresShard: MapValueToBoolean(special.get("RequiresShard")),
				AffectedByCurio: MapValueToBoolean(special.get("apply_curio_bonus")),
				AffectedByAOEIncrease: MapValueToBoolean(
					special.get("affected_by_aoe_increase")
				)
			})
		})
	}

	private cacheSpecialValuesNew(kv: RecursiveMap) {
		const abilityValues = kv.get("AbilityValues") as RecursiveMap
		if (abilityValues === undefined) {
			return
		}
		abilityValues.forEach((special, name) => {
			if (!(special instanceof Map)) {
				if (typeof special === "string") {
					this.SpecialValueCache.set(name, {
						BaseValues: this.extendLevelArray(
							special.split(" ").map(str => this.parseFloat(str))
						),
						RequiresFacet: "",
						RequiresScepter: false,
						RequiresShard: false,
						AffectedByCurio: false,
						AffectedByAOEIncrease: false,
						LinkedSpecialBonuses: []
					})
				}
				return
			}

			const linkedSpecialBonuses: ILinkedSpecialBonus[] = []
			special.forEach((specialValue, specialName) => {
				if (
					specialName === "value" ||
					specialName === "CalculateSpellDamageTooltip" ||
					specialName === "DamageTypeTooltip" ||
					specialName === "levelkey" ||
					specialName === "LinkedSpecialBonusOperation" ||
					specialName === "RequiresFacet" ||
					specialName === "RequiresShard" ||
					specialName === "RequiresScepter" ||
					specialName === "affected_by_aoe_increase" ||
					specialName === "" ||
					typeof specialValue !== "string"
				) {
					return
				}

				if (specialName === "LinkedSpecialBonus") {
					// TODO: is this supposed to be in order like other talents?
					const oldLinkedSpecialBonus = this.extractOldTalent(special)
					if (oldLinkedSpecialBonus !== undefined) {
						linkedSpecialBonuses.push(oldLinkedSpecialBonus)
					}
					return
				}

				const linkedSpecialBonus: ILinkedSpecialBonus = {
					Name: specialName,
					IsOld: false,
					NewData: specialValue.split(" ").map(talentChangeStr => {
						if (talentChangeStr.startsWith("x")) {
							return [
								EDOTASpecialBonusOperation.SPECIAL_BONUS_MULTIPLY,
								this.parseFloat(talentChangeStr.substring(1)),
								false
							]
						} else if (talentChangeStr.startsWith("=")) {
							const newValue = this.parseFloat(talentChangeStr.substring(1))
							return [
								EDOTASpecialBonusOperation.SPECIAL_BONUS_SET,
								newValue,
								false
							]
						}
						let linkedSpecialBonusOperation =
							EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
						if (talentChangeStr.endsWith("%")) {
							talentChangeStr = talentChangeStr.substring(
								0,
								talentChangeStr.length - 1
							)
							linkedSpecialBonusOperation =
								EDOTASpecialBonusOperation.SPECIAL_BONUS_PERCENTAGE_ADD
						} else if (talentChangeStr.startsWith("+-")) {
							talentChangeStr = talentChangeStr.substring(2)
							return [
								linkedSpecialBonusOperation,
								this.parseFloat(talentChangeStr),
								true
							]
						}
						return [
							linkedSpecialBonusOperation,
							this.parseFloat(talentChangeStr),
							false
						]
					})
				}
				if (linkedSpecialBonus.NewData!.length !== 0) {
					linkedSpecialBonuses.push(linkedSpecialBonus)
				}
			})

			this.SpecialValueCache.set(name, {
				BaseValues: this.extendLevelArray(
					MapValueToString(special.get("value"))
						.split(" ")
						.map(str => this.parseFloat(str))
				),
				LinkedSpecialBonuses: linkedSpecialBonuses,
				RequiresFacet: MapValueToString(special.get("RequiresFacet")),
				RequiresScepter: MapValueToBoolean(special.get("RequiresScepter")),
				RequiresShard: MapValueToBoolean(special.get("RequiresShard")),
				AffectedByCurio: MapValueToBoolean(special.get("apply_curio_bonus")),
				AffectedByAOEIncrease: MapValueToBoolean(
					special.get("affected_by_aoe_increase")
				)
			})
		})
	}

	private extendLevelArray(ar: number[]): number[] {
		if (ar.length === 0) {
			ar.push(0)
		}
		return ar
	}

	private getLevelArray(str: Nullable<string>): number[] {
		return str?.split(" ")?.map(val => parseFloat(val)) ?? []
	}

	private exceptionMessage(specialName: string, abilityName?: string) {
		if (!AbilityData.HasDebug) {
			return
		}
		const abilName = abilityName ?? AbilityData.GetAbilityNameByID(this.ID)
		const keyName = `${abilName}:${specialName}`
		if (AbilityData.cacheWithoutSpecialData.has(keyName)) {
			return
		}
		console.error(
			new Error(
				`Failed to get special => [${specialName}] from ability => [${abilName}]`
			).stack
		)
		AbilityData.cacheWithoutSpecialData.add(keyName)
	}

	private clearAllData() {
		this.ItemRequirements.clear()
		this.SpecialValueCache.clear()
	}
}

function AbilityNameToPath(name: string, flash3: boolean, strip = false): string {
	const isItem = name.startsWith("item_")
	let texName = isItem && strip ? name.substring(5) : name
	if (texName.startsWith("frostivus")) {
		texName = texName.split("_").slice(1).join("_")
	}
	if (isItem && name.startsWith("item_recipe_")) {
		texName = "recipe"
	}
	if (flash3) {
		return isItem
			? `resource/flash3/images/items/${texName}.png`
			: `resource/flash3/images/spellicons/${texName}.png`
	}
	return isItem
		? `panorama/images/items/${texName}_png.vtex_c`
		: `panorama/images/spellicons/${texName}_png.vtex_c`
}

function TryGetAbilityTexturePath(texName: string, flash3: boolean): Nullable<string> {
	let path = AbilityNameToPath(texName, flash3)
	if (fexists(path)) {
		return path
	}
	path = AbilityNameToPath(texName, flash3, true)
	if (fexists(path)) {
		return path
	}
	return undefined
}

function TryGetAbilityTexturePath2(texName: string, flash3: boolean): Nullable<string> {
	const path = TryGetAbilityTexturePath(texName, flash3)
	if (path !== undefined) {
		return path
	}
	if (texName.startsWith("frostivus")) {
		texName = texName.split("_").slice(1).join("_")
	} else if (texName.startsWith("special_")) {
		texName = "attribute_bonus"
	} else {
		return undefined
	}
	return TryGetAbilityTexturePath(texName, flash3)
}

function TryGetAbilityTexturePath3(texName: string): Nullable<string> {
	const path = TryGetAbilityTexturePath2(texName, false)
	if (path !== undefined) {
		return path
	}
	return TryGetAbilityTexturePath2(texName, true)
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
		const texName = (map.get("AbilityTextureName") as string) ?? abilName
		const path =
			TryGetAbilityTexturePath3(texName) ??
			"panorama/images/spellicons/empty_png.vtex_c"
		map.set("AbilityTexturePath", path)
	}
	fixedCache.set(abilName, map)
	AbilityData.globalStorage.set(abilName, new AbilityData(abilName, map))
	return map
}

function LoadAbilityIdsFromKV(
	mapIdsData: Map<string, RecursiveMapValue>,
	keyName: string
) {
	const getData = mapIdsData.get(keyName)
	if (getData === undefined || !(getData instanceof Map)) {
		console.error(`Failed to load ${keyName}`)
		return
	}
	const getLocked = getData.get("Locked") as Map<string, string>
	if (getLocked === undefined || !(getLocked instanceof Map)) {
		console.error("Failed to load Locked")
		return
	}
	getLocked.forEach((abilID, abilName) => storageIds.set(parseFloat(abilID), abilName))
}

function LoadAbilityIds(mapIdsData: Map<string, RecursiveMapValue>) {
	LoadAbilityIdsFromKV(mapIdsData, "UnitAbilities")
	LoadAbilityIdsFromKV(mapIdsData, "ItemAbilities")
}

export function ReloadGlobalAbilityStorage() {
	AbilityData.DisposeAllData()
	try {
		LoadAbilityIds(
			createMapFromMergedIterators<string, RecursiveMapValue>(
				LoadFile("scripts/npc/npc_ability_ids.txt", "DOTAAbilityIDs").entries()
			)
		)
		const abilsMap = createMapFromMergedIterators<string, RecursiveMapValue>(
			...[...UnitData.globalStorage.keys()]
				.filter(name => name.includes("npc_dota_hero_"))
				.map(name => LoadFile(`scripts/npc/heroes/${name}.txt`).entries()),
			LoadFile("scripts/npc/npc_abilities.txt").entries(),
			LoadFile("scripts/npc/npc_abilities_custom.txt").entries(),
			LoadFile("scripts/npc/items.txt").entries(),
			LoadFile("scripts/npc/npc_items_custom.txt").entries()
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
