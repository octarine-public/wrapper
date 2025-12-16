import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { ISpecialValueOptions } from "../../../DataBook/AbilityData"

@WrapperClassModifier()
export class modifier_brewmaster_liquid_courage_passive extends Modifier {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private minHealthThreshold = 0
	private maxHealthThreshold = 0
	private statusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])
	private get gealthBasedScaling(): number {
		const owner = this.Parent
		if (owner === undefined) {
			return 0
		}
		const hp = owner.HPPercent,
			minHP = this.minHealthThreshold,
			maxHP = this.maxHealthThreshold
		if (minHP <= maxHP || hp >= minHP) {
			return 0
		}
		if (hp <= maxHP) {
			return 1
		}
		return (minHP - hp) / (minHP - maxHP)
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const value = this.NetworkActivity
		if (value === 0) {
			return [0, false]
		}
		if (this.NetworkSubtle) {
			return [value, false]
		}
		const strength = this.gealthBasedScaling
		if (strength === 0) {
			return [0, false]
		}
		return [value * strength, false]
	}
	protected GetStatusResistanceStacking(): [number, boolean] {
		if (this.NetworkSubtle) {
			return [this.statusResist, false]
		}
		const strength = this.gealthBasedScaling
		if (strength === 0) {
			return [0, false]
		}
		return [this.statusResist * strength, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "brewmaster_liquid_courage"
		this.statusResist = this.GetSpecialValue("status_resist", name)
		this.minHealthThreshold = this.GetSpecialValue("min_health_threshold", name)
		this.maxHealthThreshold = this.GetSpecialValue("max_health_threshold", name)
	}
	protected GetSpecialValue(
		specialName: string,
		abilityName: string,
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1),
		optional?: ISpecialValueOptions
	): number {
		switch (specialName) {
			case "status_resist":
				return super.GetSpecialValue(specialName, abilityName, level, {
					lvlup: {
						subtract: 1,
						operation: EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
					}
				})
			default:
				return super.GetSpecialValue(specialName, abilityName, level, optional)
		}
	}
}
