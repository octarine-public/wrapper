import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_windrunner_easy_breezy extends Modifier {
	private cachedSpeedMin = 0
	private cachedSpeedMax = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_LIMIT,
			this.GetMoveSpeedLimit.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_MAX_OVERRIDE,
			this.GetMoveSpeedMaxOverride.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
			this.GetMoveSpeedAbsoluteMin.bind(this)
		]
	])

	protected GetMoveSpeedMaxOverride(): [number, boolean] {
		return [this.cachedSpeedMax, false]
	}
	protected GetMoveSpeedAbsoluteMin(): [number, boolean] {
		return [this.cachedSpeedMin, false]
	}
	protected GetMoveSpeedLimit(): [number, boolean] {
		return [this.cachedSpeedMax, false]
	}
	protected UpdateSpecialValues() {
		const name = "windrunner_easy_breezy"
		this.cachedSpeedMin = this.GetSpecialValue("min_movespeed", name)
		this.cachedSpeedMax = this.GetSpecialValue("max_movespeed", name)
	}
}
