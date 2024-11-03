import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_corrosive_weaponry_debuff extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedMaxStacks = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const stackCount = Math.min(this.StackCount, this.cachedMaxStacks)
		return [-(this.cachedSpeed * stackCount), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "alchemist_corrosive_weaponry"
		this.cachedSpeed = this.GetSpecialValue("slow_per_stack", name)
		this.cachedMaxStacks = this.GetSpecialValue("max_stacks", name)
	}
}
