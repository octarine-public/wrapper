import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_hexxed extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE,
			this.GetMoveSpeedBaseOverride.bind(this)
		]
	])

	protected GetMoveSpeedBaseOverride(): [number, boolean] {
		return [100 /** no special data */, this.IsMagicImmune()]
	}
}
