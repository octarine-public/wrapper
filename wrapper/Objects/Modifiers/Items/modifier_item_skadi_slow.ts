import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_skadi_slow extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private slowMelee = 0
	private slowRanged = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		return [owner.IsRanged ? this.slowRanged : this.slowMelee, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		const name = "item_skadi"
		this.slowMelee = this.GetSpecialValue("cold_slow_melee", name)
		this.slowRanged = this.GetSpecialValue("cold_slow_ranged", name)
	}
}
