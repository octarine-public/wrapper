import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_mirror_shield extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_LINKEN_PROTECTION,
			this.GetLinkenProtection.bind(this)
		]
	])
	protected GetLinkenProtection(): [number, boolean] {
		return [(this.Ability?.IsReady ?? false) ? 1 : 0, false]
	}
}
