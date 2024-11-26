import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_phoenix_fire_spirit_burn extends Modifier {
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAttackSpeed = this.GetSpecialValue(
			"attackspeed_slow",
			"phoenix_launch_fire_spirit"
		)
	}
}
