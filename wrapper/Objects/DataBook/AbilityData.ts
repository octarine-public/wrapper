import "../../../prototypes/array"

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
import { MapValueToBoolean, MapValueToString } from "../../Resources/ParseUtils"
import { createMapFromMergedIterators, parseEnumString } from "../../Utils/Utils"
import { Unit } from "../Base/Unit"
import { UnitData } from "./UnitData"

const storageIds: Map<number, string> = new Map()
function LoadFile(path: string, name: string = "DOTAAbilities"): RecursiveMap {
	const res = parseKV(path).get(name)
	return res instanceof Map ? res : new Map()
}

interface ILinkedSpecialBonus {
	Name: string
	IsOld: boolean
	OldData?: [EDOTASpecialBonusOperation, string]
	NewData?: [EDOTASpecialBonusOperation, number][]
}

interface ISpecialValue {
	BaseValues: number[]
	RequiresFacet: string
	RequiresScepter: boolean
	RequiresShard: boolean
	AffectedByAOEIncrease: boolean
	LinkedSpecialBonuses: ILinkedSpecialBonus[]
}

export class AbilityData {
	public static readonly empty = new AbilityData("", new Map())
	public static readonly globalStorage: Map<string, AbilityData> = new Map()
	private static readonly cacheWithoutSpecialData = new Set<string>()

