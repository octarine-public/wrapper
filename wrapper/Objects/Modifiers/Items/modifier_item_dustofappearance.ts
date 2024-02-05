import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_dustofappearance extends Modifier {
	public readonly IsDebuff = true
	public readonly CustomAbilityName = "item_dust"

	protected SetMoveSpeedAmplifier(specialName = "movespeed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	protected GetSpecialMoveSpeedByState(specialName: string): number {
		const specialValue = this.GetSpecialValue(specialName)
		return !this.ShouldUnslowable() && this.IsInvisible() ? specialValue : 0
	}
}
