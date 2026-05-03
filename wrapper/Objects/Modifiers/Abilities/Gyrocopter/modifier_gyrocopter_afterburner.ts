import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_gyrocopter_afterburner extends Modifier implements IBuff {
	public readonly IsHidden: boolean = false
	public readonly BuffModifierName: string = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.StackCount, false]
	}
	protected UpdateSpecialValues(): void {
		// only debug
		this.GetSpecialValue("bonus_movement_speed_per_hit", "gyrocopter_afterburner")
	}
}
