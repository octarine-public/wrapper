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
		specialName = "cast_speed_pct_tooltip",
		subtract = false
	): void {
		// error in special data "cast_speed_pct"
		// use super.SetBonusCastPointAmplifier after fix
		const value = this.GetSpecialValue(specialName)
		this.BonusCastPointAmplifier = Math.max(
			(subtract ? value * -1 : value) / 100 - 1,
			0
		)
		// super.SetBonusCastPointAmplifier(specialName, subtract)
	}
}
