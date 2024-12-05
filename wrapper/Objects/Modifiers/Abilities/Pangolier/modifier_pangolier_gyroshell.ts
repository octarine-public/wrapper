import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pangolier_gyroshell extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DISABLE_TURNING,
			this.GetDisableTurning.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_LIMIT,
			this.GetMoveSpeedLimit.bind(this)
		]
	])

	protected GetDisableTurning(): [number, boolean] {
		return [1, false]
	}

	protected GetMoveSpeedLimit(): [number, boolean] {
		return [-1, false]
	}
}
