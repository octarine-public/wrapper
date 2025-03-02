import {
	ArmorPerAgility,
	AttackSpeedData,
	MagicResistPerIntellect,
	MeleeDamageBlockAmount,
	MoveSpeedData
} from "../../Data/GameData"
import { Attributes } from "../../Enums/Attributes"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { EModifierfunction } from "../../Enums/EModifierfunction"
import { ModifierHandlerValue, ModifierMapFieldHandler } from "../Base/Modifier"
import { Unit } from "../Base/Unit"

type ModifierfunctionMap = Map<EModifierfunction, ModifierHandlerValue[]>

export class UnitModifierManager {
	/** @private NOTE: this is internal field use Unit#CanUseItems */
	public CanUseAllItems_: boolean = true
	/** @private NOTE: this is internal field use Unit#NoIntellect */
	public NoIntellect_: boolean = false
	/** @private NOTE: this is internal field use Unit#HasAeigs */
	public HasAeigs_: boolean = false
	/** @private NOTE: this is internal field use Unit#IsTempestDouble */
	public IsTempestDouble_: boolean = false
	/** @private NOTE: this is internal field use Unit#IsChargeOfDarkness */
	public IsChargeOfDarkness_: boolean = false
	/** @private NOTE: this is internal field use Unit#IsClone */
	public IsClone_: boolean = false
	/** @private NOTE: this is internal field use Unit#IsIllusion */
	public IsIllusion_: boolean = false
	/** @private NOTE: this is internal field use Unit#IsReflection */
	public IsReflection_: boolean = false
	/** @private NOTE: this is internal field use Unit#IsStrongIllusion */
	public IsStrongIllusion_: boolean = false
	/** @private NOTE: this is internal field use Unit#IsFountainInvulnerable */
	public IsFountainInvulnerable_: boolean = false
	/** @private NOTE: this is internal */
	public IsMorphlingReplicateIllusion_: boolean = false

	private readonly eModifierfunctions: ModifierfunctionMap = new Map()

	constructor(public readonly Owner: Unit) {}

