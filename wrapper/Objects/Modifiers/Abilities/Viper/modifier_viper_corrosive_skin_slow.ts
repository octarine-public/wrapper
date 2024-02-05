import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_viper_corrosive_skin_slow extends Modifier {
	public readonly IsDebuff = true

	public SetBonusAttackSpeed(
		specialName = "bonus_attack_speed",
		subtract = true
	): void {
		const value = this.GetSpecialAttackSpeed(specialName)
		this.BonusAttackSpeed = subtract ? value * -1 : value
	}

	private GetSpecialAttackSpeed(specialName: string) {
		const owner = this.Parent,
			caster = this.Caster
		if (caster === undefined || owner === undefined) {
			return 0
		}
		let value = this.GetSpecialAttackSpeedByState(specialName)
		if (caster.HasScepter) {
			const distance = owner.Distance2D(caster)
			const multiplier = this.GetSpecialValue("effect_multiplier")
			const effectDist = this.GetSpecialValue("effect_multiplier_distance")
			value *= distance <= effectDist ? multiplier : 1
		}
		return value
	}
}
