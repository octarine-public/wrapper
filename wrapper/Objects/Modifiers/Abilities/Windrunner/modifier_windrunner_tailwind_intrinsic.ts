import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_windrunner_tailwind_intrinsic extends Modifier {
	private cachedMaxSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_LIMIT,
			this.GetMoveSpeedLimit.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_MAX_OVERRIDE,
			this.GetMoveSpeedMaxOverride.bind(this)
		]
	])
	protected GetMoveSpeedLimit(): [number, boolean] {
		return [this.cachedMaxSpeed, false]
	}
	protected GetMoveSpeedMaxOverride(): [number, boolean] {
		return [this.cachedMaxSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedMaxSpeed = this.GetSpecialValue("max_movespeed", "windrunner_tailwind")
	}
}
