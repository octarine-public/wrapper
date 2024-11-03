import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_windrunner_easy_breezy extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
			this.GetMoveSpeedAbsoluteMin.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT,
			this.GetIgnoreMoveSpeedLimit.bind(this)
		]
	])

	private cachedSpeedMin = 0

	protected GetMoveSpeedAbsoluteMin(): [number, boolean] {
		return [this.cachedSpeedMin, false]
	}

	protected GetIgnoreMoveSpeedLimit(): [number, boolean] {
		return [1, false]
	}

	protected UpdateSpecialValues() {
		const name = "windrunner_easy_breezy"
		this.cachedSpeedMin = this.GetSpecialValue("min_movespeed", name)
	}
}
