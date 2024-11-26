import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_razor_static_link_buff extends Modifier {
	private canBeStealAS = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return this.canBeStealAS !== 0 ? [this.StackCount, false] : [0, false]
	}

	protected UpdateSpecialValues(): void {
		this.canBeStealAS = this.GetSpecialValue(
			"attack_speed_factor",
			"razor_static_link"
		)
	}
}
