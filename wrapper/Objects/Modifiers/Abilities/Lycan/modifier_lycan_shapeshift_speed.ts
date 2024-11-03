import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lycan_shapeshift_speed extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
			this.GetMoveSpeedAbsoluteMin.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedAbsoluteMin(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue("speed", "lycan_shapeshift")
	}
}
