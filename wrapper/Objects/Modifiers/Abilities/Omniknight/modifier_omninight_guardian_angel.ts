import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_omninight_guardian_angel extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PHYSICAL,
			this.GetAbsoluteNoDamagePhysical.bind(this)
		]
	])
	protected GetAbsoluteNoDamagePhysical(): [number, boolean] {
		return [1, false]
	}
}
