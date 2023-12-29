import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_dustofappearance extends Modifier {
	public readonly IsDebuff = true

	protected SetAmplifierMoveSpeed(specialName = "movespeed", subtract = false): void {
		super.SetAmplifierMoveSpeed(specialName, subtract)
	}

	protected GetSpecialValueByState(specialName: string): number {
		let value = this.GetSpecialValue(specialName)
		if (this.IsUnslowable() || this.IsMagicImmune() || this.IsDebuffImmune()) {
			value = 0
		}
		return !this.IsInvisible() ? 0 : value
	}
}
