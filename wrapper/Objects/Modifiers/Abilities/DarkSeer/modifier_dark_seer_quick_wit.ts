import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dark_seer_quick_wit extends Modifier {
	private cachedAttackSpeedPct = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [(this.Parent?.TotalIntellect ?? 0) * this.cachedAttackSpeedPct, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAttackSpeedPct = this.GetSpecialValue(
			"int_to_atkspd",
			"dark_seer_quick_wit"
		)
	}
}
