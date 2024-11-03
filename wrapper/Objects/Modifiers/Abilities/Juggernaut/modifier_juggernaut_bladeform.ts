import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_juggernaut_bladeform extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedMaxStacks = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [Math.min(this.StackCount, this.cachedMaxStacks), false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedMaxStacks = this.GetSpecialValue("max_stacks", "juggernaut_bladeform")
	}
}
