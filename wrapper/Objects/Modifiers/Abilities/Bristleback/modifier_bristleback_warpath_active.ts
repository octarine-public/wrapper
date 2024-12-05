import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { modifier_bristleback_warpath } from "./modifier_bristleback_warpath"

@WrapperClassModifier()
export class modifier_bristleback_warpath_active extends Modifier {
	private cachedSpeed = 0
	private cachedSpeedOffset = 0

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
		const modifier = owner.GetBuffByClass(modifier_bristleback_warpath)
		if (modifier === undefined) {
			this.cachedSpeed = 0
			return
		}
		const halfSpeed = (100 - this.cachedSpeedOffset) / 100
		this.cachedSpeed = modifier.CachedMoveSpeed * modifier.StackCount * halfSpeed
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeedOffset = this.GetSpecialValue(
			"active_bonus_movement_percent",
			"bristleback_warpath"
		)
	}
}
