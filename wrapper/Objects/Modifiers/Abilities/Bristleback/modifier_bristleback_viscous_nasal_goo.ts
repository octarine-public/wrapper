import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_viscous_nasal_goo extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSlow = 0
	private cachedBaseSlow = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const slowPerStack = this.cachedSlow * this.StackCount
		return [-(slowPerStack + this.cachedBaseSlow), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "bristleback_viscous_nasal_goo"
		this.cachedSlow = this.GetSpecialValue("move_slow_per_stack", name)
		this.cachedBaseSlow = this.GetSpecialValue("base_move_slow", name)
	}
}
