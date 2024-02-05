import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_butterfly extends Modifier {
	public readonly AmplifierBaseAttackSpeedStack = true

	protected SetBonusBaseAttackSpeedAmplifier(
		specialName = "bonus_attack_speed_pct",
		subtract = false
	) {
		super.SetBonusBaseAttackSpeedAmplifier(specialName, subtract)
	}
}
