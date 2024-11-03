import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_dustofappearance extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.CalculateModifierMoveSpeedPercentage.bind(this)
		]
	])

	protected CalculateModifierMoveSpeedPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		return [owner.IsInvisible ? this.NetworkMovementSpeed : 0, this.IsMagicImmune()]
	}
}
