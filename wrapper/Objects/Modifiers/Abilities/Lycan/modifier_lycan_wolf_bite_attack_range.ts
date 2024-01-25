import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lycan_wolf_bite_attack_range extends Modifier {
	public SetFixedAttackRange(specialName = "attack_range", subtract = false): void {
		super.SetFixedAttackRange(specialName, subtract)
	}
}
