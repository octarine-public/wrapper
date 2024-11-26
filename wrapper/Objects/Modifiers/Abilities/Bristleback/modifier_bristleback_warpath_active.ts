import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_warpath_active extends Modifier {
	private cachedSpeed = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedSpeed = 0
			return
		}
		const modifier = owner.GetBuffByName("modifier_bristleback_warpath")
		if (modifier === undefined) {
			this.cachedSpeed = 0
			return
		}
		this.cachedSpeed = modifier.StackCount
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
}
