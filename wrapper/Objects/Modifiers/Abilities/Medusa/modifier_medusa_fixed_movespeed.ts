import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_medusa_fixed_movespeed extends Modifier {
	private cachedSpeed = 0
	private cachedSpeedMax = 0
	private cachedGazeSpeedMax = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MAX,
			this.GetMoveSpeedAbsoluteMax.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedSpeed = this.cachedSpeedMax
			return
		}
		const hasGaze = owner.HasBuffByName("modifier_medusa_stone_gaze")
		this.cachedSpeed = hasGaze ? this.cachedGazeSpeedMax : this.cachedSpeedMax
	}

	protected GetMoveSpeedAbsoluteMax(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "medusa_undulation"
		this.cachedSpeedMax = this.GetSpecialValue("fixed_movespeed", name)
		this.cachedGazeSpeedMax = this.GetSpecialValue("stone_gaze_ms_tooltip_only", name)
	}
}