	public static DisposeAllData() {
		storageIds.clear()
		this.globalStorage.clear()
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
	public readonly MaxLevel: number
	public readonly TexturePath: string
	public readonly TargetFlags: number // DOTA_UNIT_TARGET_FLAGS bitmask
	public readonly TargetTeam: number // DOTA_UNIT_TARGET_TEAM bitmask
	public readonly TargetType: number // DOTA_UNIT_TARGET_TYPE bitmask
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
	// public readonly DispellableType: SPELL_DISPELLABLE_TYPES
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
	public readonly ShouldBeSuggested: number
	public readonly CastAnimation: Nullable<GameActivity>
	public readonly LinkedAbility: string
	public readonly ShouldBeInitiallySuggested: boolean
	public readonly ItemStockInitial: Nullable<number>
	public readonly ItemDisassembleRule: DOTA_ITEM_DISASSEMBLE

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

	public readonly HasAffectedByAOEIncrease: boolean

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

	constructor(name: string, kv: RecursiveMap) {
		this.DisposeAllData()
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

		this.HasAffectedByAOEIncrease = false
		for (const [, special] of this.SpecialValueCache) {
			if (special.AffectedByAOEIncrease) {
				this.HasAffectedByAOEIncrease = true
				break
			}
		}

		this.AbilityBehavior = kv.has("AbilityBehavior")
			? parseEnumString(
					DOTA_ABILITY_BEHAVIOR,
					kv.get("AbilityBehavior") as string,
					0n
				)
			: DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NONE

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

		this.IsInnate = kv.has("Innate")
			? parseInt(kv.get("Innate") as string) === 1
			: false

		this.ItemIsNeutralDrop = kv.has("ItemIsNeutralDrop")
			? parseInt(kv.get("ItemIsNeutralDrop") as string) === 1
			: false

		this.TexturePath = (kv.get("AbilityTexturePath") as string) ?? ""
		this.TargetFlags = kv.has("AbilityUnitTargetFlags")
			? parseEnumString(
					DOTA_UNIT_TARGET_FLAGS,
					kv.get("AbilityUnitTargetFlags") as string,
					0
				)
			: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
		this.TargetTeam = kv.has("AbilityUnitTargetTeam")
			? parseEnumString(
					DOTA_UNIT_TARGET_TEAM,
					kv.get("AbilityUnitTargetTeam") as string,
					0
				)
			: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE
		this.TargetType = kv.has("AbilityUnitTargetType")
			? parseEnumString(
					DOTA_UNIT_TARGET_TYPE,
					kv.get("AbilityUnitTargetType") as string,
					0
				)
			: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE
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
			: AbilityData.GetAbilityIDByName(name) ?? -1
		this.EffectName = (kv.get("Effect") as string) ?? ""
		this.Cost = kv.has("ItemCost") ? parseInt(kv.get("ItemCost") as string) : 0
		this.Purchasable = kv.has("ItemPurchasable")
			? parseInt(kv.get("ItemPurchasable") as string) !== 0
			: false
		this.DamageType = kv.has("AbilityUnitDamageType")
			? parseEnumString(DAMAGE_TYPES, kv.get("AbilityUnitDamageType") as string, 0)
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

		this.ManaCostCache = this.GetLevelArray(
			kv.get("AbilityManaCost") as Nullable<string>
		)
		this.HasManaCostSpecial = this.SpecialValueCache.has("AbilityManaCost")
		this.CastRangeCache = this.GetLevelArray(
			kv.get("AbilityCastRange") as Nullable<string>
		)
		this.HasCastRangeSpecial = this.SpecialValueCache.has("AbilityCastRange")
		this.ChannelTimeCache = this.GetLevelArray(
			kv.get("AbilityChannelTime") as Nullable<string>
		)
		this.HasChannelTimeSpecial = this.SpecialValueCache.has("AbilityChannelTime")
		this.AbilityDamageCache = this.GetLevelArray(
			kv.get("AbilityDamage") as Nullable<string>
		)
		this.HasAbilityDamageSpecial = this.SpecialValueCache.has("AbilityDamage")
		this.CastPointCache = this.GetLevelArray(
			kv.get("AbilityCastPoint") as Nullable<string>
		)
		this.HasCastPointSpecial = this.SpecialValueCache.has("AbilityCastPoint")
		this.MaxChargesCache = this.GetLevelArray(
			kv.get("AbilityCharges") as Nullable<string>
		)
		this.HasMaxChargesSpecial = this.SpecialValueCache.has("AbilityCharges")
		this.ChargeRestoreTimeCache = this.GetLevelArray(
			kv.get("AbilityChargeRestoreTime") as Nullable<string>
		)
		this.HasChargeRestoreTimeSpecial = this.SpecialValueCache.has(
			"AbilityChargeRestoreTime"
		)
		this.MaxCooldownCache = this.GetLevelArray(
			kv.get("AbilityCooldown") as Nullable<string>
		)
		this.HasMaxCooldownSpecial = this.SpecialValueCache.has("AbilityCooldown")
		this.MaxDurationCache = this.GetLevelArray(
			kv.get("AbilityDuration") as Nullable<string>
		)
		this.HasMaxDurationSpecial = this.SpecialValueCache.has("AbilityDuration")
		this.HealthCostCache = this.GetLevelArray(
			kv.get("AbilityHealthCost") as Nullable<string>
		)
		this.HasHealthCostSpecial = this.SpecialValueCache.has("AbilityHealthCost")
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
					kv.get("ItemDisassembleRule") as string,
					0
				)
			: DOTA_ITEM_DISASSEMBLE.DOTA_ITEM_DISASSEMBLE_NONE
	}

	public DisposeAllData() {
		this.ItemRequirements.clear()
		this.SpecialValueCache.clear()
	}

	public HasBehavior(flag: DOTA_ABILITY_BEHAVIOR): boolean {
		return this.AbilityBehavior.hasMask(flag)
	}

	public GetSpecialValue(
		specialName: string,
		level: number,
		abilityName?: string
	): number {
		if (level <= 0) {
			return 0
		}
		const ar = this.GetCachedSpecialValue(specialName, abilityName)
		if (ar === undefined || ar.BaseValues.length === 0 || ar.RequiresFacet !== "") {
			return 0
		}
		return ar.BaseValues[Math.min(level, ar.BaseValues.length) - 1]
	}

