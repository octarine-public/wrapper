import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_nevermore_frenzy extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = "bonus_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
	protected SetBonusCastPointAmplifier(
		_specialName = "cast_speed_pct",
		subtract = false
	): void {
		// error in special data
		// use super.SetBonusCastPointAmplifier after fix
		const value = 40 // this.GetSpecialValue(specialName)
		this.BonusCastPointAmplifier = (subtract ? value * -1 : value) / 100
		// super.SetBonusCastPointAmplifier(specialName, subtract)
	}
}
