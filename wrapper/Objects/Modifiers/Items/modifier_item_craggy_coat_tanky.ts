import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_craggy_coat_tanky extends Modifier {
	public readonly IsDebuff = true

	protected SetBonusMoveSpeed(specialName = "move_speed", subtract = true): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
