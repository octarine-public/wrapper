import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_crystal_maiden_brilliance_aura extends Modifier {
	protected SetBonusAOERadiusAmplifier(
		specialName = "aoe_bonus",
		subtract = false
	): void {
		const owner = this.Caster
		if (specialName === undefined || owner === undefined) {
			this.BonusAOERadiusAmplifier = 0
			return
		}
		const freezingField = owner.GetAbilityByName("crystal_maiden_freezing_field")
		if (freezingField === undefined) {
			this.BonusAOERadiusAmplifier = 0
			return
		}
		const value = freezingField.GetSpecialValue(specialName)
		this.BonusAOERadiusAmplifier = (subtract ? value * -1 : value) / 100
	}

	protected SetBonusCastRange(
		specialName = "self_cast_range_bonus",
		subtract = false
	): void {
		const owner = this.Caster
		if (specialName === undefined || owner === undefined) {
			this.BonusCastRange = 0
			return
		}
		const freezingField = owner.GetAbilityByName("crystal_maiden_freezing_field")
		if (freezingField === undefined) {
			this.BonusCastRange = 0
			return
		}
		const value = freezingField.GetSpecialValue(specialName)
		this.BonusCastRange = subtract ? value * -1 : value
	}
}
