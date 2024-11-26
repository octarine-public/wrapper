import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_butterfly extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	private cachedAttackSpeed = 0

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const baseInc = owner.BaseAttackSpeedIncrease,
			value = baseInc * (this.cachedAttackSpeed / 100)
		return [value, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAttackSpeed = this.GetSpecialValue(
			"bonus_attack_speed_pct",
			"item_butterfly"
		)
	}
}
