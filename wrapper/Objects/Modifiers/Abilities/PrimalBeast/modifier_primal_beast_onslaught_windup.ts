import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_onslaught_windup extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DISABLE_TURNING,
			this.GetDisableTurning.bind(this)
		]
	])

	protected GetDisableTurning(): [number, boolean] {
		return [1, false]
	}
}
