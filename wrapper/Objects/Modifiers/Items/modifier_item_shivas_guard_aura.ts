import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"
@WrapperClassModifier()
export class modifier_item_shivas_guard_aura extends Modifier {
	public readonly IsDebuff = true

	protected SetBonusAttackSpeed(specialName = "aura_attack_speed", subtract = false) {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
