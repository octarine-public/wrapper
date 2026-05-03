import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rubick_curiosity extends Modifier {
	private cachedAoe = 0
	private cachedFactor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT,
			this.GetAoeBonusConstant.bind(this)
		]
	])
	protected GetAoeBonusConstant(): [number, boolean] {
		const val = this.cachedAoe,
			level = this.Parent?.Level ?? 1,
			stack = this.StackCount * val
		return [val * level * this.cachedFactor + stack, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		const name = "rubick_curiosity"
		this.cachedAoe = this.GetSpecialValue("curiosity_aoe_bonus", name)
		this.cachedFactor = Math.max(this.GetSpecialValue("curiosity_factor", name), 1)
	}
}