	public get AttacksPerSecond(): number {
		const fixedAttackRate = this.GetConstantLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_FIXED_ATTACK_RATE
		)
		if (fixedAttackRate !== 0) {
			return 1 / fixedAttackRate
		}
		return this.Owner.AttackSpeed / 100 / this.Owner.BaseAttackTime
	}
	public get ArmorPerAgility(): number {
		const percentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_BASE_ARMOR_PER_AGI_BONUS_PERCENTAGE,
			false,
			1,
			1
		)
		return this.Owner.TotalAgility * ArmorPerAgility * percentage
	}
	public get MagicResistPerIntellect(): number {
		const percentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_BASE_MRES_PER_INT_BONUS_PERCENTAGE,
			false,
			1,
			1
		)
		return this.Owner.TotalIntellect * MagicResistPerIntellect * percentage
	}
	public get SlowResistance(): number {
		const slowResistUnique = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_UNIQUE
		)
		const slowResistStacking = this.GetPercentageMultiplicativeInternal(
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING
		)
		return 1 - (1 - (slowResistStacking - 1)) * (1 - slowResistUnique / 100)
	}
	public get StatusResistance(): number {
		const status = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE
		)
		const stacking = this.GetPercentageMultiplicativeInternal(
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING
		)
		return Math.min(1 - (1 - (stacking - 1)) * (1 - status / 100), Number.MAX_VALUE)
	}
	public get SpellAmplification(): number {
		const percentage = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			false,
			1,
			1
		)
		const uniquePercentage = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_UNIQUE
		)
		return uniquePercentage + percentage
	}
	public get SpellAmplificationTarget(): number {
		const targetPercentage = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_TARGET,
			false,
			1,
			1
		)
		return targetPercentage
	}
	public get IsSuppressCrit(): boolean {
		const suppressCrit = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_SUPPRESS_CRIT
		)
		return suppressCrit !== 0
	}
	public get IsAvoidTotalDamage() {
		return (
			this.GetConstantFirstInternal(
				EModifierfunction.MODIFIER_PROPERTY_AVOID_DAMAGE
			) !== 0
		)
	}
	public get IsConvertManaCostToHPCost(): boolean {
		const manaCostToHP = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_CONVERT_MANA_COST_TO_HEALTH_COST
		)
		return manaCostToHP !== 0
	}
	public GetAttackDamageConvertPhysicalToMagical(target: Unit): boolean {
		const toMagical = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_CONVERT_PHYSICAL_TO_MAGICAL,
			false,
			{ SourceIndex: target.Index }
		)
		return toMagical !== 0
	}
	public GetBaseBonusPhysicalArmor(baseArmor: number): number {
		const ignoreArmor = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_PHYSICAL_ARMOR
		)
		if (ignoreArmor !== 0) {
			return 0
		}
		const basePercentage = this.GetPercentageLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE
		)
		const totalPercentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_TOTAL_PERCENTAGE,
			false,
			1,
			1
		)
		const totalBonus = totalPercentage * this.ArmorPerAgility
		return (baseArmor + totalBonus) * basePercentage
	}
	public GetBaseTurnRate(baseTurnRate: number): number {
		const overrideTurnRate = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_TURN_RATE_OVERRIDE
		)
		return overrideTurnRate !== 0 ? overrideTurnRate : baseTurnRate
	}
	public GetBaseAttackTime(baseAttackTime: number): number {
		const attackTimeAdjust = this.GetConstantFirstInternal(
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT_ADJUST
		)
		const attackTimePercentage = this.GetPercentageMultiplicativeInternal(
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_PERCENTAGE
		)
		const attackTimeConstant = this.GetConstantFirstInternal(
			EModifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT
		)
		if (attackTimeConstant - attackTimeAdjust <= 0) {
			return (baseAttackTime - attackTimeAdjust) * attackTimePercentage
		}
		return attackTimeConstant - attackTimeAdjust
	}
	public GetBaseAttackSpeed(baseAttackSpeed: number): number {
		const overrideBaseSpeed = this.GetConstantLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BASE_OVERRIDE
		)
		return overrideBaseSpeed !== 0 ? overrideBaseSpeed : baseAttackSpeed
	}
	public GetBaseAttackRange(baseAttackRange: number): number {
		const overrideBaseAttackRange = this.GetConstantLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BASE_OVERRIDE
		)
		return overrideBaseAttackRange !== 0 ? overrideBaseAttackRange : baseAttackRange
	}
	public GetBaseMoveSpeed(baseMoveSpeed: number): number {
		const overrideBaseSpeed = this.GetConstantLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE
		)
		return overrideBaseSpeed !== 0 ? overrideBaseSpeed : baseMoveSpeed
	}
	public GetBaseAttributePrimary(basePrimary: Attributes): Attributes {
		const primaryAttributeSrtength = this.GetConstantFirstInternal(
			EModifierfunction.MODIFIER_PROPERTY_BECOME_STRENGTH
		)
		if (primaryAttributeSrtength !== 0) {
			return Attributes.DOTA_ATTRIBUTE_STRENGTH
		}
		const primaryAttributeAgility = this.GetConstantFirstInternal(
			EModifierfunction.MODIFIER_PROPERTY_BECOME_AGILITY
		)
		if (primaryAttributeAgility !== 0) {
			return Attributes.DOTA_ATTRIBUTE_AGILITY
		}
		const primaryAttributeIntelligence = this.GetConstantFirstInternal(
			EModifierfunction.MODIFIER_PROPERTY_BECOME_INTELLIGENCE
		)
		if (primaryAttributeIntelligence !== 0) {
			return Attributes.DOTA_ATTRIBUTE_INTELLECT
		}
		const primaryAttributeAll = this.GetConstantFirstInternal(
			EModifierfunction.MODIFIER_PROPERTY_BECOME_UNIVERSAL
		)
		return primaryAttributeAll !== 0 ? Attributes.DOTA_ATTRIBUTE_ALL : basePrimary
	}
	public GetBaseMagicResistance(baseResist: number): number {
		const baseReduction = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BASE_REDUCTION,
			false,
			1,
			1
		)
		const totalBaseBonus = baseResist + this.MagicResistPerIntellect
		return (100 - baseReduction) * (totalBaseBonus / 100)
	}
	public GetAttackAnimationPoint(baseAnimationPoint: number): number {
		const overridePoint = this.GetConstantFirstInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_POINT_CONSTANT
		)
		if (overridePoint !== 0) {
			return overridePoint
		}
		const percentage = this.GetConstantFirstInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_ANIM_TIME_PERCENTAGE
		)
		const baseIncrease = baseAnimationPoint + AttackSpeedData.SpecialAttackDelay
		return baseIncrease * ((100 - percentage) / 100)
	}
	public GetAttackSpeed(baseAttackSpeed: number): number {
		const reduction = this.GetPercentageLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_REDUCTION_PERCENTAGE
		)
		const bonusConstant = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			false,
			1,
			reduction
		)
		const percentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_PERCENTAGE,
			false,
			1,
			1
		)
		const ignoreLimit = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_ATTACKSPEED_LIMIT
		)
		let totalSpeed = (baseAttackSpeed + bonusConstant) * percentage
		if (ignoreLimit === 0) {
			totalSpeed = Math.clamp(totalSpeed, AttackSpeedData.Min, AttackSpeedData.Max)
		}
		const absoluteMax = this.GetConstantLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_ABSOLUTE_MAX
		)
		if (absoluteMax !== 0) {
			totalSpeed = Math.min(totalSpeed, absoluteMax)
		}
		return totalSpeed
	}
	public GetAttackRange(baseRange: number): number {
		const bonusUnique = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_UNIQUE
		)
		const args = [false, 1, 1] as const
		const bonus = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			...args
		)
		const bonusPercentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_PERCENTAGE,
			...args
		)
		const maxAttackRange = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MAX_ATTACK_RANGE
		)
		const totalAttackRange = (baseRange + bonusUnique + bonus) * bonusPercentage
		return maxAttackRange <= 0 ? totalAttackRange : maxAttackRange
	}
	public GetTurnRate(baseTurnRate: number): number {
		const bonus = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_TURN_RATE_CONSTANT,
			false,
			1,
			1
		)
		const percentage = this.GetPercentageMultiplicativeInternal(
			EModifierfunction.MODIFIER_PROPERTY_TURN_RATE_PERCENTAGE
		)
		return percentage * (baseTurnRate + bonus)
	}
	public GetMoveSpeed(baseSpeed: number, isUnslowable: boolean = false): number {
		let slowValue = 1
		if (isUnslowable || this.Owner.IsUnslowable) {
			slowValue = 0
		}

		const reductionPercentage = this.GetPercentageLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_REDUCTION_PERCENTAGE
		)

		const reductionValue = reductionPercentage * slowValue
		const effReduction = (1 - this.SlowResistance) * reductionValue

		const bonusConstant = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			isUnslowable,
			1,
			effReduction
		)

		const bonusConstantUnique = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE
		)

		const bonusConstantUnique2 = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE_2
		)

		const bonusPercentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			isUnslowable,
			1,
			effReduction
		)

		const bonusPercentageUnique = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE
		)

		const bonusUnique = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE
		)

		const postMultiplier = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_POST_MULTIPLIER_BONUS_CONSTANT,
			isUnslowable,
			1,
			effReduction
		)

		const ignoreSpeedLimit = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT
		)

		const calculateBonuses =
			baseSpeed +
			bonusConstant +
			bonusUnique +
			bonusConstantUnique +
			bonusConstantUnique2

		const { Min, Max } = MoveSpeedData
		const effBonusPercentage = bonusPercentageUnique / 100

		let calculatedSpeed =
			calculateBonuses * (effBonusPercentage + bonusPercentage) + postMultiplier

		if (ignoreSpeedLimit === 0) {
			let maxOverride = this.GetConstantLowestInternal(
				EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_MAX_OVERRIDE
			)
			const maxBonusConstant = this.GetConditionalAdditiveInternal(
				EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_MAX_BONUS_CONSTANT
			)
			if (maxOverride === 0) {
				maxOverride = Max
			}
			baseSpeed = maxOverride + maxBonusConstant
			calculatedSpeed = Math.min(calculatedSpeed, baseSpeed)
		}

		const minOverride = this.GetConstantLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_MIN_OVERRIDE
		)

		calculatedSpeed = Math.max(
			calculatedSpeed,
			minOverride || Min + this.SlowResistance * 100
		)

		const absoluteSpeed = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE
		)

		const absoluteSpeedMin = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN
		)

		const absoluteSpeedMax = this.GetConstantLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MAX
		)

		if (absoluteSpeed > 0 || absoluteSpeedMin > 0) {
			if (absoluteSpeedMax <= 0) {
				calculatedSpeed =
					absoluteSpeedMin <= 0
						? absoluteSpeed
						: Math.max(
								Math.max(absoluteSpeedMin, calculatedSpeed),
								absoluteSpeed
							)
			} else {
				calculatedSpeed = absoluteSpeedMax
			}
		} else if (absoluteSpeedMax > 0) {
			calculatedSpeed = absoluteSpeedMax
		}

		const speedLimit = this.GetConstantLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_LIMIT
		)

		if (speedLimit === 0 || isUnslowable) {
			return calculatedSpeed
		}

		return Math.max(Math.min(speedLimit, calculatedSpeed), 0)
	}
	public GetPhysicalArmor(baseArmor: number): number {
		const ignoreArmor = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_PHYSICAL_ARMOR
		)
		if (ignoreArmor !== 0) {
			return 0
		}
		const bonus = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			false,
			1,
			1
		)
		const bonusUnique = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE
		)
		const bonusUniqueActive = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE
		)
		const baseBonusArmor = this.GetBaseBonusPhysicalArmor(baseArmor)
		return baseBonusArmor + bonus + bonusUnique + bonusUniqueActive
	}
	public GetMagicResistance(baseResist: number, ignoreMagicResist?: boolean): number {
		const bonus = this.GetPercentageMultiplicativeInternal(
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			false,
			false,
			false,
			{ IgnoreMagicResist: ignoreMagicResist ?? false }
		)
		const decrepify = this.GetConstantLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE
		)
		const bonusUnique = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS_UNIQUE
		)
		const directModification = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DIRECT_MODIFICATION,
			false,
			1,
			1
		)
		const direct = 1 - (directModification + 100) / 100
		const totalMul = (2 - bonus) * (1 - decrepify / 100) * (1 - bonusUnique / 100)
		return 1 - (direct + (1 - baseResist / 100)) * totalMul
	}
	public GetPredictiveArmor(target: Unit): number {
		return this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_PHYSICAL_ARMOR_BONUS_TARGET,
			false,
			1,
			1,
			{ SourceIndex: target.Index }
		)
	}
	public GetTimeVisionRange(
		baseVision: number,
		isNight: boolean,
		ignoreFixedVision: boolean = false
	) {
		return !isNight
			? this.GetDayTimeVisionRange(baseVision, ignoreFixedVision)
			: this.GetNightTimeVisionRange(baseVision, ignoreFixedVision)
	}
	public GetNightTimeVisionRange(
		baseVision: number,
		ignoreFixedVision: boolean = false
	): number {
		const bonusNightVision = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION
		)
		const bonusVisionPercentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_BONUS_VISION_PERCENTAGE,
			false,
			1,
			1
		)
		const fixedNightVision = !ignoreFixedVision
			? this.GetConstantHighestInternal(
					EModifierfunction.MODIFIER_PROPERTY_FIXED_NIGHT_VISION
				)
			: 0
		const bonusNightVisionUnique = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION_UNIQUE
		)
		const calcNightVision =
			(baseVision + bonusNightVision) * bonusVisionPercentage +
			bonusNightVisionUnique

		const totalNightVision =
			fixedNightVision <= 0 || calcNightVision <= fixedNightVision
				? calcNightVision
				: fixedNightVision

		return Math.max(totalNightVision, 200)
	}
	public GetDayTimeVisionRange(
		baseVision: number,
		ignoreFixedVision: boolean = false
	): number {
		const bonusDayVision = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION
		)
		const args = [false, 1, 1] as const
		const bonusVisionPercentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_BONUS_VISION_PERCENTAGE,
			...args
		)
		const bonusDayVisionPercentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION_PERCENTAGE,
			...args
		)
		const fixedDayVision = !ignoreFixedVision
			? this.GetConstantHighestInternal(
					EModifierfunction.MODIFIER_PROPERTY_FIXED_DAY_VISION
				)
			: 0

		const calcDayVision =
			(baseVision + bonusDayVision) *
			bonusVisionPercentage *
			bonusDayVisionPercentage

		const totalDayVision =
			fixedDayVision <= 0 || calcDayVision <= fixedDayVision
				? calcDayVision
				: fixedDayVision

		return Math.max(totalDayVision, 200)
	}
	public GetDamageBlock(
		damage: number,
		damageType: DAMAGE_TYPES,
		isRaw: boolean
	): number {
		if (isRaw) {
			return this.GetRawDamageBlock(damage, damageType)
		}
		const params: IModifierParams = { Damage: damage }
		const args = [false, params] as const
		let damageBlock = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			...args
		)
		switch (damageType) {
			case DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL:
				damageBlock += this.GetConstantHighestInternal(
					EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK_SPECIAL,
					...args
				)
				break
			case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
				damageBlock += this.GetConstantHighestInternal(
					EModifierfunction.MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK,
					...args
				)
				break
		}
		return damageBlock
	}
	public GetRawDamageBlock(rawDamage: number, damageType: DAMAGE_TYPES): number {
		const params: IModifierParams = { RawDamage: rawDamage }
		const args = [false, params] as const
		let damageBlock = 0
		switch (damageType) {
			case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
				damageBlock += this.GetConstantHighestInternal(
					EModifierfunction.MODIFIER_PROPERTY_RAW_MAGICAL_CONSTANT_BLOCK,
					...args
				)
				break
		}
		return damageBlock
	}
	public GetPassiveDamageBlock(damageType: DAMAGE_TYPES): number {
		if (!this.Owner.IsHero) {
			return 0
		}
		if (damageType !== DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL) {
			return 0
		}
		const overrideBlock = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK
		)
		return Math.max(overrideBlock, !this.Owner.IsRanged ? MeleeDamageBlockAmount : 0)
	}
	public GetCritDamageBonus(target: Unit): number {
		const critDamage = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_CRITICAL_STRIKE_BONUS,
			false,
			1,
			1,
			{ SourceIndex: target.Index }
		)
		return Math.max(critDamage / 100, 1)
	}
	public GetCritDamageBonusTarget(target: Unit): number {
		const critDamage = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_TARGET_CRITICALSTRIKE,
			false,
			1,
			1,
			{ SourceIndex: target.Index }
		)
		return Math.max(critDamage / 100, 1)
	}
	public GetIncomingRawAttackDamage(target: Unit): number {
		const percentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_RAW_INCOMING_DAMAGE_PERCENTAGE,
			false,
			1,
			1,
			{ SourceIndex: target.Index }
		)
		return percentage
	}
	public GetIncomingAttackDamage(target: Unit, isRaw: boolean): number {
		const args = [false, 1, 1, { SourceIndex: target.Index }] as const
		if (isRaw) {
			return this.GetConditionalPercentageInternal(
				EModifierfunction.MODIFIER_PROPERTY_PREATTACK_RAW_INCOMING_DAMAGE_PERCENTAGE,
				...args
			)
		}
		const pre = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_INCOMING_DAMAGE_PERCENTAGE,
			...args
		)
		const proc = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_INCOMING_DAMAGE_PERCENTAGE,
			...args
		)
		return pre * proc
	}
	public GetIncomingDamage(target: Unit, damageType: DAMAGE_TYPES): number {
		const params: IModifierParams = { SourceIndex: target.Index }
		const args = [false, 1, 1, params] as const
		let totalIncDamage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			...args
		)
		switch (damageType) {
			case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
				break
			case DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL: {
				totalIncDamage *= this.GetConditionalPercentageInternal(
					EModifierfunction.MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE,
					...args
				)
				break
			}
		}
		return totalIncDamage
	}
	public GetOutgoingDamage(target: Unit, damageType: DAMAGE_TYPES): number {
		const params: IModifierParams = { SourceIndex: target.Index }
		const args = [false, 1, 1, params] as const
		const total = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			...args
		)
		const illusion = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION,
			...args
		)
		switch (damageType) {
			case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
				break
			case DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL:
				break
		}
		return total * illusion
	}
	public GetProcAttackDamageBonus(target: Unit, damageType: DAMAGE_TYPES): number {
		const paramsTarget: IModifierParams = {
			SourceIndex: target.Index
		}
		const args = [false, 1, 1, paramsTarget] as const
		switch (damageType) {
			case DAMAGE_TYPES.DAMAGE_TYPE_PURE:
				return this.GetConditionalAdditiveInternal(
					EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE,
					...args
				)
			case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL: {
				const bonusCaster = this.GetConditionalAdditiveInternal(
					EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
					...args
				)
				const bonusTarget = target.ModifierManager.GetConditionalAdditiveInternal(
					EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL_TARGET,
					false,
					1,
					1,
					{ SourceIndex: this.Owner.Index }
				)
				return bonusCaster + bonusTarget
			}
			default:
				return 0
		}
	}
	public GetPreAttackDamageBonus(baseDamage?: number, target?: Unit): number {
		const ignoreBonusDamage = this.GetConstantFirstInternal(
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_PREATTACK_BONUS_DAMAGE
		)
		if (ignoreBonusDamage !== 0) {
			return baseDamage ?? 0
		}
		const minDamage = this.Owner.AttackDamageMin
		const params: IModifierParams = {
			SourceIndex: target?.Index ?? -1,
			RawDamageBase: baseDamage || minDamage
		}
		const paramsTarget: IModifierParams = {
			SourceIndex: this.Owner.Index,
			RawDamageBase: params.RawDamageBase
		}
		const args = [false, 1, 1, params] as const,
			argsTarget = [false, 1, 1, paramsTarget] as const
		const bonus = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			...args
		)
		const bonusTarget = target?.ModifierManager.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_TARGET,
			...argsTarget
		)
		const percentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			...args
		)
		if (baseDamage !== undefined && baseDamage !== 0) {
			return Math.max((baseDamage + bonus + (bonusTarget ?? 0)) * percentage, 0)
		}
		return Math.max((minDamage + bonus + (bonusTarget ?? 0)) * percentage - minDamage)
	}
	public GetAbsoluteNoDamage(damageType: DAMAGE_TYPES, target: Unit): boolean {
		const params: IModifierParams = {
			SourceIndex: target.Index
		}
		const args = [false, params] as const
		switch (damageType) {
			case DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL:
				return (
					this.GetConstantFirstInternal(
						EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_MAGICAL,
						...args
					) !== 0
				)
			case DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL:
				return (
					this.GetConstantFirstInternal(
						EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PHYSICAL,
						...args
					) !== 0
				)
			case DAMAGE_TYPES.DAMAGE_TYPE_PURE:
				return (
					this.GetConstantFirstInternal(
						EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE,
						...args
					) !== 0
				)
			default:
				return true
		}
	}
	public GetHealthRegen(baseRegen: number): number {
		const bonus = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT,
			false,
			1,
			1
		)
		return baseRegen + bonus
	}
	public GetConstantFirstInternal(
		eModifierfunction: EModifierfunction,
		ignoreFlags: boolean = false,
		params?: IModifierParams
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 0
		}
		let highestValue = Number.MIN_SAFE_INTEGER
		for (let i = handlers.length - 1; i > -1; i--) {
			const [value, isFlagged] = handlers[i](params)
			if (isFlagged && !ignoreFlags) {
				continue
			}
			if (value > highestValue) {
				highestValue = value
			}
		}
		return highestValue === Number.MIN_SAFE_INTEGER ? 0 : highestValue
	}
	public GetConstantLowestInternal(
		eModifierfunction: EModifierfunction,
		ignoreFlags: boolean = false
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 0
		}
		let lowestValue = Number.MAX_VALUE
		for (let i = handlers.length - 1; i > -1; i--) {
			const [value, isFlagged] = handlers[i]()
			if (isFlagged && !ignoreFlags) {
				continue
			}
			if (value !== 0) {
				lowestValue = Math.min(lowestValue, value)
			}
		}
		return lowestValue === Number.MAX_VALUE ? 0 : lowestValue
	}
	public GetConstantHighestInternal(
		eModifierfunction: EModifierfunction,
		ignoreFlags: boolean = false,
		params?: IModifierParams
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 0
		}
		let result = 0
		for (let i = handlers.length - 1; i > -1; i--) {
			const [value, isFlagged] = handlers[i](params)
			if (isFlagged && !ignoreFlags) {
				continue
			}
			result = Math.max(result, isFlagged ? 0 : value)
		}
		return result
	}
	public GetConditionalAdditiveInternal(
		eModifierfunction: EModifierfunction,
		ignoreFlags: boolean = false,
		multiplier: number = 1,
		incoming: number = 0,
		params?: IModifierParams
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 0
		}
		let result = 0
		for (let i = handlers.length - 1; i > -1; i--) {
			const [value, isFlagged] = handlers[i](params)
			if (isFlagged && !ignoreFlags) {
				continue
			}
			result += value * (value < 0 ? incoming : multiplier)
		}
		return result
	}
	public GetConditionalPercentageInternal(
		eModifierfunction: EModifierfunction,
		ignoreFlags: boolean = false,
		multiplier: number = 1,
		reduction: number = 0,
		params?: IModifierParams
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 1
		}
		let totalResult = 100
		for (let i = handlers.length - 1; i > -1; i--) {
			const [value, isFlagged] = handlers[i](params)
			if (isFlagged && !ignoreFlags) {
				continue
			}
			totalResult += value * (value < 0 ? reduction : multiplier)
		}
		return totalResult / 100
	}
	public GetPercentageLowestInternal(
		eModifierfunction: EModifierfunction,
		ignoreFlags: boolean = false
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 1
		}
		let highestValue = 100
		for (let i = handlers.length - 1; i > -1; i--) {
			const [value, isFlagged] = handlers[i]()
			if (isFlagged && !ignoreFlags) {
				continue
			}
			highestValue = Math.min(value, highestValue)
		}
		return highestValue / 100
	}
	public GetPercentageHighestInternal(
		eModifierfunction: EModifierfunction,
		ignoreFlags: boolean = false
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 1
		}
		let result = 100
		for (let i = handlers.length - 1; i > -1; i--) {
			const [value, isFlagged] = handlers[i]()
			if (isFlagged && !ignoreFlags) {
				continue
			}
			result = Math.max(result, value)
		}
		return result / 100
	}
	public GetPercentageMultiplicativeInternal(
		eModifierfunction: EModifierfunction,
		ignoreFlags: boolean = false,
		isNegative: boolean = false,
		applyOnlyPositive: boolean = false,
		params?: IModifierParams
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 1
		}
		let aggregateValue = 1
		for (let i = handlers.length - 1; i > -1; i--) {
			const [handlerValue, isFlagged] = handlers[i](params)
			let value = handlerValue
			if (isFlagged && !ignoreFlags) {
				value = 0
			}
			if (value > 99.99) {
				if (!isNegative) {
					aggregateValue = 0
					break
				}
			} else if (!isNegative) {
				// positive case
				if (!applyOnlyPositive || value > 0) {
					aggregateValue *= 1 - value / 100
				}
			} else if (value < 0) {
				// negative case
				aggregateValue *= value / 100 + 1
			}
		}
		return 1 - aggregateValue + 1
	}
	/** @private NOTE: this is internal method */
	public AddOrRemoveInternal(
		eModifierfunctions: Nullable<ModifierMapFieldHandler>,
		isCreate: boolean
	): void {
		if (isCreate) {
			if (eModifierfunctions !== undefined) {
				eModifierfunctions.forEach((handler, eModifierfunction) =>
					this.addModifierFunctions(eModifierfunction, handler)
				)
			}
			return
		}
		if (eModifierfunctions !== undefined) {
			eModifierfunctions.forEach((handler, eModifierfunction) =>
				this.removeModifierFunctions(eModifierfunction, handler)
			)
		}
	}
	private addModifierFunctions(
		eModifierfunction: EModifierfunction,
		handler: ModifierHandlerValue
	): void {
		const modifiers = this.eModifierfunctions.get(eModifierfunction)
		if (modifiers !== undefined) {
			modifiers.push(handler)
			return
		}
		this.eModifierfunctions.set(eModifierfunction, [handler])
	}
	private removeModifierFunctions(
		eModifierfunction: EModifierfunction,
		handler: ModifierHandlerValue
	): void {
		const modifiers = this.eModifierfunctions.get(eModifierfunction)
		if (modifiers === undefined) {
			return
		}
		modifiers.remove(handler)
		if (modifiers.length === 0) {
			this.eModifierfunctions.delete(eModifierfunction)
		}
	}
}
