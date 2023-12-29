import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_bullwhip_buff extends Modifier {
	public readonly IsBuff = true
	public readonly IsDebuff = true

	protected SetAmplifierMoveSpeed(
		specialName = "speed",
		subtract = this.IsEnemy()
	): void {
		super.SetAmplifierMoveSpeed(specialName, subtract)
	}
}
