import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_abaddon_frostmourne_buff extends Modifier {
	public readonly IsBuff = true

	protected SetBonusAttackSpeed(
		specialName = "curse_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