	public GetSpecialValueWithTalent(
		owner: Unit,
		specialName: string,
		level: number,
		abilityName: string
	): number {
		if (level <= 0) {
			return 0
		}
		const specialValue = this.GetCachedSpecialValue(specialName, abilityName)
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
		for (const linkedSpecialBonus of specialValue.LinkedSpecialBonuses) {
			let data: [EDOTASpecialBonusOperation, number]
			if (!linkedSpecialBonus.IsOld) {
				if (linkedSpecialBonus.Name.startsWith("special_bonus_facet_")) {
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
				data =
					linkedSpecialBonus.NewData![
						Math.min(level, linkedSpecialBonus.NewData!.length) - 1
					]
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
				data = [
					linkedSpecialBonus.OldData![0],
					linkedSpecialBonusAbil.GetSpecialValue(linkedSpecialBonus.OldData![1])
				]
			}
			switch (data[0]) {
				default:
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD:
					baseVal += data[1]
					break
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_SUBTRACT:
					baseVal -= data[1]
					break
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_MULTIPLY:
					baseVal *= data[1]
					break
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_PERCENTAGE_ADD:
					baseVal *= 1 + data[1] / 100
					break
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_PERCENTAGE_SUBTRACT:
					baseVal *= 1 - data[1] / 100
					break
				case EDOTASpecialBonusOperation.SPECIAL_BONUS_SET:
					baseVal = data[1]
					break
			}
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

	public GetCachedSpecialValue(specialName: string, abilityName?: string) {
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

	private ExtractOldTalent(special: RecursiveMap): Nullable<ILinkedSpecialBonus> {
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
	private CacheSpecialValuesOld(kv: RecursiveMap) {
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
			const linkedSpecialBonusData = this.ExtractOldTalent(special)
			this.SpecialValueCache.set(finalName, {
				BaseValues: this.ExtendLevelArray(
					finalValue.split(" ").map(str => this.parseFloat(str))
				),
				LinkedSpecialBonuses:
					linkedSpecialBonusData !== undefined ? [linkedSpecialBonusData] : [],
				RequiresFacet: MapValueToString(special.get("RequiresFacet")),
				RequiresScepter: MapValueToBoolean(special.get("RequiresScepter")),
				RequiresShard: MapValueToBoolean(special.get("RequiresShard")),
				AffectedByAOEIncrease: MapValueToBoolean(
					special.get("affected_by_aoe_increase")
				)
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
					this.SpecialValueCache.set(name, {
						BaseValues: this.ExtendLevelArray(
							special.split(" ").map(str => this.parseFloat(str))
						),
						RequiresFacet: "",
						RequiresScepter: false,
						RequiresShard: false,
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
					const oldLinkedSpecialBonus = this.ExtractOldTalent(special)
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
								this.parseFloat(talentChangeStr.substring(1))
							]
						} else if (talentChangeStr.startsWith("=")) {
							const newValue = this.parseFloat(talentChangeStr.substring(1))
							return [
								EDOTASpecialBonusOperation.SPECIAL_BONUS_SET,
								newValue
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
						}
						return [
							linkedSpecialBonusOperation,
							this.parseFloat(talentChangeStr)
						]
					})
				}
				if (linkedSpecialBonus.NewData!.length !== 0) {
					linkedSpecialBonuses.push(linkedSpecialBonus)
				}
			})

			this.SpecialValueCache.set(name, {
				BaseValues: this.ExtendLevelArray(
					MapValueToString(special.get("value"))
						.split(" ")
						.map(str => this.parseFloat(str))
				),
				LinkedSpecialBonuses: linkedSpecialBonuses,
				RequiresFacet: MapValueToString(special.get("RequiresFacet")),
				RequiresScepter: MapValueToBoolean(special.get("RequiresScepter")),
				RequiresShard: MapValueToBoolean(special.get("RequiresShard")),
				AffectedByAOEIncrease: MapValueToBoolean(
					special.get("affected_by_aoe_increase")
				)
			})
		})
	}

	private ExtendLevelArray(ar: number[]): number[] {
		if (ar.length === 0) {
			ar.push(0)
		}
		return ar
	}

	private GetLevelArray(str: Nullable<string>): number[] {
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
