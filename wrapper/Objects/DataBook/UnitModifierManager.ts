import {
	ArmorPerAgility,
	AttackSpeedData,
	MagicResistPerIntellect,
	MoveSpeedData
} from "../../Data/GameData"
import { Attributes } from "../../Enums/Attributes"
import { EModifierfunction } from "../../Enums/EModifierfunction"
import { ModifierHandlerValue, ModifierMapFieldHandler } from "../Base/Modifier"
import { Unit } from "../Base/Unit"

type ModifierfunctionMap = Map<EModifierfunction, ModifierHandlerValue[]>

export class UnitModifierManager {
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
		const bonus = this.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			false,
			1,
			1
		)
		const bonusPercentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_PERCENTAGE,
			false,
			1,
			1
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
		const { Min, Max } = MoveSpeedData,
			nightSpeed = this.Owner.MoveSpeedNightBonus

		let slowValue = 1
		if (isUnslowable || this.Owner.IsUnslowable) {
			slowValue = 0
		}

		const reductionPercentage = this.GetPercentageLowestInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_REDUCTION_PERCENTAGE
		)

		const slowResistUnique =
			this.GetConstantHighestInternal(
				EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_UNIQUE
			) / 100

		const slowResistStacking = this.GetPercentageMultiplicativeInternal(
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING
		)

		const reductionValue = reductionPercentage * slowValue
		const effSlowResist = (1 - (slowResistStacking - 1)) * (1 - slowResistUnique)
		const effReduction = (1 - (1 - effSlowResist)) * reductionValue

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

		const effBonusPercentage = bonusPercentageUnique / 100

		let calculatedSpeed = Math.max(
			(bonusUnique +
				bonusConstantUnique2 +
				bonusConstantUnique +
				(bonusConstant + baseSpeed + nightSpeed)) *
				(effBonusPercentage + bonusPercentage),
			Min
		)

		const ignoreSpeedLimit = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT
		)

		if (ignoreSpeedLimit === 0 && calculatedSpeed >= Max) {
			calculatedSpeed = Max
		}

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
	public GetMagicResistance(baseResist: number): number {
		const bonus = this.GetPercentageMultiplicativeInternal(
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS
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
	// NOTE: It is necessary to study in more detail what this Valve is used
	// public GetPostPhysicalArmor(baseArmor: number): number {
	// 	const baseBonus = this.GetBaseBonusPhysicalArmor(baseArmor)
	// 	const bonusPost = this.GetConditionalAdditiveInternal(
	// 		EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_POST,
	// 		false,
	// 		1,
	// 		1
	// 	)
	// 	const minPhysical = this.GetConstantLowestInternal(
	// 		EModifierfunction.MODIFIER_PROPERTY_MIN_PHYSICAL_ARMOR
	// 	)
	// 	const totalBonus = minPhysical - (baseBonus + bonusPost)
	// }
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
		const bonusVisionPercentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_BONUS_VISION_PERCENTAGE,
			false,
			1,
			1
		)
		const bonusDayVisionPercentage = this.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION_PERCENTAGE,
			false,
			1,
			1
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
	public GetStatusResistance(): number {
		const status = this.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE
		)
		const stacking = this.GetPercentageMultiplicativeInternal(
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING
		)
		return Math.min(1 - (1 - (stacking - 1)) * (1 - status / 100), Number.MAX_VALUE)
	}
	public GetConstantFirstInternal(
		eModifierfunction: EModifierfunction,
		ignoreFlags: boolean = false
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 0
		}
		let highestValue = Number.MIN_SAFE_INTEGER
		for (let i = handlers.length - 1; i > -1; i--) {
			const [value, isFlagged] = handlers[i]()
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
		ignoreFlags: boolean = false
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 0
		}
		let result = 0
		for (let i = handlers.length - 1; i > -1; i--) {
			const [value, isFlagged] = handlers[i]()
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
		incoming: number = 0
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 0
		}
		let result = 0
		for (let i = handlers.length - 1; i > -1; i--) {
			const [value, isFlagged] = handlers[i]()
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
		reduction: number = 0
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 1
		}
		let totalResult = 100
		for (let i = handlers.length - 1; i > -1; i--) {
			const [value, isFlagged] = handlers[i]()
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
			if (value !== 0) {
				highestValue = Math.min(value, highestValue)
			}
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
			if (value !== 0) {
				result = Math.max(result, value)
			}
		}
		return result / 100
	}
	public GetPercentageMultiplicativeInternal(
		eModifierfunction: EModifierfunction,
		ignoreFlags: boolean = false,
		isNegative: boolean = false,
		applyOnlyPositive: boolean = false
	) {
		const handlers = this.eModifierfunctions.get(eModifierfunction)
		if (handlers === undefined || handlers.length === 0) {
			return 1
		}
		let aggregateValue = 1
		for (let i = handlers.length - 1; i > -1; i--) {
			const [handlerValue, isFlagged] = handlers[i]()
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
