import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_troll_warlord_battle_trance extends Modifier {
	public readonly IsAttackSpeedLimit = false

	public SetBonusAttackSpeed(specialName = "attack_speed", subtract = false): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
