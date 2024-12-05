import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_undying_flesh_golem extends Modifier {
	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.cachedArmor, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue("movement_bonus", "undying_flesh_golem")
	}
}
